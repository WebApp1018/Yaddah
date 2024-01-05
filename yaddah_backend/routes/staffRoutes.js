const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');

const {
  createStaff,
  getAllStaffsForServiceProvider,
  updateStaff,
  activeDeactivateStaff,
  getSpecificStaff,
} = require('../controllers/staffController');

const { uploadSharpImage } = require('../utils/fileUpload');

router.use(protect, restrictTo('service-provider'));

//api to create staff for service-provider
router.route('/create').post(uploadSharpImage, createStaff);

//api to get all staffs for service-provider
router.route('/service-provider/all').get(getAllStaffsForServiceProvider);

//api to update staff
router.route('/:id').patch(uploadSharpImage, updateStaff);

//api to get staff details
router.route('/view-detail/:id').get(getSpecificStaff);

//activate/deactivate staff
router.route('/activate-deactivate/:id').patch(activeDeactivateStaff);

module.exports = router;
