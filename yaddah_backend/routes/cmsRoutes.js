const express = require('express');
const { updatePage, getDynamicPage } = require('../controllers/cmsController');
const { uploadSharpImage } = require('../utils/fileUpload');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/pages/all').get(getDynamicPage);

router.use(protect, restrictTo('super-admin', 'admin'));

router.patch('/page/update', uploadSharpImage, updatePage);

module.exports = router;
