const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const socialLinksCrudController = require('../controllers/socialLinksCrudController');

const router = express.Router();

router.route('/').get(socialLinksCrudController.getAllSocialLinks);

router.use(protect, restrictTo('admin'));

router.route('/').post(socialLinksCrudController.addSocialLink);

router.route('/:id').patch(socialLinksCrudController.updateSocialLink);

router.route('/:id').delete(socialLinksCrudController.deleteSocialLink);

module.exports = router;
