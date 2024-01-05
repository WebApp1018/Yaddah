const moment = require('moment');
const Coupon = require('../models/couponModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const Package = require('../models/packageModel');

exports.calculateDiscount = catchAsync(async (req, res, next) => {
  const { coupon, package } = req.params;

  if (!coupon || !package)
    return next(new AppError('Please provide coupon and package id.', 400));

  const result = await Coupon.findOne({ code: coupon, isActive: true });
  if (!result) return next(new AppError('Coupon not found.', 400));

  if (moment(result.expire).format() < moment().format())
    return next(new AppError('Coupon is expired.', 400));

  let foundPackage = await Package.findById(package);

  if (!foundPackage) return next(new AppError('Package not found.', 400));

  const discount = (foundPackage.price * result.discount) / 100;

  res.status(201).json({
    status: 'success',
    data: {
      packagePrice: foundPackage.price,
      discount,
      amountToPay: foundPackage.price - discount,
    },
  });
});

exports.getAllCouponsForAdmin = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const data = await Coupon.find().sort('-createdAt').skip(skip).limit(limit);

  const totalRecords = await Coupon.countDocuments();

  res.status(200).json({
    status: 'success',
    totalRecords,
    data,
  });
});

exports.createCoupon = catchAsync(async (req, res, next) => {
  const doc = await Coupon.create(req.body);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.getSpecificCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  res.status(200).json({
    status: 'success',
    data: coupon,
  });
});

exports.validateCoupon = catchAsync(async (req, res, next) => {
  const { couponCode } = req.params;

  const coupon = await Coupon.findOne({ code: couponCode });

  const bookingsOnBehalfOfCoupon = await Booking.countDocuments({
    coupon: coupon._id,
  });

  if (!coupon) return next(new AppError('Invalid coupon code.', 400));

  if (!coupon.isActive) return next(new AppError('Invalid coupon code.', 400));

  if (moment(coupon.expire).format() < moment().format())
    return next(new AppError('Coupon is expired.', 400));

  if (coupon.maxUsers == bookingsOnBehalfOfCoupon)
    return next(new AppError('Coupon has reached its max usage.', 400));

  res.status(200).json({
    status: 'success',
    data: coupon,
  });
});

exports.activeDeactiveCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await Coupon.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
