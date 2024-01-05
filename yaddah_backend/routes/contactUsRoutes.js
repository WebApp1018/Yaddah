const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const contactUsController = require('../controllers/contactUsController');

const router = express.Router();

router.route('/').post(contactUsController.addContactUs);

//admin getting all contact us
router.use(protect, restrictTo('admin', 'sub-admin'));
router.route('/admin/all').get(contactUsController.getAllContactUs);

//middleware to restrict all routes to admin

//admin can delete contact us
router.route('/:id').delete(contactUsController.deleteContactUs);

module.exports = router;
