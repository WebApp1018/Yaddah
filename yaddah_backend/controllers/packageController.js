const Package = require('../models/packageModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
  createPaypalPlan,
  generateAccessToken,
  createPaypalProduct,
  getAllProduct,
  createPayPalWebHook,
  deletePayPalWebHook,
} = require('../utils/paypal');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, type } = req.body;
  if (!name) return next(new AppError('Name is required', 400));
  if (!type) return next(new AppError('Type is required', 400));
  const productTypeArray = ['PHYSICAL', 'DIGITAL', 'SERVICE'];
  if (!productTypeArray.includes(type))
    return next(new AppError('Invalid Type', 400));

  const paypalAccessToken = await generateAccessToken();

  const createdPaypalProduct = await createPaypalProduct(
    paypalAccessToken,
    name,
    type
  );
  res.status(200).json({
    status: 'success',
    data: createdPaypalProduct,
  });
});

exports.getProductForAdmin = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const paypalAccessToken = await generateAccessToken();

  const allProducts = await getAllProduct(paypalAccessToken, page, limit);

  res.status(200).json({
    status: 'success',
    data: allProducts,
  });
});

exports.createPackage = catchAsync(async (req, res, next) => {
  const {
    packageType,
    planType,
    name,
    description,
    interval_unit,
    price,
    includeBooking,
    locationVenue,
    staff,
    services,
    descriptions,
    prodId,
  } = req.body;
  if (
    !packageType ||
    !planType ||
    !name ||
    !description ||
    !interval_unit ||
    !price ||
    !includeBooking ||
    !locationVenue ||
    !staff ||
    !descriptions ||
    !prodId ||
    !services
  )
    return next(new AppError('Required Parameters are missing!', 400));

  const paypalAccessToken = await generateAccessToken();

  const createdPaypalPlan = await createPaypalPlan(
    paypalAccessToken,
    name,
    description,
    interval_unit,
    price,
    prodId
  );

  const doc = await Package.create({
    name,
    price,
    packageType,
    planType,
    includeBooking,
    locationVenue,
    staff,
    services,
    description: descriptions,
    planData: createdPaypalPlan,
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.createPayPalWebHook = catchAsync(async (req, res, next) => {
  const { eventTypes } = req.body;
  if (!eventTypes)
    return next(new AppError('Required Parameters are missing!', 400));

  const paypalAccessToken = await generateAccessToken();

  const createdPaypalPlan = await createPayPalWebHook(
    paypalAccessToken,
    eventTypes
  );

  res.status(201).json({
    status: 'success',
    data: createdPaypalPlan,
  });
});

exports.deletePayPalWebHook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError('Id is missing!', 400));

  const paypalAccessToken = await generateAccessToken();

  await deletePayPalWebHook(paypalAccessToken, id);

  res.status(204).json({
    status: 'success',
    data: 'Deleted successfully.',
  });
});

exports.getPackagesForAdmin = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const doc = await Package.find({
    planType: type ? { $in: [type, 'Free'] } : { $in: ['Monthly', 'Free'] },
  }).sort({
    order: 1,
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getPackage = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const doc = await Package.find({
    planType: type ? { $in: [type, 'Free'] } : { $in: ['Monthly', 'Free'] },
  }).sort({
    order: 1,
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.updatePackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundPackage = await Package.findById(id);
  if (!foundPackage) return next(new AppError('Package not found', 404));

  const doc = await Package.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
