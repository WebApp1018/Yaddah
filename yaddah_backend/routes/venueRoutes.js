const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const venueController = require('../controllers/venueController');
const { uploadSharpImage } = require('../utils/fileUpload');

const router = express.Router();

router.use(protect, restrictTo('service-provider'));

router.route('/:id').get(venueController.venueDetail);

router.route('/').post(uploadSharpImage, venueController.addVenue);

router
  .route('/service-provider/all')
  .get(venueController.getAllVenuesForServiceProvider);

router.route('/:id').patch(uploadSharpImage, venueController.updateVenue);

router
  .route('/activate-deactivate/:id')
  .patch(venueController.activateDeactivateVenue);

router.route('/delete-images/:id').patch(venueController.deleteVenueImages);

module.exports = router;
