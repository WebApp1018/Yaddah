const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    subject: {
      type: String,
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    userType: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model('Faq', faqSchema);
module.exports = Faq;
