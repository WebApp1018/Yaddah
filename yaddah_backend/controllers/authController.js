const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../models/userModel');
const Package = require('../models/packageModel');
const Staff = require('../models/staffModel');
const Venue = require('../models/venueModel');
const Coupon = require('../models/couponModel');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');
const {
  payWithPayPal,
  getSubscription,
  generateAccessToken,
  getTransactionDetailBySubscriptionId,
  updatePayPalSubscription,
  cancelPayPalSubscription,
} = require('../utils/paypal');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { createNotification } = require('./notificationController');
const Revenue = require('../models/revenueModel');
const { BACKEND_HOSTED_URL } = process.env;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const addFCMToken = (token) => {
  let obj = {};

  if (!!token)
    obj = {
      $addToSet: {
        fcmToken: token,
      },
      isOnline: true,
    };

  return obj;
};

const createSendToken = async (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  //password remove

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};
exports.createSendToken = createSendToken;

exports.createSubAdmin = catchAsync(async (req, res, next) => {
  let {
    fullName,
    userName,
    email,
    fcmToken,
    permissions,
    lat,
    lng,
    role,
    password,
    passwordConfirm,
  } = req.body;

  const files = req.files;

  const subAdminExistWithEmail = await User.findOne({
    email,
  });

  if (subAdminExistWithEmail)
    return next(new AppError('Sub-Admin already exist with this email.', 400));

  const subAdminExistWithUserName = await User.findOne({
    userName,
  });

  if (subAdminExistWithUserName)
    return next(
      new AppError('Sub-Admin already exist with this username.', 400)
    );
  else {
    let obj = {
      fullName,
      userName,
      email,
      fcmToken,
      permissions,
      role: 'sub-admin',
      status: 'accepted',
      location: { coordinates: [41.2323, 13.567] },
      password,
      passwordConfirm,
    };

    const anyUserData = await User.findOne();
    const newId = !anyUserData ? 1 : Number(anyUserData.slugId) + 1;
    anyUserData && (await User.updateMany({}, { slugId: newId }));

    const slug = `${fullName.toLowerCase().replace(/ /g, '-')}-${newId}`;

    obj.slug = slug;
    obj.slugId = newId;

    const newUser = await User.create({
      ...obj,
    });

    newUser.password = null;

    createSendToken(newUser, 201, req, res);
  }
});

exports.updateSubAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedSubAdmin = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedSubAdmin,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  let {
    fullName,
    userName,
    role,
    email,
    verifyEmail,
    phoneNo,
    country,
    countryCode,
    city,
    zipCode,
    lat,
    lng,
    regionState,
    address,
    fcmToken,
    password,
    passwordConfirm,
    packageId,
    subscriptionId,
    planId,
    couponCode,
    comment,
    organization,
    fax,
    serviceCategory,
  } = req.body;

  const files = req.files;
  let foundPackage = null;

  if (['admin'].includes(role))
    return next(new AppError('This is not a Admin Route', 403));

  const userExistWithEmail = await User.findOne({
    email,
  });

  if (userExistWithEmail)
    return next(new AppError('User already exist with this email.', 400));

  const userExistWithUserName = await User.findOne({
    userName,
  });

  if (userExistWithUserName)
    return next(new AppError('User already exist with this username.', 400));
  else {
    let obj = {
      fullName,
      userName,
      role,
      email,
      verifyEmail,
      country,
      regionState,
      city,
      address,
      zipCode,
      location: { type: 'Point', coordinates: [lng, lat] },
      phoneNo,
      countryCode,
      fcmToken,
      password,
      passwordConfirm,
    };

    const admin = await User.findOne({ role: 'admin' });

    if (role == 'service-provider') {
      let subscriptionDetail = null;
      if (packageId) {
        let paypalAccessToken = await generateAccessToken();
        subscriptionDetail = await getSubscription(
          paypalAccessToken,
          subscriptionId
        );
        if (!subscriptionDetail)
          return next(new AppError('Invalid Subscription!', 400));
        foundPackage = await Package.findById(packageId).lean();
        if (!foundPackage) return next(new AppError('Package not found', 400));
      } else
        foundPackage = await Package.findOne({ packageType: 'Free' }).lean();

      // const userTimeZone = 'Europe/Amsterdam';
      // let packageStartDateWithUserTimeZoneAdd = moment(moment(subscriptionDetail?.start_time).format('YYYY-MM-DD') + 'T00:00:00.000Z','YYYY-MM-DDTHH:mm:ss.SSS[Z]').format();
      // packageStartDateWithUserTimeZoneAdd = moment.tz(packageStartDateWithUserTimeZoneAdd, userTimeZone).format();

      obj = {
        ...obj,
        payee: {
          email_address: subscriptionDetail?.subscriber?.email_address,
          merchant_id: subscriptionDetail?.subscriber?.payer_id,
        },
        comment,
        organization,
        fax,
        serviceCategory,
        package: foundPackage._id,
        paypalSubscriptionId: subscriptionId,
        paypalPlanId: planId,
        paypalSubscriptionDetail: subscriptionDetail,
        subscriptionExpired:
          subscriptionDetail?.status == 'ACTIVE' ? false : true,
        planStartDate: subscriptionDetail?.start_time,
        planEndDate: subscriptionDetail?.billing_info?.next_billing_time,
        planLastRenewalDate: subscriptionDetail?.start_time,
        packageType: foundPackage.packageType,
        planType: foundPackage.planType,
        planAmount: foundPackage.price,
        totalBookings: foundPackage.includeBooking,
        availableBookings: foundPackage.includeBooking,
        totalVenues: foundPackage.locationVenue,
        availableVenues: foundPackage.locationVenue,
        totalStaff: foundPackage.staff,
        availableStaff: foundPackage.staff,
        totalServices: foundPackage.services,
        availableServices: foundPackage.services,
      };
    }

    try {
      if (files?.photo)
        obj.photo = await uploadFilesToS3(files, 'photo', 0, 25);

      if (files?.commercialLicense)
        obj.commercialLicense = await uploadFilesToS3(
          files,
          'commercialLicense',
          0
        );
    } catch (err) {
      const error =
        err?.code == 'UserSuspended'
          ? 'Something went wrong while uploading media!'
          : err;
      return next(new AppError(error, 400));
    }

    const anyUserData = await User.findOne();
    const newId = !anyUserData ? 1 : Number(anyUserData.slugId) + 1;
    anyUserData && (await User.updateMany({}, { slugId: newId }));

    const slug = `${fullName.toLowerCase().replace(/ /g, '-')}-${newId}`;

    obj.slug = slug;
    obj.slugId = newId;

    const newUser = await User.create({
      ...obj,
    });

    if (newUser.role == 'service-provider' && newUser.packageType != 'Free') {
      await Transaction.create({
        serviceProvider: newUser._id,
        admin: admin._id,
        amount: foundPackage.price,
        message: `You Have Successfully Subscribe For ${foundPackage?.packageType} Package.`,
        // captureId: paypalTransactionDetail?.id,
      });
      await Revenue.create({
        serviceProvider: newUser._id,
        package: foundPackage._id,
        packageType: foundPackage.packageType,
        duration: foundPackage.planType,
        amount: foundPackage.price,
      });
    }

    if (role == 'service-provider') {
      await createNotification(
        {
          title: 'Service Provider Registration Request',
          fcmToken: admin.fcmToken,
          data: { flag: 'register', userId: String(newUser._id) },
        },
        {
          sender: newUser._id,
          socket: admin.socketId,
          receiver: admin._id,
          message: 'New service provider registration request.',
          flag: 'register',
          title: 'Service Provider Registration Request',
          senderMode: 'service-provider',
        }
      );
      const verifyUrl = `${BACKEND_HOSTED_URL}api/v1/users/verify-email/${slug}`;
      await new Email(newUser).sendWelcomeEmail({
        userName,
        email,
        password,
        verifyUrl,
      });
    }

    newUser.password = null;

    createSendToken(newUser, 201, req, res);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, fcmToken } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  let user = await User.findOne({ email }).select('+password');

  if (!user)
    return next(new AppError('No user is specified with this email.', 401));

  if (['admin', 'sub-admin'].includes(user.role))
    return next(new AppError('Not a admin Login.', 403));

  // if (user.status == 'pending')
  //   return next(
  //     new AppError('Your account is not yet approved by admin.', 401)
  //   );

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  if (user.isBlockedByAdmin) {
    return next(new AppError('Your Account has been blocked by Admin', 401));
  }

  // 3) If everything ok, send token to client

  // IF FCM TOKEN IS PROVIDED
  if (fcmToken) {
    user = await User.findByIdAndUpdate(user._id, {
      ...addFCMToken(fcmToken),
    })
      .select('+password')
      .lean();
  }

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

// Admin login
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  let user = await User.findOne({ email }).select('+password');

  if (!user)
    return next(new AppError('No user is specified with this email.', 401));

  if (user.role !== 'admin' && user.role !== 'sub-admin')
    return next(new AppError('Not a user login.', 403));

  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // 3) If everything ok, send token to client

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

exports.logout = catchAsync(async (req, res) => {
  const { token, ip } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    lastLogin: Date.now(),
    $pull: { fcmToken: token },
    // $push: { loginHistory: logoutObject },
  });

  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+wallet');
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.checkPermission = () => {
  return (req, res, next) => {
    const apiUrl = req.originalUrl.split('v1/')[1].split('/')[0];
    if (req.user.role != 'admin' && !req.user.permissions.includes(apiUrl))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

exports.excludedTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (roles.includes(req.user.role)) {
      return next(
        new AppError('You are not allowed to perform this action.', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with this email address.', 400));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}?token=${
      req.protocol
    }://${req.get('host')}/api/v1/users/resetPasswordDone/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(err), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { token1 } = req.params;
  res.render('password-page', { token });
  // res.render('thankyou', { token });
});

exports.resetPasswordDone = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  await new Email(user, (resetURL = '')).sendPasswordResetConfirmation();
  // await sendPasswordResetConfirmation(neUser);

  res.render('thankyou');
});

exports.updatePlanByServiceProvider = catchAsync(async (req, res, next) => {
  const { package, subscriptionId, planId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  const foundPackage = await Package.findById(package);

  const foundStaffs = await Staff.find({ createdBy: userId, isActive: true });

  const foundVenues = await Venue.find({ createdBy: userId, isActive: true });

  let subscriptionDetail = null,
    updatedSubscriptionDetail = null;

  if (foundPackage.planType == 'Free' && user.planType == 'Free')
    return next(
      new AppError(
        'You are already on free plan, please select another plan.',
        400
      )
    );

  if (
    user.planType != 'Free' &&
    user.planType != 'None' &&
    foundPackage.planType == 'Free'
  )
    return next(
      new AppError(
        'You are already on paid plan, you cannot switch to the free plan.',
        400
      )
    );

  if (!user) return next(new AppError('No user found.', 400));

  if (!foundPackage) return next(new AppError('Package not found.', 400));

  if (foundStaffs.length >= foundPackage.staff)
    return next(
      new AppError(
        `You have ${foundStaffs.length} staff members. You have to downgrade your staff.`,
        400
      )
    );

  if (foundVenues.length >= foundPackage.locationVenue)
    return next(
      new AppError(
        `You have ${foundVenues.length} venues. You have to downgrade your venues.`,
        400
      )
    );

  if (foundPackage.packageType != 'Free') {
    let paypalAccessToken = await generateAccessToken();

    subscriptionDetail = await getSubscription(
      paypalAccessToken,
      subscriptionId
    );

    if (!subscriptionDetail)
      return next(new AppError('Invalid subscription!', 400));

    updatedSubscriptionDetail = await updatePayPalSubscription(
      paypalAccessToken,
      subscriptionId,
      planId
    );

    if (!updatedSubscriptionDetail)
      return next(new AppError('Subscription updating failed!', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      package: foundPackage._id,
      paypalSubscriptionId: subscriptionId,
      paypalPlanId: planId,
      paypalSubscriptionDetail: subscriptionDetail,
      subscriptionExpired:
        foundPackage.packageType == 'Free' ||
        subscriptionDetail?.status == 'ACTIVE'
          ? false
          : true,
      planStartDate: subscriptionDetail?.start_time,
      planEndDate: subscriptionDetail?.billing_info?.next_billing_time,
      packageType: foundPackage.packageType,
      planType: foundPackage.planType,
      planAmount: foundPackage.price,
      totalBookings: foundPackage.includeBooking,
      availableBookings: foundPackage.includeBooking,
      totalVenues: foundPackage.locationVenue,
      availableVenues: foundPackage.locationVenue,
      totalStaff: foundPackage.staff,
      availableStaff: foundPackage.staff,
      totalServices: foundPackage.services,
      availableServices: foundPackage.services,
    },
    {
      new: true,
    }
  );

  const admin = await User.findOne({ role: 'admin' });

  if (foundPackage.packageType != 'Free') {
    await Transaction.create({
      serviceProvider: user._id,
      admin: admin._id,
      amount: foundPackage.price,
      message: `You Have Successfully Subscribe For ${foundPackage?.packageType} Package.`,
    });
    await Revenue.create({
      serviceProvider: user._id,
      package: foundPackage._id,
      packageType: foundPackage.packageType,
      duration: foundPackage.planType,
      amount: foundPackage.price,
    });
    await createNotification(
      {
        title: 'Subscription Updated',
        fcmToken: admin.fcmToken,
        data: { flag: 'subscription', userId: String(user._id) },
      },
      {
        sender: user._id,
        receiver: admin._id,
        socket: admin.socketId,
        message: 'Service provider has updated his subscription.',
        flag: 'subscription',
        title: 'Subscription Updated',
        senderMode: 'service-provider',
      }
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.unsubscribeSubscription = catchAsync(async (req, res, next) => {
  const { user } = req;

  const reason = 'Not satisfied with the service.';

  if (user.packageType == 'None')
    return next(new AppError('You are not subscribed to any plan.', 400));

  let paypalAccessToken = await generateAccessToken();

  await cancelPayPalSubscription(
    paypalAccessToken,
    user.paypalSubscriptionId,
    reason
  );

  const admin = await User.findOne({ role: 'admin' });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      packageType: 'None',
      planType: 'None',
      planStartDate: null,
      planEndDate: null,
      totalBookings: 0,
      availableBookings: 0,
      totalVenues: 0,
      availableVenues: 0,
      totalStaff: 0,
      availableStaff: 0,
      totalServices: 0,
      availableServices: 0,
      planAmount: 0,
      paypalPlanId: null,
      subscriptionExpired: true,
      paypalSubscriptionId: null,
      paypalSubscriptionDetail: null,
    },
    {
      new: true,
    }
  );

  await createNotification(
    {
      title: 'Subscription Unsubscribed',
      fcmToken: admin.fcmToken,
      data: { flag: 'subscription', userId: String(user._id) },
    },
    {
      sender: user._id,
      receiver: admin._id,
      socket: admin.socketId,
      message: 'Service provider has unsubscribed his subscription.',
      flag: 'subscription',
      title: 'Subscription Unsubscribed',
      senderMode: 'service-provider',
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
