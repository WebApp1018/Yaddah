const NewsLetter = require('../models/newsLetterModel');
const catchAsync = require('../utils/catchAsync');

exports.createNewsLetter = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const foundEmail = await NewsLetter.findOne({ email });

  if (foundEmail)
    return next(new AppError('You have already subscribed.', 400));

  const doc = await NewsLetter.create({ email });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllNewsLetters = catchAsync(async (req, res, next) => {
  const doc = await NewsLetter.find();
  const totalCount = await NewsLetter.countDocuments();

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.getAllNewsLettersForAdmin = catchAsync(async (req, res, next) => {
  //PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const doc = await NewsLetter.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await NewsLetter.countDocuments();

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});
