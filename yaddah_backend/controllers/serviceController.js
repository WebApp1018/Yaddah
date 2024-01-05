const moment = require('moment');
const Service = require('./../models/serviceModel');
const Venue = require('./../models/venueModel');
const Staff = require('./../models/staffModel');
const Booking = require('./../models/bookingModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { deleteFile } = require('../utils/fileUpload');

exports.serviceDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundService = await Service.findById(id).populate([
    { path: 'createdBy', select: 'userRating' },
    { path: 'staff' },
    { path: 'category' },
    { path: 'venue' },
  ]);

  res.status(200).json({
    status: 'success',
    data: foundService,
  });
});

exports.getServicesOfSpecificServiceProvider = catchAsync(
  async (req, res, next) => {
    // for pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 15;
    const skip = (page - 1) * limit;
    const { id } = req.params;

    const foundServices = await Service.find({ createdBy: id })
      .populate([
        { path: 'createdBy' },
        { path: 'staff' },
        { path: 'category' },
        { path: 'venue' },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Service.countDocuments({
      createdBy: id,
    });

    res.status(200).json({
      status: 'success',
      data: foundServices,
      totalRecords,
    });
  }
);

exports.serviceDetailForCustomer = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundService = await Service.findById(id).populate([
    { path: 'createdBy', select: 'userRating' },
    { path: 'staff', match: { isActive: true } },
    { path: 'category', match: { isActive: true } },
    { path: 'venue', match: { isActive: true } },
  ]);

  res.status(200).json({
    status: 'success',
    data: foundService,
  });
});

exports.staffSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { startDate, endDate, venue } = req.body;

  const foundStaff = await Staff.findById(id).lean();

  // const foundVenue = await Venue.findById(id);

  const foundBookings = await Booking.find({
    staff: id,
    'bookedSlots.date': { $gte: new Date(startDate), $lte: new Date(endDate) },
  }).lean();

  foundStaff.schedule = foundStaff.schedule.map((schedule) => {
    foundBookings.map((booking) => {
      booking.bookedSlots.map((bookedSlotObj) => {
        if (schedule.day === moment(bookedSlotObj.date).format('dddd')) {
          schedule.timeSlot.map((timeSlot) => {
            bookedSlotObj.slot.map((slot) => {
              if (timeSlot.time == slot.time) timeSlot.status = 'booked';
            });
          });
        }
      });
    });

    schedule.day = moment(endDate).day(schedule.day).format();

    foundStaff.disabledDates.map((disabledDate) => {
      if (
        moment(schedule.day).format('YYYY-MM-DD') ==
        moment(disabledDate).format('YYYY-MM-DD')
      ) {
        schedule.timeSlot.map((timeSlot) => {
          timeSlot.status = 'empty';
        });
      }
    });

    // foundVenue.disabledDates.map((disabledDate) => {
    //   if (
    //     moment(schedule.day).format('YYYY-MM-DD') ==
    //     moment(disabledDate).format('YYYY-MM-DD')
    //   ) {
    //     schedule.timeSlot.map((timeSlot) => {
    //       timeSlot.status = 'empty';
    //     });
    //   }
    // });

    return schedule;
  });

  res.status(200).json({
    status: 'success',
    data: foundStaff.schedule,
  });
});

exports.addService = catchAsync(async (req, res, next) => {
  const { user } = req;
  const files = req.files;
  const { name } = req.body;

  if (user?.availableServices == 0)
    return next(
      new AppError(
        `You can't create more than ${user.totalServices} services. Please upgrade your plan`,
        400
      )
    );

  const serviceExist = await Service.findOne({ name });

  if (serviceExist)
    return next(new AppError('Service already exist with this name.', 400));

  if (files?.serviceImages) {
    const serviceImagesArr = files.serviceImages.map(
      async (file, i) => await uploadFilesToS3(files, 'serviceImages', i, 25)
    );

    const resolvedImages = await Promise.all(serviceImagesArr);

    req.body.images = resolvedImages;
  }

  const anyServiceData = await Service.findOne();
  const newId = !anyServiceData ? 1 : Number(anyServiceData.slugId) + 1;
  anyServiceData && (await Service.updateMany({}, { slugId: newId }));

  const slug = `${name.toLowerCase().replace(/ /g, '-')}-${newId}`;

  const obj = {
    ...req.body,
    slug,
    slugId: newId,
    createdBy: user._id,
  };

  const doc = await Service.create(obj);

  await User.findByIdAndUpdate(user._id, {
    $push: { myServices: doc._id },
    $inc: { availableServices: -1 },
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllServicesForCustomer = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { search, categoryId } = req.query;

  const dbQuery = {
    isActive: true,
    ...(search && search != '' && { name: { $regex: search, $options: 'i' } }),
    ...(categoryId && categoryId != 'all' && { category: categoryId }),
  };

  let doc = await Service.find(dbQuery)
    .populate([
      { path: 'createdBy', select: 'userRating' },
      { path: 'staff' },
      { path: 'venue' },
    ])
    .sort('-updatedAt -createdAt')
    .lean()
    .skip(skip)
    .limit(limit);

  const totalRecords = await Service.countDocuments(dbQuery);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalRecords,
    data: doc,
  });
});

exports.getAllServicesForServiceProvider = catchAsync(
  async (req, res, next) => {
    // for pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 15;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const dbQuery = {
      createdBy: req.user._id,
      ...(status && status != 'all' && { isActive: status }),
      ...(search &&
        search != '' && { name: { $regex: search, $options: 'i' } }),
    };

    const doc = await Service.find(dbQuery)
      .sort('-updatedAt -createdAt')
      .populate([
        { path: 'createdBy', select: 'userRating' },
        { path: 'staff' },
        { path: 'category' },
        { path: 'venue' },
      ])
      .populate()
      .skip(skip)
      .limit(limit);

    const totalRecords = await Service.countDocuments(dbQuery);

    res.status(200).json({
      status: 'success',
      results: doc.length,
      totalRecords,
      data: doc,
    });
  }
);

exports.updateService = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const files = req.files;

  if (status) {
    return next(
      new AppError('You are not allowed to change status of Service.', 400)
    );
  }

  const foundService = await Service.findById(id);
  if (!foundService) return next(new AppError('Service not found.', 400));

  if (files?.serviceImages) {
    const serviceImagesArr = files.serviceImages.map(
      async (file, i) => await uploadFilesToS3(files, 'serviceImages', i, 25)
    );

    const resolvedImages = await Promise.all(serviceImagesArr);
    req.body.images = [...foundService.images, ...resolvedImages];
  }
  let obj = {
    ...req.body,
  };
  const doc = await Service.findByIdAndUpdate(id, obj, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.deleteServiceImages = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { delImages } = req.body;

  const foundService = await Service.findByIdAndUpdate(
    id,
    { $pull: { images: { $in: delImages } } },
    { new: true }
  );

  let deleteImages = delImages.map((image) => deleteFile(image));
  await Promise.all(deleteImages);

  res.status(200).json({
    data: foundService,
    status: 'success',
  });
});

exports.activeDeactiveService = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { status } = req.body;
  if (status) {
    if (user?.availableServices == 0) {
      return next(
        new AppError(
          `You can't create more than ${user.totalServices} Services. Please upgrade your plan`,
          400
        )
      );
    }
  }
  const doc = await Service.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );
  await User.findByIdAndUpdate(user._id, {
    $inc: { availableServices: status ? -1 : 1 },
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
