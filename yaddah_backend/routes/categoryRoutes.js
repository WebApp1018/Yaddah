const express = require('express');

const router = express.Router();
const {
  protect,
  restrictTo,
  checkPermission,
} = require('../controllers/authController');

const {
  getSpecificCategory,
  getAllCategoryForUser,
  getAllCategoryForAdmin,
  createCategory,
  updateCategory,
  activateDeactivateCategory,
} = require('../controllers/categoryController');

const { uploadSharpImage } = require('../utils/fileUpload');

//api to get all category
router.route('/').get(getAllCategoryForUser);

router.use(protect, restrictTo('admin', 'sub-admin'));

//api to create category
router.route('/').post(uploadSharpImage, createCategory);

//api to get all category for admin
router.route('/admin/all').get(getAllCategoryForAdmin);

router.route('/view-detail/:slug').get(getSpecificCategory);

//admin updating any category
router.route('/:slug').patch(uploadSharpImage, updateCategory);

//admin activate/deactivate a category
router.route('/:id').patch(activateDeactivateCategory);

module.exports = router;
