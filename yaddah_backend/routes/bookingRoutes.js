const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.route('/:id').get(bookingController.getBookingDetail);

router.use(protect);

router
  .route('/')
  .get(restrictTo('customer'), bookingController.getAllBookingsForCustomer);

router
  .route('/create')
  .post(restrictTo('customer'), bookingController.createBooking);

router.use(restrictTo('service-provider'));

router.route('/sp/all').get(bookingController.getAllBookingsForServiceProvider);

module.exports = router;
