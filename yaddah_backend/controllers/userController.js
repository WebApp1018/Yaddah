const fs = require('fs');
const path = require('path');
const excel = require('excel4node');
const { v4: uuidv4 } = require('uuid');
const io = require('../utils/socket');
const User = require('../models/userModel');
const Report = require('../models/reportModel');
const Booking = require('../models/bookingModel');
const Staff = require('../models/staffModel');
const Venue = require('../models/venueModel');
const Room = require('../models/roomModel');
const Transaction = require('../models/transactionModel');
const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { createNotification } = require('../controllers/notificationController');
const { deleteFile } = require('../utils/fileUpload');
const moment = require('moment');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const {
  fullRefundPayment,
  generateAccessToken,
  getTransactionDetailBySubscriptionId,
} = require('../utils/paypal');
const { uploadServerFile } = require('../utils/fileUpload');
const Revenue = require('../models/revenueModel');
const { WEB_HOSTED_URL } = process.env;

const notificationHandler = async (
  sender,
  receiver,
  message,
  listing = null,
  forr,
  notfTitle,
  fcmToken,
  purpose
) => {
  await createNotification(
    { title: notfTitle, fcmToken },
    {
      sender,
      receiver,
      message,
      for: forr,
      title: notfTitle,
      listing,
      ...(purpose && { purpose: 'package' }),
    }
  );
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { user } = req;
  const files = req.files;
  let updatedUser;

  if (files?.photo) {
    if (user.photo && user.photo !== 'default.png')
      await deleteFile(user.photo);
    req.body.photo = await uploadFilesToS3(files, 'photo', 0, 25);
  }

  // 3) Update user document
  updatedUser = await User.findByIdAndUpdate(user?.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

// exports.getUser = factory.getOne(User);
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).lean();

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;

  const { role, search, noPagination } = req.query;

  let query = {
    role,
    isActive: true,
    isBlockedByAdmin: false,
    ...(search &&
      search != '' && {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { contact: { $regex: search, $options: 'i' } },
        ],
      }),
  };

  const users =
    noPagination && noPagination == 'true'
      ? await User.find(query).populate('portfolio')
      : await User.find(query)
          .populate('portfolio')
          .sort('-updatedAt -createdAt')
          .skip(skip)
          .limit(limit);

  const totalCount = await User.countDocuments({ role, isActive: true });

  res.status(200).json({
    status: 'success',
    results: users?.length || 0,
    totalCount,
    data: users,
  });
});

exports.getAllServiceProviders = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;

  let { search } = req.query;

  let query = {
    role: 'service-provider',
    status: 'accepted',
    isBlockedByAdmin: false,
    ...(search &&
      search != '' && {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }),
  };

  const users = await User.find(query)
    .populate('serviceCategory')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: users?.length || 0,
    totalCount,
    data: users,
  });
});

exports.verifyEmailBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const checkUser = await User.findOne({ slug });

  if (!checkUser) return next(new AppError('User not found', 400));

  await User.findByIdAndUpdate(
    checkUser._id,
    { isEmailVerified: true },
    { new: true }
  );

  res.redirect(`${WEB_HOSTED_URL}login`);
});

exports.getAllUsersForAdmin = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;

  let { search, status, role } = req.query;

  let query = {
    ...(role && { role }),
    ...(status && status == 'all'
      ? {
          status: { $in: ['pending', 'accepted', 'rejected'] },
        }
      : status == 'activated'
      ? { isBlockedByAdmin: false }
      : status == 'deactivated'
      ? { isBlockedByAdmin: true }
      : { status }),
    ...(search &&
      search != '' && {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }),
  };

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: users?.length || 0,
    totalCount,
    data: users,
  });
});

exports.acceptRejectUser = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    let paypalTransactionDetail = null;

    if (status == 'rejected' && !reason)
      return next(new AppError('Reason is required', 400));

    if (!['accepted', 'rejected'].includes(status))
      return next(new AppError('Invalid status', 400));

    const user = await User.findById(id);

    if (!user) return next(new AppError('User not found', 400));

    if (user.role == 'service-provider' && status == 'rejected') {
      if (user.planType != 'Free') {
        const paypalAccessToken = await generateAccessToken();
        paypalTransactionDetail = await getTransactionDetailBySubscriptionId(
          paypalAccessToken,
          user.paypalSubscriptionId
        );
        // const foundTransaction = await Transaction.find({
        //   serviceProvider: id,
        //   status: 'deposited',
        // }).sort({ createdAt: -1 });
        const result = await fullRefundPayment(
          paypalAccessToken,
          paypalTransactionDetail?.id,
          reason
        );

        if (result && result.status == 'COMPLETED') {
          await deleteFile(user.photo);
          await deleteFile(user.commercialLicense);
          await Transaction.findOneAndDelete({ serviceProvider: id });
          await User.findByIdAndDelete(id);
        } else return next(new AppError('Payment refund failed.', 400));
      } else {
        await deleteFile(user.photo);
        await deleteFile(user.commercialLicense);
        await Transaction.findOneAndDelete({ serviceProvider: id });
        await User.findByIdAndDelete(id);
      }
    }
    if (
      user.role == 'service-provider' &&
      status == 'accepted' &&
      user.planType != 'Free'
    ) {
      const paypalAccessToken = await generateAccessToken();
      paypalTransactionDetail = await getTransactionDetailBySubscriptionId(
        paypalAccessToken,
        user.paypalSubscriptionId
      );
      await Transaction.findOneAndUpdate(
        { serviceProvider: id },
        { captureId: paypalTransactionDetail?.id }
      );
    }
    if (user.role == 'customer' && status == 'rejected')
      await User.findByIdAndDelete(id);

    if (status == 'rejected')
      await new Email(user)
        .accountRejectionEmail({ fullName: user.fullName, reason })
        .catch((e) => console.log(e));

    const doc = await User.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (error) {
    const errorMessage =
      error?.message ||
      error?.response?.data?.details[0]?.description ||
      error?.response?.data?.message;
    return next(new AppError(errorMessage, 400));
  }
});

exports.blockUnblockUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findById(id);

  if (!user) return next(new AppError('User not found', 400));

  if (user.isBlockedByAdmin == status)
    return next(
      new AppError(`User already ${status ? 'blocked' : 'unblocked'}.`, 400)
    );

  const doc = await User.findByIdAndUpdate(
    id,
    { isBlockedByAdmin: status },
    { new: true }
  );

  if (doc.isBlockedByAdmin) io.getIO().emit('user-blocked', doc);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

//View User Detail
exports.viewUserDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await User.findById(id);
  if (!doc) return next(new AppError('User not found', 400));

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllRatings = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  const query = {
    role: 'service-provider',
    ...(status && status == 'all'
      ? { userRating: { $in: ['top-rated', 'preferred'] } }
      : { userRating: status }),
    ...(search &&
      search != '' && {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
        ],
      }),
  };

  const doc = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    totalCount,
    data: doc,
  });
});

exports.getAllAdminTransactions = catchAsync(async (req, res) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const startOfMonth = new Date(moment().startOf('month').format());
  const endOfMonth = new Date(moment().endOf('month').format());

  const startOfLastMonth = new Date(
    moment().add(-1, 'month').startOf('month').format()
  );
  const endOfLastMonth = new Date(
    moment().add(-1, 'month').endOf('month').format()
  );

  const aggregateQuery = [
    {
      $match: {
        transferFrom: 'service-provider',
        admin: req.user._id,
      },
    },
    {
      $project: {
        _id: 1,
        amount: 1,
      },
    },
    {
      $group: {
        _id: '$amount',
        amount: { $sum: '$amount' },
      },
    },
    {
      $project: { _id: 0, amount: 1 },
    },
  ];

  const totalEarnings = await Transaction.aggregate(aggregateQuery);

  const aggregationCopy = aggregateQuery.slice(1);

  const thisMonthEarningsAggregation = [
      ...[
        {
          $match: {
            admin: req.user._id,
            transferFrom: 'service-provider',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
      ],
      ...aggregationCopy,
    ],
    lastMonthEarningsAggregation = [
      ...[
        {
          $match: {
            admin: req.user._id,
            transferFrom: 'service-provider',
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
      ],
      ...aggregationCopy,
    ];

  const thisMonthEarnings = await Transaction.aggregate(
    thisMonthEarningsAggregation
  );

  const lastMonthEarnings = await Transaction.aggregate(
    lastMonthEarningsAggregation
  );

  const totalCount = await User.countDocuments({
    role: 'service-provider',
    subscriptionExpired: false,
  });

  const serviceProviders = await User.find({
    role: 'service-provider',
    subscriptionExpired: false,
  })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    totalCount,
    data: serviceProviders,
    earnings: {
      totalEarnings: totalEarnings[0]?.amount || 0,
      thisMonth: thisMonthEarnings[0]?.amount || 0,
      lastMonth: lastMonthEarnings[0]?.amount || 0,
    },
  });
});
exports.getAllAdminRevenues = catchAsync(async (req, res) => {
  let { status, page, limit } = req.query;
  // for pagination
  page = page * 1 || 1;
  limit = limit * 1 || 15;
  const skip = (page - 1) * limit;
  const query = {
    packageType:
      status == 'all' ? { $in: ['Silver', 'Gold', 'Platinum'] } : status,
  };

  // get All Revenues
  const serviceProviders = await Revenue.find(query)
    .populate('serviceProvider')
    .skip(skip)
    .limit(limit);
  //  get total count of revenues
  const totalCount = await Revenue.countDocuments(query);

  const startOfMonth = new Date(moment().startOf('month').format());
  const endOfMonth = new Date(moment().endOf('month').format());

  const startOfLastMonth = new Date(
    moment().add(-1, 'month').startOf('month').format()
  );
  const endOfLastMonth = new Date(
    moment().add(-1, 'month').endOf('month').format()
  );

  // get sum of all amount of revenues
  const totalEarnings = await Revenue.aggregate([
    { $group: { _id: null, amount: { $sum: '$amount' } } },
  ]);
  // get sum of all amount of revenues of this month
  const thisMonthEarnings = await Revenue.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, amount: { $sum: '$amount' } } },
  ]);
  // get sum of all amount of revenues of last month
  const lastMonthEarnings = await Revenue.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      },
    },
    { $group: { _id: null, amount: { $sum: '$amount' } } },
  ]);

  res.status(200).json({
    status: 'success',
    totalCount,
    data: serviceProviders,
    earnings: {
      totalEarnings: totalEarnings[0]?.amount || 0,
      thisMonth: thisMonthEarnings[0]?.amount || 0,
      lastMonth: lastMonthEarnings[0]?.amount || 0,
    },
  });
});

exports.generateFileOfAllAdminRevenues = catchAsync(async (req, res, next) => {
  let { status = 'all' } = req.query;

  const query = {
    packageType:
      status == 'all' ? { $in: ['Silver', 'Gold', 'Platinum'] } : status,
  };

  // get All Revenues
  const getAllRevenues = await Revenue.find(query)
    .populate('serviceProvider')
    .sort({ createdAt: -1 });

  if (getAllRevenues.length <= 0) {
    return next(new AppError('No Revenue records find to export .', 400));
  }

  // const workbook = new excel.Workbook();
  // const worksheet = workbook.addWorksheet('Sheet 1');

  // const fileName = `revenue${uuidv4()}.xlsx`;

  // const _path = path.join(__dirname, '..', 'public', 'reports', fileName);

  // // Create a reusable style
  // const style = workbook.createStyle({
  //   font: {
  //     color: '#000000',
  //     size: 12,
  //   },
  //   numberFormat: '$#,##0.00; ($#,##0.00); -',
  // });

  // const headingStyle = workbook.createStyle({
  //   font: {
  //     color: '#000000',
  //     size: 11,
  //     weight: 'bold',
  //   },
  //   numberFormat: '$#,##0.00; ($#,##0.00); -',
  // });

  // worksheet.cell(1, 1).string('Id').style(headingStyle);
  // worksheet.cell(1, 2).string('Service Provider').style(headingStyle);
  // worksheet.cell(1, 3).string('Email').style(headingStyle);
  // worksheet.cell(1, 4).string('Package').style(headingStyle);
  // worksheet.cell(1, 5).string('Duration').style(headingStyle);
  // worksheet.cell(1, 6).string('Date').style(headingStyle);
  // worksheet.cell(1, 7).string('Amount').style(headingStyle);

  // getAllRevenues.forEach((item, index) => {
  //   worksheet
  //     .cell(index + 2, 1)
  //     .string(`${index + 1}`.toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 2)
  //     .string(item?.serviceProvider?.userName?.toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 3)
  //     .string(item?.serviceProvider?.email?.toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 4)
  //     .string(item?.packageType?.toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 5)
  //     .string(item?.duration?.toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 6)
  //     .string(moment(item?.createdAt).format('lll').toString())
  //     .style(style);
  //   worksheet
  //     .cell(index + 2, 7)
  //     .string(`$${item?.amount}`.toString())
  //     .style(style);
  // });

  // workbook.write(_path);

  // setTimeout(async () => {
  //   await uploadServerFile(_path);
  //   fs.unlinkSync(_path);
  // }, 1000);

  res.status(200).json({
    status: 'success',
    data: getAllRevenues,
  });
});

exports.getAllUserTransactions = catchAsync(async (req, res) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { earnings } = req.query;

  const dbQuery = {
    ...(earnings == 'true' && { transferFrom: 'customer' }),
    $or: [{ customer: req.user._id }, { serviceProvider: req.user._id }],
  };

  const startOfMonth = new Date(moment().startOf('month').format());
  const endOfMonth = new Date(moment().endOf('month').format());

  const startOfLastMonth = new Date(
    moment().add(-1, 'month').startOf('month').format()
  );
  const endOfLastMonth = new Date(
    moment().add(-1, 'month').endOf('month').format()
  );

  const aggregateQuery = [
    {
      $match: {
        transferFrom: 'customer',
        serviceProvider: req.user._id,
      },
    },
    {
      $project: {
        _id: 1,
        amount: 1,
      },
    },
    {
      $group: {
        _id: '$amount',
        amount: { $sum: '$amount' },
      },
    },
    {
      $project: { _id: 0, amount: 1 },
    },
  ];

  const totalEarnings = await Transaction.aggregate(aggregateQuery);

  const aggregationCopy = aggregateQuery.slice(1);

  const thisMonthEarningsAggregation = [
      ...[
        {
          $match: {
            serviceProvider: req.user._id,
            transferFrom: 'customer',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
      ],
      ...aggregationCopy,
    ],
    lastMonthEarningsAggregation = [
      ...[
        {
          $match: {
            serviceProvider: req.user._id,
            transferFrom: 'customer',
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
      ],
      ...aggregationCopy,
    ];

  const thisMonthEarnings = await Transaction.aggregate(
    thisMonthEarningsAggregation
  );

  const lastMonthEarnings = await Transaction.aggregate(
    lastMonthEarningsAggregation
  );

  const userTransactions = await Transaction.find(dbQuery)
    .populate([
      {
        path: 'booking',
        select: 'service',
        populate: { path: 'service', select: 'name' },
      },
      {
        path: 'customer',
      },
    ])
    .skip(skip)
    .limit(limit);

  const totalCount = await Transaction.countDocuments(dbQuery);

  res.status(200).json({
    status: 'success',
    totalCount,
    data: userTransactions,
    earnings: {
      totalEarnings: totalEarnings[0]?.amount || 0,
      thisMonth: thisMonthEarnings[0]?.amount || 0,
      lastMonth: lastMonthEarnings[0]?.amount || 0,
    },
  });
});

exports.ratingForServiceProvider = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating } = req.body;

  const foundServiceProvider = await User.findById(id);
  if (!foundServiceProvider)
    return next(new AppError('Sorry!! Service Provider not found', 404));

  const doc = await User.findByIdAndUpdate(
    id,
    { ...req.body, userRating: rating },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.generateSubscriptionReportOfSP = catchAsync(async (req, res, next) => {
  const { filename, startDate, endDate } = req.body;

  if (!filename || !startDate || !endDate)
    return next(new AppError('Please provide all required fields', 400));

  const records = await User.find({
    role: 'service-provider',
    planType: { $in: ['Monthly', 'Annual'] },
    createdAt: { $gte: startDate, $lt: endDate },
  }).select(
    'userName email packageType planType planStartDate planEndDate planAmount createdAt'
  );

  if (records.length <= 0) {
    return next(
      new AppError('No records to export within given date range.', 400)
    );
  }

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const fileName = `${filename}${uuidv4()}.xlsx`;

  const _path = path.join(__dirname, '..', 'public', 'reports', fileName);

  // Create a reusable style
  const style = workbook.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  const headingStyle = workbook.createStyle({
    font: {
      color: '#000000',
      size: 11,
      weight: 'bold',
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  worksheet.cell(1, 1).string('Id').style(headingStyle);
  worksheet.cell(1, 2).string('Username').style(headingStyle);
  worksheet.cell(1, 3).string('Email').style(headingStyle);
  worksheet.cell(1, 4).string('Package Type').style(headingStyle);
  worksheet.cell(1, 5).string('Plan Type').style(headingStyle);
  worksheet.cell(1, 6).string('Start Date').style(headingStyle);
  worksheet.cell(1, 7).string('End Date').style(headingStyle);
  worksheet.cell(1, 8).string('Amount').style(headingStyle);
  worksheet.cell(1, 9).string('Created At').style(headingStyle);

  records.forEach((user, index) => {
    worksheet
      .cell(index + 2, 1)
      .string(`${index + 1}`.toString())
      .style(style);
    worksheet
      .cell(index + 2, 2)
      .string(user?.userName?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 3)
      .string(user?.email?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 4)
      .string(user?.packageType?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 5)
      .string(user?.planType?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 6)
      .string(moment(user?.planStartDate).format('lll').toString())
      .style(style);
    worksheet
      .cell(index + 2, 7)
      .string(moment(user?.planEndDate).format('lll').toString())
      .style(style);
    worksheet
      .cell(index + 2, 8)
      .string(`$${user?.planAmount?.toString()}`)
      .style(style);
    worksheet
      .cell(index + 2, 9)
      .string(moment(user?.createdAt).format('lll').toString())
      .style(style);
  });

  workbook.write(_path);

  setTimeout(async () => {
    await uploadServerFile(_path);
    fs.unlinkSync(_path);
  }, 1000);

  let createdReport = await Report.create({
    fileName: filename,
    startDate,
    endDate,
    file: fileName,
  });

  res.status(200).json({
    status: 'success',
    data: createdReport,
  });
});
exports.generateBookingReportOfSP = catchAsync(async (req, res, next) => {
  const { filename, startDate, endDate } = req.body;

  if (!filename || !startDate || !endDate)
    return next(new AppError('Please provide all required fields', 400));

  const records = await Booking.aggregate([
    // {
    //   $match: {
    //     createdAt: { $gte: startDate, $lt: endDate },
    //   },
    // },
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
        pipeline: [{ $project: { userName: 1, email: 1 } }],
      },
    },
    {
      $unwind: '$customer',
    },
    {
      $group: {
        _id: '$customer._id',
        price: { $sum: '$price' },
        customer: { $first: '$customer' },
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $project: {
        _id: 0,
        customer: 1,
        price: 1,
        createdAt: 1,
      },
    },
  ]);

  if (records.length <= 0) {
    return next(
      new AppError('No records to export within given date range.', 400)
    );
  }

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const fileName = `${filename}${uuidv4()}.xlsx`;

  const _path = path.join(__dirname, '..', 'public', 'reports', fileName);

  // Create a reusable style
  const style = workbook.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  const headingStyle = workbook.createStyle({
    font: {
      color: '#000000',
      size: 11,
      weight: 'bold',
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  worksheet.cell(1, 1).string('Id').style(headingStyle);
  worksheet.cell(1, 2).string('Username').style(headingStyle);
  worksheet.cell(1, 3).string('Email').style(headingStyle);
  worksheet.cell(1, 4).string('Amount').style(headingStyle);
  // worksheet.cell(1, 4).string('Created At').style(headingStyle);

  records.forEach((booking, index) => {
    worksheet
      .cell(index + 2, 1)
      .string(`${index + 1}`.toString())
      .style(style);
    worksheet
      .cell(index + 2, 2)
      .string(booking?.customer?.userName?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 3)
      .string(booking?.customer?.email?.toString())
      .style(style);
    worksheet
      .cell(index + 2, 4)
      .string(`$${booking?.price?.toString()}`)
      .style(style);
    // worksheet
    //   .cell(index + 2, 4)
    //   .string(moment(booking?.createdAt).format('lll').toString())
    //   .style(style);
  });

  workbook.write(_path);

  setTimeout(async () => {
    await uploadServerFile(_path);
    fs.unlinkSync(_path);
  }, 1000);

  let createdReport = await Report.create({
    fileName: filename,
    reportType: 'booking',
    startDate,
    endDate,
    file: fileName,
  });

  res.status(200).json({
    status: 'success',
    data: createdReport,
  });
});

exports.getAllReportAdmin = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { type, search } = req.query;
  const dbQuery = {
    ...(type && type != 'all' && { reportType: type }),
    ...(search && { fileName: { $regex: search, $options: 'i' } }),
  };

  const reports = await Report.find(dbQuery)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const totalRecords = await Report.countDocuments(dbQuery);

  res.status(200).json({
    status: 'success',
    results: reports?.length,
    totalRecords,
    data: reports,
  });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError('Report id is undefined.', 401));

  const delReport = await Report.findByIdAndDelete(id);

  if (!delReport)
    return next(new AppError('Report not found with given id.', 400));

  await deleteFile(delReport?.file);

  res.status(204).json({
    status: 'success',
    message: 'Report deleted successfully',
  });
});

exports.adminDashboardStats = catchAsync(async (req, res, next) => {
  const { user } = req;
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');

  let [
    totalCustomers,
    totalServiceProviders,
    customerRequests,
    serviceProviderRequests,
    totalSubscribedServiceProvider,
    notifications,
    totalEarnings,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'service-provider' }),
    User.countDocuments({ role: 'customer', status: 'pending' }),
    User.countDocuments({ role: 'service-provider', status: 'pending' }),
    User.countDocuments({
      role: 'service-provider',
      packageType: { $in: ['Silver', 'Gold', 'Platinum'] },
    }),
    Notification.find({ receiver: user._id }).sort({ createdAt: -1 }).limit(10),
    Transaction.aggregate([
      {
        $match: {
          admin: user._id,
          status: 'deposited',
          updatedAt: { $gte: new Date(startOfWeek), $lte: new Date(endOfWeek) },
        },
      },
      {
        $project: {
          _id: 1,
          day: { $dayOfWeek: '$updatedAt' },
          amount: 1,
        },
      },
      {
        $sort: { day: -1 },
      },
      {
        $group: {
          _id: '$day',
          amount: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  let dayEarningArr = [
    {
      day: 'Sat',
      position: 7,
      amount: 0,
    },
    {
      day: 'Sun',
      position: 1,
      amount: 0,
    },
    {
      day: 'Mon',
      position: 2,
      amount: 0,
    },
    {
      day: 'Tue',
      position: 3,
      amount: 0,
    },
    {
      day: 'Wed',
      position: 4,
      amount: 0,
    },
    {
      day: 'Thu',
      position: 5,
      amount: 0,
    },
    {
      day: 'Fri',
      position: 6,
      amount: 0,
    },
  ];

  totalEarnings = totalEarnings.map((obj) => ({
    day: obj._id,
    amount: obj.amount,
  }));

  const finalEarning = [...dayEarningArr];
  dayEarningArr.map((item, index) => {
    totalEarnings.map((innerItem, innerIndex) => {
      if (item.position == innerItem.day) {
        Object.assign(innerItem, { day: item.day, position: item.position });
        finalEarning.splice(index, 1, innerItem);
      }
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      statistics: [
        {
          name: 'Total Customers',
          value: totalCustomers,
        },
        {
          name: 'Total Service Providers',
          value: totalServiceProviders,
        },
        {
          name: 'New Customer Requests',
          value: customerRequests,
        },
        {
          name: 'New Service Provider Requests',
          value: serviceProviderRequests,
        },
        {
          name: 'Total Subscribed Service Provider',
          value: totalSubscribedServiceProvider,
        },
        {
          name: 'Earnings',
          value: user.wallet.balance,
        },
      ],
      notifications,
      totalEarnings: finalEarning,
    },
  });
});

exports.serviceProviderDashboardStats = catchAsync(async (req, res, next) => {
  const { user } = req;
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');

  let [
    totalBookings,
    totalStaffs,
    totalVenues,
    notifications,
    totalEarnings,
    totalChats,
  ] = await Promise.all([
    Booking.countDocuments({ serviceProvider: user._id }),
    Staff.countDocuments({ createdBy: user._id }),
    Venue.countDocuments({ createdBy: user._id }),
    Notification.find({ receiver: user._id }).sort({ createdAt: -1 }).limit(4),
    Transaction.aggregate([
      {
        $match: {
          serviceProvider: user._id,
          transferFrom: 'customer',
          status: 'deposited',
          updatedAt: {
            $gte: new Date(startOfWeek),
            $lte: new Date(endOfWeek),
          },
        },
      },
      {
        $project: {
          _id: 1,
          day: { $dayOfWeek: '$updatedAt' },
          amount: 1,
        },
      },
      {
        $sort: { day: -1 },
      },
      {
        $group: {
          _id: '$day',
          amount: { $sum: '$amount' },
        },
      },
    ]),
    Room.countDocuments({ user1: user._id }),
  ]);

  let dayEarningArr = [
    {
      day: 'Sat',
      position: 7,
      amount: 0,
    },
    {
      day: 'Sun',
      position: 1,
      amount: 0,
    },
    {
      day: 'Mon',
      position: 2,
      amount: 0,
    },
    {
      day: 'Tue',
      position: 3,
      amount: 0,
    },
    {
      day: 'Wed',
      position: 4,
      amount: 0,
    },
    {
      day: 'Thu',
      position: 5,
      amount: 0,
    },
    {
      day: 'Fri',
      position: 6,
      amount: 0,
    },
  ];

  totalEarnings = totalEarnings.map((obj) => ({
    day: obj._id,
    amount: obj.amount,
  }));

  const finalEarning = [...dayEarningArr];
  dayEarningArr.map((item, index) => {
    totalEarnings.map((innerItem, innerIndex) => {
      if (item.position == innerItem.day) {
        Object.assign(innerItem, { day: item.day, position: item.position });
        finalEarning.splice(index, 1, innerItem);
      }
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      statistics: [
        {
          name: 'Total Bookings',
          value: totalBookings,
        },
        {
          name: 'Total Earnings',
          value: user.wallet.balance,
        },
        {
          name: 'Total Number Of Staffs',
          value: totalStaffs,
        },
        {
          name: 'Total Venues',
          value: totalVenues,
        },
        {
          name: 'Total Chats',
          value: totalChats,
        },
        {
          name: 'Subscription',
          value:
            user.planType == 'Free'
              ? 'Free'
              : `${user.planType} - ${user.packageType}`,
        },
      ],
      notifications,
      totalEarnings: finalEarning,
    },
  });
});

exports.customerDashboardStats = catchAsync(async (req, res, next) => {
  const { user } = req;
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');

  let [
    totalBookings,
    completedBookings,
    pendingBookings,
    notifications,
    totalEarnings,
  ] = await Promise.all([
    Booking.countDocuments({ customer: user._id }),
    Booking.countDocuments({ customer: user._id, status: 'completed' }),
    Booking.countDocuments({ customer: user._id, status: 'pending' }),
    Notification.find({ receiver: user._id }).sort({ createdAt: -1 }).limit(4),
    Transaction.aggregate([
      {
        $match: {
          customer: user._id,
          status: 'completed',
          updatedAt: {
            $gte: new Date(startOfWeek),
            $lte: new Date(endOfWeek),
          },
        },
      },
      {
        $project: {
          _id: 1,
          day: { $dayOfWeek: '$updatedAt' },
          amount: 1,
        },
      },
      {
        $sort: { day: -1 },
      },
      {
        $group: {
          _id: '$day',
          amount: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  let dayEarningArr = [
    {
      day: 'Sat',
      position: 7,
      amount: 0,
    },
    {
      day: 'Sun',
      position: 1,
      amount: 0,
    },
    {
      day: 'Mon',
      position: 2,
      amount: 0,
    },
    {
      day: 'Tue',
      position: 3,
      amount: 0,
    },
    {
      day: 'Wed',
      position: 4,
      amount: 0,
    },
    {
      day: 'Thu',
      position: 5,
      amount: 0,
    },
    {
      day: 'Fri',
      position: 6,
      amount: 0,
    },
  ];

  totalEarnings = totalEarnings.map((obj) => ({
    day: obj._id,
    amount: obj.amount,
  }));

  const finalEarning = [...dayEarningArr];
  dayEarningArr.map((item, index) => {
    totalEarnings.map((innerItem, innerIndex) => {
      if (item.position == innerItem.day) {
        Object.assign(innerItem, { day: item.day, position: item.position });
        finalEarning.splice(index, 1, innerItem);
      }
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      statistics: [
        {
          name: 'Total Bookings',
          value: totalBookings,
        },
        {
          name: 'Completed Bookings',
          value: completedBookings,
        },
        {
          name: 'Pending Bookings',
          value: pendingBookings,
        },
      ],
      notifications,
      totalEarnings: finalEarning,
    },
  });
});
