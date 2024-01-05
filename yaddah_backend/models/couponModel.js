const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Coupon title is required.'],
    },
    code: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Coupon code is required.'],
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expire date is required.'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    maxUsers: {
      type: Number,
      default: 0,
    },
    maxUsed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
