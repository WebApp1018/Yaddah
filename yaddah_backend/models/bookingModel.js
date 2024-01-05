const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: null,
  },
  slot: {
    type: [{ time: String, status: String }],
    default: [],
  },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      default: '0',
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    discount: {
      type: Number,
      default: 0,
    },
    bookedSlots: {
      type: [slotSchema],
      default: [],
    },
    qrCode: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
