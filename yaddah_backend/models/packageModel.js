const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Please enter package name.'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter package price.'],
    },
    packageType: {
      type: String,
      enum: ['Free', 'Silver', 'Gold', 'Platinum'],
    },
    planType: {
      type: String,
      enum: ['Free', 'Monthly', 'Annual'],
    },
    includeBooking: {
      type: Number,
      default: 1,
    },
    locationVenue: {
      type: Number,
      default: 1,
    },
    staff: {
      type: Number,
      default: 1,
    },
    services: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
    },
    description: {
      type: [String],
      default: [],
    },
    planData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
