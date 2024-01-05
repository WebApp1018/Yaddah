const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    min: [0, 'pending amount should not be less than zero.'],
    default: 0,
  },
  pendingAmount: {
    type: Number,
    min: [0, 'pending amount should not be less than zero.'],
    default: 0,
  },
  withdrawType: {
    type: String,
    enum: ['express', 'regular'],
    default: 'regular',
  },
  withdrawStatus: {
    type: String,
    enum: ['pending', 'none'],
    default: 'none',
  },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      unique: true,
      index: true,
      default: null,
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    organization: {
      type: String,
      default: null,
    },
    comment: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: 'default.png',
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'sub-admin', 'service-provider', 'customer'],
      default: 'customer',
    },
    verifyEmail: {
      type: String,
      default: null,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    fax: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    commercialLicense: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    regionState: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    countryCode: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    coupon: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
      default: [],
    },
    wallet: {
      type: walletSchema,
      default: {},
    },
    fcmToken: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      // required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      // required: [true, 'Please confirm your password'],
      // validate: {
      //   // This only works on CREATE and SAVE!!!
      //   validator: function (el) {
      //     return el === this.password;
      //   },
      //   message: 'Passwords are not the same!',
      // },
    },
    socketId: {
      type: String,
    },
    isOnline: {
      type: Boolean,
    },
    isBlockedByAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    myVenues: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
    },
    myStaff: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    },
    myServices: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    },
    myBookings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookings' }],
    },
    serviceCategory: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    paypalSubscriptionId: {
      type: String,
      default: null,
    },
    paypalSubscriptionDetail: {
      type: Object,
      default: null,
    },
    paypalPlanId: {
      type: String,
      default: null,
    },
    packageType: {
      type: String,
      enum: ['None', 'Free', 'Silver', 'Gold', 'Platinum'],
      default: 'None',
    },
    planType: {
      type: String,
      enum: ['None', 'Free', 'Monthly', 'Annual'],
      default: 'None',
    },
    planStartDate: {
      type: Date,
      default: null,
    },
    planEndDate: {
      type: Date,
      default: null,
    },
    planLastRenewalDate: {
      type: Date,
      default: null,
    },
    planAmount: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    availableBookings: {
      type: Number,
      default: 0,
    },
    totalVenues: {
      type: Number,
      default: 0,
    },
    availableVenues: {
      type: Number,
      default: 0,
    },
    totalStaff: {
      type: Number,
      default: 0,
    },
    availableStaff: {
      type: Number,
      default: 0,
    },
    totalServices: {
      type: Number,
      default: 0,
    },
    availableServices: {
      type: Number,
      default: 0,
    },
    subscriptionExpired: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    payee: {
      email_address: { type: String, default: null },
      merchant_id: { type: String, default: null },
    },
    userRating: {
      type: String,
      enum: ['none', 'top-rated', 'preferred'],
      default: 'none',
    },
    permissions: {
      type: [String],
      enum: [
        // 'cms',
        // 'users',
        // 'category',
        // 'coupon',
        // 'package',
        // 'faqs',
        // 'rating',
        // 'newsletter',
        'CustomerManagement',
        'ServiceProviderManagement',
        'Category',
        'Packages(Plans)',
        'DiscountCoupons',
        'Rating',
        'Revenue',
        'Chats',
        'Reports',
        'FAQsManagement',
        'ContactUs',
        'Newsletter',
        'Settings',
        'CMS',
        'CRUDS',
        'Notifications',
      ],
      default: [],
    },
    lastLogin: { type: Date, default: Date.now() },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
