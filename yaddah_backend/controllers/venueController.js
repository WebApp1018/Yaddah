const Venue = require('./../models/venueModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { deleteFile } = require('../utils/fileUpload');

exports.venueDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundVenue = await Venue.findById(id).populate([
    { path: 'serviceCategory', select: 'name _id  ' },
  ]);

  res.status(200).json({
    status: 'success',
    data: foundVenue,
  });
});

exports.addVenue = catchAsync(async (req, res, next) => {
  const { user } = req;
  const files = req.files;
  const { name, lat, lng } = req.body;

  if (user.packageType == 'None')
    return next(
      new AppError(
        'You are not allowed to create venue. Please upgrade your plan.',
        400
      )
    );

  if (user?.availableVenues == 0)
    return next(
      new AppError(
        `You can't create more than ${user?.totalVenues} venues. Please upgrade your plan.`,
        400
      )
    );

  const venueExist = await Venue.findOne({ name });

  if (venueExist)
    return next(new AppError('Venue already exist with this name.', 400));

  if (files?.venueImages) {
    const venueImagesArr = files.venueImages.map(
      async (file, i) => await uploadFilesToS3(files, 'venueImages', i, 25)
    );

    const resolvedImages = await Promise.all(venueImagesArr);

    req.body.images = resolvedImages;
  }

  const anyVenueData = await Venue.findOne();
  const newId = !anyVenueData ? 1 : Number(anyVenueData.slugId) + 1;
  anyVenueData && (await Venue.updateMany({}, { slugId: newId }));

  const slug = `${name.toLowerCase().replace(/ /g, '-')}-${newId}`;

  const obj = {
    ...req.body,
    slug,
    slugId: newId,
    createdBy: user._id,
    location: { coordinates: [lng, lat] },
  };

  let createdVenue = await Venue.create(obj);

  await User.findByIdAndUpdate(user._id, {
    $push: { myVenues: createdVenue._id },
    $inc: { availableVenues: -1 },
  });

  createdVenue = await Venue.findById(createdVenue._id).populate([
    { path: 'serviceCategory', select: 'name' },
  ]);

  res.status(200).json({
    status: 'success',
    data: createdVenue,
  });
});

exports.getAllVenuesForServiceProvider = catchAsync(async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;
  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
    ],
  };
  const dbQuery = {
    createdBy: req.user._id,
    ...(status && status != 'all' && { isActive: status }),
    ...(search && search != '' && searchQuery),
  };

  const doc = await Venue.find(dbQuery)
    .sort('-updatedAt -createdAt')
    .skip(skip)
    .limit(limit);

  const totalRecords = await Venue.countDocuments(dbQuery);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalRecords,
    data: doc,
  });
});

exports.updateVenue = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, disabledDates } = req.body;
  const files = req.files;

  if (status) {
    return next(
      new AppError('You are not allowed to change status of Venue.', 400)
    );
  }

  const foundVenue = await Venue.findById(id);
  if (!foundVenue) return next(new AppError('Venue not found.', 400));

  if (files?.venueImages) {
    const venueImagesArr = files.venueImages.map(
      async (file, i) => await uploadFilesToS3(files, 'venueImages', i, 25)
    );

    const resolvedImages = await Promise.all(venueImagesArr);

    req.body.images = [...foundVenue.images, ...resolvedImages];
  }

  if (!disabledDates) req.body.disabledDates = [];

  const updatedVenue = await Venue.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedVenue,
  });
});

exports.activateDeactivateVenue = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const { status } = req.body;
  if (status) {
    if (user?.availableVenues == 0) {
      return next(
        new AppError(
          `You can't create more than ${user.totalVenues} venues. Please upgrade your plan`,
          400
        )
      );
    }
  }
  const updatedVenue = await Venue.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );
  await User.findByIdAndUpdate(user._id, {
    $inc: { availableVenues: status ? -1 : 1 },
  });
  res.status(200).json({
    status: 'success',
    data: updatedVenue,
  });
});

exports.deleteVenueImages = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { delImages } = req.body;

  const foundService = await Venue.findByIdAndUpdate(
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
