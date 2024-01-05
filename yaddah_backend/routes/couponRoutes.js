const express = require('express');

const router = express.Router();
const {
  protect,
  restrictTo,
  checkPermission,
} = require('../controllers/authController');

const {
  calculateDiscount,
  getAllCouponsForAdmin,
  createCoupon,
  updateCoupon,
  getSpecificCoupon,
  activeDeactiveCoupon,
  validateCoupon,
} = require('../controllers/couponController');

router.get('/calculate/:coupon/:package', calculateDiscount);

router.route('/validate-coupon/:couponCode').get(validateCoupon);

router.use(protect, restrictTo('admin', 'sub-admin'));

router.route('/admin/all').get(getAllCouponsForAdmin);

router.route('/').post(createCoupon);

router.route('/view-detail/:id').get(getSpecificCoupon);

router.route('/:id').patch(updateCoupon);

router.patch('/active-deactive-coupon/:id', activeDeactiveCoupon);

module.exports = router;
