const express = require('express');

const router = express.Router();
const {
  protect,
  restrictTo,
  checkPermission,
} = require('../controllers/authController');

const {
  createPackage,
  getPackagesForAdmin,
  getPackage,
  updatePackage,
  getProductForAdmin,
  createProduct,
  createPayPalWebHook,
  deletePayPalWebHook,
} = require('../controllers/packageController');

//api to get package for service-provider
router.route('/').get(getPackage);

router.route('/create-webhook').post(createPayPalWebHook);

router.route('/delete-webhook/:id').delete(deletePayPalWebHook);

router.use(protect, restrictTo('admin', 'sub-admin'));

//api to create package
router.route('/').post(createPackage);

router.route('/admin/product').post(createProduct);
router.route('/admin/all').get(getPackagesForAdmin);
router.route('/admin/product/all').get(getProductForAdmin);

//api to update package for admin
router.route('/:id').patch(updatePackage);

module.exports = router;
