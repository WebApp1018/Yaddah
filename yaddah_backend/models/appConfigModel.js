const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

const databaseSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'database' },
    SERVICE: { type: String, trim: true, default: 'DATABASE' },
    COLLECTIONS: {
      type: [String],
      default: [
        'appconfigs',
        'bookings',
        'categories',
        'chats',
        'cms',
        'contactus',
        'coupons',
        'faqs',
        'newsletters',
        'notifications',
        'packages',
        'products',
        'reports',
        'revenues',
        'rooms',
        'services',
        'sociallinks',
        'staffs',
        'transactions',
        'users',
        'venues',
        'whychooseuscruds',
      ],
    },
    PREVIOUS_DBS: {
      type: [{ DB_NAME: { type: String }, DB_URL: { type: String } }],
      default: [],
    },
    SOURCE_DB_NAME: { type: String },
    SOURCE_DB_URL: { type: String },
    TARGET_DB_NAME: { type: String },
    TARGET_DB_URL: { type: String },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const sendgridSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'SENDGRID' },
    EMAIL_FROM: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    SENDGRID_USERNAME: { type: String },
    SENDGRID_PASSWORD: { type: String },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const postmarkSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'POSTMARK' },
    EMAIL_FROM: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    POSTMARK_KEY: { type: String },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const awsSesSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'AWSSES' },
    EMAIL_FROM: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    AWS_ACCESS_KEY: { type: String },
    AWS_SECRET_KEY: { type: String },
    AWS_SES_REGION: { type: String },
    API_VERSION: { type: String },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const gmailSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'GMAIL' },
    HOST: { type: String, default: 'smtp.gmail.com' },
    PORT: { type: Number, default: 587 },
    USER: { type: String, trim: true, default: null },
    PASSWORD: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const office365Schema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'OFFICE365' },
    HOST: { type: String, default: 'smtp.office365.com' },
    PORT: { type: Number, default: 587 },
    USER: { type: String, trim: true, default: null },
    PASSWORD: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const smtpSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'email' },
    SERVICE: { type: String, trim: true, default: 'SMTP' },
    HOST: { type: String, default: 'smtp.smtp.com' },
    PORT: { type: Number, default: 587 },
    USER: { type: String, trim: true, default: null },
    PASSWORD: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const paypalSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'payment' },
    MODE: {
      type: String,
      lowercase: true,
      enum: ['sandbox', 'live'],
      default: 'sandbox',
    },
    SERVICE: { type: String, trim: true, default: 'PAYPAL' },
    CLIENT_ID_SANDBOX: { type: String, default: null },
    APP_SECRET_SANDBOX: { type: String, default: null },
    CLIENT_ID_LIVE: { type: String, default: null },
    APP_SECRET_LIVE: { type: String, default: null },
    PAYPAL_WEBHOOK_ID: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const mapSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'map' },
    SERVICE: { type: String, trim: true, default: 'MAP' },
    MAP_KEY: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const s3Schema = new mongoose.Schema(
  {
    type: { type: String, default: 's3' },
    AWS_BUCKET_REGION: { type: String, default: null },
    AWS_ACCESS_KEY: { type: String, default: null },
    AWS_SECRET_KEY: { type: String, default: null },
    AWS_VIDEO_BUCKET_LINK: { type: String, default: null },
    AWS_USERNAME: { type: String, default: null },
    AWS_IMAGE_BUCKET_NAME: { type: String, default: null },
    isSelect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const appConfigSchema = new mongoose.Schema(
  {
    keyType: {
      type: String,
      enum: {
        values: [
          'database',
          'sendgrid',
          'postmark',
          'awsSes',
          'gmail',
          'office365',
          'smtp',
          'paypal',
          's3',
        ],
        message: 'enum mismatch!',
      },
      required: [true, 'Please provide a key type'],
    },
    sendgrid: sendgridSchema,
    postmark: postmarkSchema,
    awsSes: awsSesSchema,
    gmail: gmailSchema,
    office365: office365Schema,
    smtp: smtpSchema,
    paypal: paypalSchema,
    s3: s3Schema,
    map: mapSchema,
    database: databaseSchema,
  },
  { timestamps: true }
);

appConfigSchema.pre('save', function (next) {
  // aa[aa.key];
  if (!this[this.keyType])
    return next(new AppError('Please provide a valid Object', 400));

  return next();
});

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

module.exports = AppConfig;
