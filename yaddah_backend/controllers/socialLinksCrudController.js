const SocialLink = require('./../models/socialLinksCrudModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addSocialLink = catchAsync(async (req, res, next) => {
  const doc = await SocialLink.create(req.body);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllSocialLinks = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const doc = await SocialLink.find()
    .sort('-updatedAt -createdAt')
    .skip(skip)
    .limit(limit);

  const totalCount = await SocialLink.countDocuments();

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.updateSocialLink = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const doc = await SocialLink.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.deleteSocialLink = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await SocialLink.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: 'Deleted successfully.',
  });
});
