const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAppDetails,
  getSingleAppConfig,
  updateDetails,
  createAppConfig,
  switchConfig,
} = require('../controllers/appConfigController');

const router = express.Router();

// Protect all routes after this middleware
// router.use(protect, restrictTo('super-admin', 'admin'));

router.route('/').get(getAppDetails);
router.route('/:key').get(getSingleAppConfig);
router.route('/create').post(createAppConfig);
router.route('/update').patch(updateDetails);
router.route('/switch').patch(switchConfig);

module.exports = router;
