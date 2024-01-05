const express = require('express');
const router = express.Router();
const {
  protect,
  restrictTo,
  checkPermission,
} = require('../controllers/authController');

const {
  createFaqs,
  createFaqsForAdmin,
  getAllFaqs,
  getAllFaqsForAdmin,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');

//api to get all faqs
router.route('/').get(getAllFaqs);

//api to create faqs for users
router.route('/user/create').post(createFaqs);

router.use(protect, restrictTo('admin', 'sub-admin'));

//api to create faqs For admin
router.route('/admin/create').post(createFaqsForAdmin);

//api to get all faqs for admin
router.route('/admin/all').get(getAllFaqsForAdmin);

//api to update faqs
router.route('/:id').patch(updateFaq);

//api to delete faqs
router.route('/:id').delete(deleteFaq);

module.exports = router;
