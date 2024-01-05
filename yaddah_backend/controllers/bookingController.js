const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/bookingModel');
const Coupon = require('../models/couponModel');
const User = require('../models/userModel');
const Room = require('../models/roomModel');
const Chat = require('../models/chatModel');
const Service = require('../models/serviceModel');
const Venue = require('../models/venueModel');
const Staff = require('../models/staffModel');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Transaction = require('../models/transactionModel');
const {
  payWithPayPal,
  generateAccessToken,
  confirmSingleOrderWithPayPal,
} = require('../utils/paypal');
const { createNotification } = require('./notificationController');
const { uploadFunction } = require('../utils/fileUpload');
const { WEB_HOSTED_URL } = process.env;

exports.getAllBookingsForCustomer = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;
  const dbQuery = {
    customer: req.user._id,
    ...(status && status != 'all' && { status }),
  };

  const aggregateQuery = [
    {
      $match: dbQuery,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              userName: 1,
              email: 1,
              slug: 1,
              description: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$customer',
      },
    },
    {
      $lookup: {
        from: 'staffs',
        localField: 'staff',
        foreignField: '_id',
        as: 'staff',
        pipeline: [
          {
            $project: {
              _id: 1,
              staffName: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$staff',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const searchQuery = {
    $or: [
      { bookingNumber: { $regex: search, $options: 'i' } },
      { 'customer.fullName': { $regex: search, $options: 'i' } },
      { 'customer.userName': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
      { 'staff.staffName': { $regex: search, $options: 'i' } },
    ],
  };

  if (search && search != '')
    aggregateQuery.splice(6, 0, {
      $match: searchQuery,
    });

  const data = await Booking.aggregate(aggregateQuery);

  aggregateQuery.splice(-3);

  const totalRecords = await Booking.aggregate(aggregateQuery);

  res.status(200).json({
    status: 'success',
    totalRecords: totalRecords.length || 0,
    data,
  });
});

exports.getAllBookingsForServiceProvider = catchAsync(
  async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 15;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;
    const dbQuery = {
      serviceProvider: req.user._id,
      ...(status && status != 'all' && { status }),
    };

    const aggregateQuery = [
      {
        $match: dbQuery,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                userName: 1,
                email: 1,
                slug: 1,
                description: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$customer',
        },
      },
      {
        $lookup: {
          from: 'staffs',
          localField: 'staff',
          foreignField: '_id',
          as: 'staff',
          pipeline: [
            {
              $project: {
                _id: 1,
                staffName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$staff',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const searchQuery = {
      $or: [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.userName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'staff.staffName': { $regex: search, $options: 'i' } },
      ],
    };

    if (search && search != '')
      aggregateQuery.splice(6, 0, {
        $match: searchQuery,
      });

    const data = await Booking.aggregate(aggregateQuery);

    aggregateQuery.splice(-3);

    const totalRecords = await Booking.aggregate(aggregateQuery);

    res.status(200).json({
      status: 'success',
      totalRecords: totalRecords.length || 0,
      data,
    });
  }
);

exports.getBookingDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Booking.findById(id).populate([
    { path: 'customer' },
    { path: 'serviceProvider' },
    { path: 'staff' },
    { path: 'service', populate: [{ path: 'category' }] },
    { path: 'venue' },
  ]);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { service, staff, venue, price, couponCode, discount } = req.body;
  const fileName = `${uuidv4()}.png`;
  let checkCoupon = null;

  const foundService = await Service.findById(service).populate([
    {
      path: 'createdBy',
      select: 'socketId payee fcmToken isOnline availableBookings',
    },
  ]);

  if (!foundService) return next(new AppError('Service not found.', 400));

  if (foundService?.createdBy?.availableBookings === 0)
    return next(
      new AppError(
        'This service provider does not accept booking at this time because of limit reached.',
        400
      )
    );

  const foundVenue = await Venue.findById(venue);

  if (!foundVenue) return next(new AppError('Venue not found.', 400));

  const foundStaff = await Staff.findById(staff);

  if (!foundStaff) return next(new AppError('Staff not found.', 400));

  checkCoupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
  });

  if (couponCode && checkCoupon) {
    const checkBookingOfCoupon = await Booking.findOne({
      coupon: checkCoupon._id,
      customer: user._id,
    });
    if (checkBookingOfCoupon)
      return next(new AppError('You have already used this coupon code.', 400));
  }

  const anyBookingData = await Booking.findOne();
  const newId = !anyBookingData ? 1 : Number(anyBookingData.slugId) + 1;
  anyBookingData && (await Booking.updateMany({}, { slugId: newId }));

  const obj = {
    ...req.body,
    slug: newId,
    slugId: newId,
    serviceProvider: foundService.createdBy._id,
    customer: user._id,
    qrCode: fileName,
    ...(couponCode && { coupon: checkCoupon._id }),
    discount,
  };

  obj.bookingNumber = Math.floor(100000 + Math.random() * 9000);

  const qrCodeResult = await QRCode.toBuffer(fileName);

  try {
    await uploadFunction(qrCodeResult, fileName);
  } catch (err) {
    const error =
      err?.code == 'UserSuspended'
        ? 'Something went wrong while uploading media!'
        : err;
    return next(new AppError(error, 400));
  }

  if (discount < 100 && price > 0)
    // confirm order with paypal
    try {
      const paypalAccessToken = await generateAccessToken();
      // await confirmSingleOrderWithPayPal(paypalAccessToken, req.body.orderId);
      await payWithPayPal(
        paypalAccessToken,
        foundService?.createdBy?.payee,
        price
      );
    } catch (e) {
      return next(new AppError(e.message, 400));
    }

  const doc = await Booking.create(obj);

  await createNotification(
    {
      title: 'New Booking',
      fcmToken: foundService.createdBy.fcmToken,
      data: { flag: 'booking', bookingId: String(doc._id) },
    },
    {
      sender: user._id,
      receiver: foundService.createdBy._id,
      socket: foundService.createdBy.socketId,
      booking: doc._id,
      message: 'New booking from customer.',
      flag: 'booking',
      title: 'New Booking',
      senderMode: 'customer',
    }
  );

  const url = `${WEB_HOSTED_URL}booking/${doc._id}`;

  await new Email(user).bookingConfirmedEmail({
    firstName: user.fullName,
    bookingLink: url,
  });

  await User.findByIdAndUpdate(
    foundService.createdBy._id,
    {
      $inc: { 'wallet.balance': price > 0 ? price : 0, availableBookings: -1 },
      $push: { myBookings: doc._id },
    },
    { new: true }
  );

  if (discount < 100)
    await Transaction.create({
      booking: doc._id,
      serviceProvider: foundService.createdBy._id,
      customer: user._id,
      amount: price > 0 ? price : 0,
      discount,
      transferFrom: 'customer',
      transferTo: 'service-provider',
      message: 'Transaction completed.',
    });

  if (couponCode)
    await Coupon.findOneAndUpdate(
      { code: couponCode, isActive: true },
      { $inc: { maxUsed: -1 } }
    );

  const room = await Room.create({
    user1: foundService.createdBy._id,
    user2: user._id,
    booking: doc._id,
    lastMessage: {
      text: 'Hello Service Provider!',
      user: {
        _id: user._id,
        name: user.fullName,
        avatar: user.photo,
      },
    },
    user1UnreadCount: 0,
    user2UnreadCount: 0,
  });

  await Chat.create({
    room: room._id,
    to: foundService.createdBy._id,
    from: user._id,
    message: {
      text: 'Hello Service Provider!',
      user: {
        _id: user._id,
        name: user.fullName,
        avatar: user.photo,
      },
    },
    isDeliveredMessage: foundService.createdBy.isOnline,
    isReadMessage: false,
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
