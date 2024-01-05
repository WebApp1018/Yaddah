const express = require('express');

const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');

const {
  getAllNewsLetters,
  getAllNewsLettersForAdmin,
  createNewsLetter,
} = require('../controllers/newsLetterController');

//api to create newsLetter
router.route('/').post(createNewsLetter);

//api to get all newsLetter
router.route('/').get(getAllNewsLetters);

router.use(protect, restrictTo('admin', 'sub-admin'));

//api to get all newsLetters for admin
router.route('/admin/all').get(getAllNewsLettersForAdmin);

module.exports = router;
