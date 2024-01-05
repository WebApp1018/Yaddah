const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    packageType: {
      type: String,
      enum: ['Silver', 'Gold', 'Platinum'],
    },
    duration: {
      type: String,
      enum: ['Monthly', 'Annual'],
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = Revenue;
