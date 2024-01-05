const WhyChooseUs = require('./../models/whyChooseUsCrudModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { deleteFile } = require('../utils/fileUpload');

exports.addWhyChooseUs = catchAsync(async (req, res, next) => {
  const files = req.files;

  if (files?.image)
    req.body.logo = await uploadFilesToS3(files, 'image', 0, 25);

  const doc = await WhyChooseUs.create(req.body);

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllWhyChooseUs = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const doc = await WhyChooseUs.find()
    .sort('-updatedAt -createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc,
  });
});

exports.updateWhyChooseUs = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const files = req.files;

  const data = await WhyChooseUs.findById(id);

  if (files?.image) {
    if (data.logo) await deleteFile(data.logo);
    req.body.logo = await uploadFilesToS3(files, 'image', 0, 25);
  }

  const doc = await WhyChooseUs.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
