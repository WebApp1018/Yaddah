const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const { protect, restrictTo } = require('../controllers/authController');
const { uploadSharpImage } = require('../utils/fileUpload');

const router = express.Router();

//for brand signup
router.post('/signup', uploadSharpImage, authController.signup);

//login for brand and influencer
router.post('/login', authController.login);

//admin login route
router.post('/admin-login', authController.adminLogin);

//user forgot password route
router.post('/forgotPassword', authController.forgotPassword);

//user reset password route
router.get('/resetPassword/:token', authController.resetPassword);

//user reset password done
router.post('/resetPasswordDone/:token', authController.resetPasswordDone);

//api to get all service providers
router.get('/get/service-providers', userController.getAllServiceProviders);

router.get('/verify-email/:slug', userController.verifyEmailBySlug);

router.use(protect);

//transaction api for admin
router.get(
  '/admin/transactions',
  restrictTo('admin'),
  userController.getAllAdminTransactions
);
router.get(
  '/admin/revenues',
  restrictTo('admin', 'sub-admin'),
  userController.getAllAdminRevenues
);
router.get(
  '/admin/all-revenues',
  restrictTo('admin', 'sub-admin'),
  userController.generateFileOfAllAdminRevenues
);

//transaction api for service provider & customer
router.get(
  '/transactions',
  restrictTo('service-provider', 'customer'),
  userController.getAllUserTransactions
);

router.get('/', userController.getAllUsers);

// service provider purchasing plan
router.patch(
  '/update-plan',
  restrictTo('service-provider'),
  authController.updatePlanByServiceProvider
);

// service provider unsubscribe plan
router.patch(
  '/unsubscribe-plan',
  restrictTo('service-provider'),
  authController.unsubscribeSubscription
);

//logout api
router.post('/logout', authController.logout);

//update password api
router.patch('/updateMyPassword', authController.updatePassword);

//update me api
router.patch('/updateMe', uploadSharpImage, userController.updateMe);

//get my own data
router.get('/me', userController.getMe, userController.getUser);

//service provider dashboard
router
  .route('/sp/stats')
  .get(
    restrictTo('service-provider'),
    userController.serviceProviderDashboardStats
  );

//customer dashboard
router
  .route('/customer/stats')
  .get(restrictTo('customer'), userController.customerDashboardStats);

//middleware for admin routes
router.use(restrictTo('admin', 'sub-admin'));

//admin generating subscription revenue report of service providers
router
  .route('/generateSubscriptionReportOfSP')
  .post(userController.generateSubscriptionReportOfSP);

router.route('/admin/reports/all').get(userController.getAllReportAdmin);

router.route('/admin/report/delete/:id').delete(userController.deleteReport);

//admin generating booking revenue report of service providers
router
  .route('/generateBookingReportOfSP')
  .post(userController.generateBookingReportOfSP);

//admin creating sub-admin
router.post('/admin/create/sub-admin', authController.createSubAdmin);

//admin update sub-admin
router.patch('/admin/update/sub-admin/:id', authController.updateSubAdmin);

//admin accept/reject user
router.patch('/admin/accept-reject-user/:id', userController.acceptRejectUser);

router.patch('/admin/block-unblock-user/:id', userController.blockUnblockUser);

//get rating
router.get('/rating', userController.getAllRatings);

//admin giving rating to sp
router.patch('/rating/:id', userController.ratingForServiceProvider);

//api to get details for customer/service-provider for admin
router.get('/admin/all', userController.getAllUsersForAdmin);

//view another user detail
router.get('/view-user-detail/:id', userController.viewUserDetail);

//admin dashboard api
router.get('/admin/stats', userController.adminDashboardStats);

//getting updating and deleting user through param id of user
router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
