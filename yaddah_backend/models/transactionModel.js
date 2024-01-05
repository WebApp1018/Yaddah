const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    transferFrom: {
      type: String,
      enum: ['admin', 'customer', 'service-provider'],
      default: 'service-provider',
    },
    transferTo: {
      type: String,
      enum: ['admin', 'customer', 'service-provider'],
      default: 'admin',
    },
    amount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'in-app'],
      default: 'paypal',
    },
    captureId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    refundedId: {
      type: String,
    },
    accountTitle: {
      type: String,
      default: '',
    },
    iBanNumber: {
      type: String,
      default: '',
    },
    bicCode: {
      type: String,
      default: '',
    },
    commission: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'deposited',
        'refund-in-process',
        'refunded',
        'withdraw',
        'rejected',
        'accepted',
      ],
      default: 'deposited',
    },
    message: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
