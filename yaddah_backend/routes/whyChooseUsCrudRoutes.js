const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const whyChooseUsCrudController = require('../controllers/whyChooseUsCrudController');
const { uploadSharpImage } = require('../utils/fileUpload');

const router = express.Router();

router.route('/').get(whyChooseUsCrudController.getAllWhyChooseUs);

router.use(protect, restrictTo('admin'));

router
  .route('/')
  .post(uploadSharpImage, whyChooseUsCrudController.addWhyChooseUs);

router
  .route('/:id')
  .patch(uploadSharpImage, whyChooseUsCrudController.updateWhyChooseUs);

module.exports = router;
