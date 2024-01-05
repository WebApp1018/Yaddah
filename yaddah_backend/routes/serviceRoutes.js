const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const serviceController = require('../controllers/serviceController');
const { uploadSharpImage } = require('../utils/fileUpload');

const router = express.Router();

router.route('/').get(serviceController.getAllServicesForCustomer);

router
  .route('/sp/:id')
  .get(serviceController.getServicesOfSpecificServiceProvider);

router.route('/detail/:id').get(serviceController.serviceDetailForCustomer);

router.route('/staff-schedule/:id').post(serviceController.staffSchedule);

router.use(protect);

router.use(restrictTo('service-provider'));

router.route('/:id').get(serviceController.serviceDetail);

router.route('/').post(uploadSharpImage, serviceController.addService);

router
  .route('/service-provider/all')
  .get(serviceController.getAllServicesForServiceProvider);

router.route('/:id').patch(uploadSharpImage, serviceController.updateService);

router
  .route('/activate-deactivate/:id')
  .patch(serviceController.activeDeactiveService);

router.route('/delete-images/:id').patch(serviceController.deleteServiceImages);

module.exports = router;
