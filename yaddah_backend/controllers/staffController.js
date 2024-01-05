const Staff = require('../models/staffModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { deleteFile } = require('../utils/fileUpload');

exports.createStaff = catchAsync(async (req, res, next) => {
  const { user } = req;
  const files = req.files;
  const { staffName, email, schedule } = req.body;

  if (user.packageType == 'None')
    return next(
      new AppError(
        'You are not allowed to create staff. Please upgrade your plan.',
        400
      )
    );

  if (user?.availableStaff == 0)
    return next(
      new AppError(
        `You can't create more than ${user?.totalStaff} staffs. Please upgrade your plan`,
        400
      )
    );

  const staffExist = await Staff.findOne({ email });

  if (staffExist)
    return next(new AppError('Staff already exist with this email.', 400));

  if (files?.image)
    req.body.image = await uploadFilesToS3(files, 'image', 0, 25);

  const anyStaffData = await Staff.findOne();
  const newId = !anyStaffData ? 1 : Number(anyStaffData.slugId) + 1;
  anyStaffData && (await Staff.updateMany({}, { slugId: newId }));

  const slug = `${staffName.toLowerCase().replace(/ /g, '-')}-${newId}`;

  const obj = {
    ...req.body,
    slug,
    slugId: newId,
    createdBy: user._id,
  };

  if (schedule) obj.schedule = JSON.parse(schedule);

  const doc = await Staff.create(obj);

  await User.findByIdAndUpdate(user._id, {
    $push: { myStaff: doc._id },
    $inc: { availableStaff: -1 },
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllStaffsForServiceProvider = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  let query = {
    createdBy: req.user._id,
    ...(status && status != 'all' && { isActive: status }),
    ...(search &&
      search != '' && {
        $or: [{ staffName: { $regex: search, $options: 'i' } }],
      }),
  };

  const doc = await Staff.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Staff.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.updateStaff = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const files = req.files;
  const { status, schedule, disabledDates } = req.body;

  if (status) {
    return next(
      new AppError('You are not allowed to change status of staff.', 400)
    );
  }

  const foundStaff = await Staff.findById(id);
  if (!foundStaff) return next(new AppError('Sorry!! Staff not found', 404));

  if (files?.image) {
    if (foundStaff?.image && foundStaff.image != 'default.png')
      await deleteFile(foundStaff?.image);

    req.body.image = await uploadFilesToS3(files, 'image', 0, 25);
  }

  if (schedule) req.body.schedule = JSON.parse(schedule);

  if (!disabledDates) req.body.disabledDates = [];

  const doc = await Staff.findByIdAndUpdate(id, { ...req.body }, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getSpecificStaff = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundStaff = await Staff.findById(id);
  if (!foundStaff) return next(new AppError('Staff not found.', 400));

  res.status(200).json({
    status: 'success',
    data: foundStaff,
  });
});

exports.activeDeactivateStaff = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { status } = req.body;
  if (status) {
    if (user?.availableStaff == 0) {
      return next(
        new AppError(
          `You can't create more than ${user.totalStaff} staff. Please upgrade your plan`,
          400
        )
      );
    }
  }

  const doc = await Staff.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );

  await User.findByIdAndUpdate(user._id, {
    $inc: { availableStaff: status ? -1 : 1 },
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
