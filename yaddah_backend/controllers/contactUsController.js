const contactUs = require('./../models/contactusModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addContactUs = catchAsync(async (req, res, next) => {
  const { name, phoneNo, email, website, message } = req.body;
  if (!name || !phoneNo || !email || !website || !message)
    return next(new AppError('Argument missing', 404));

  const doc = await contactUs.create(req.body);
  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllContactUs = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const doc = await contactUs.find().sort('-createdAt').skip(skip).limit(limit);

  const totalCount = await contactUs.countDocuments();

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.deleteContactUs = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await contactUs.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    message: 'contactUs deleted successfully',
  });
});
