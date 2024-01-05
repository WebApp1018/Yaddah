const Faq = require('../models/faqModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createFaqs = catchAsync(async (req, res, next) => {
  const doc = await Faq.create(req.body);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.createFaqsForAdmin = catchAsync(async (req, res, next) => {
  const doc = await Faq.create({ ...req.body, userType: 'admin' });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllFaqsForAdmin = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { userType } = req.query;
  const dbQUery = { ...(userType ? { userType } : { userType: 'admin' }) };

  const doc = await Faq.find(dbQUery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Faq.countDocuments(dbQUery);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.getAllFaqs = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const doc = await Faq.find({ userType: 'admin' }).skip(skip).limit(limit);
  const totalCount = await Faq.countDocuments({ userType: 'admin' });

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.updateFaq = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const foundFaq= await Faq.findById(id);
  if(!foundFaq) return next(new AppError('Sorry!! Faq not found', 404));

  const doc = await Faq.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.deleteFaq = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const foundFaq= await Faq.findById(id);
  if(!foundFaq) return next(new AppError('Sorry!! Faq not found', 404));

  const doc = await Faq.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
