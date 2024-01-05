const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');
const { deleteFile } = require('../utils/fileUpload');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');

exports.createCategory = catchAsync(async (req, res, next) => {
  const files = req.files;

  if (files?.catImage)
    req.body.image = await uploadFilesToS3(files, 'catImage', 0, 25);

  const anyCategoryData = await Category.findOne();
  const newId = !anyCategoryData ? 1 : Number(anyCategoryData.slugId) + 1;
  anyCategoryData && (await Category.updateMany({}, { slugId: newId }));

  const slug = `${req.body.name.toLowerCase().replace(/ /g, '-')}-${newId}`;

  const doc = await Category.create({ ...req.body, slug, slugId: newId });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
exports.getAllCategoryForUser = catchAsync(async (req, res, next) => {
  //PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const doc = await Category.find({ isActive: true }).skip(skip).limit(limit);
  const totalCount = await Category.countDocuments({ isActive: true });

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.getSpecificCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const doc = await Category.findOne({ slug });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAllCategoryForAdmin = catchAsync(async (req, res, next) => {
  //PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  const { search, isActive } = req.query;

  let query = {
    ...(isActive && isActive == 'all'
      ? { isActive: { $in: [true, false] } }
      : { isActive }),
    ...(search &&
      search != '' && {
        $or: [{ name: { $regex: search, $options: 'i' } }],
      }),
  };

  const [doc, totalCount] = await Promise.all([
    Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    totalCount,
    data: doc,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const files = req.files;
  const foundCategory = await Category.findOne({ slug });

  if (files?.catImage) {
    if (foundCategory?.image && foundCategory.image != 'default.png')
      await deleteFile(foundCategory?.image);

    req.body.image = await uploadFilesToS3(files, 'catImage', 0, 25);
  }

  const doc = await Category.findOneAndUpdate({ slug }, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.activateDeactivateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const foundCategory = await Category.findById(id);

  if (!foundCategory) return next(new AppError('Category not found.', 400));

  if (foundCategory?.isActive == status)
    return next(
      new AppError(
        `Category already ${status ? 'activated' : 'deactivated'}.`,
        400
      )
    );

  const doc = await Category.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  );

  res.status(204).json({
    status: 'success',
    data: doc,
  });
});
