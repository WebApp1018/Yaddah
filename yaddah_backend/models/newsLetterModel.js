const mongoose = require('mongoose');

const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email'],
      lowercase: true,
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

const NewsLetter = mongoose.model('NewsLetter', newsLetterSchema);

module.exports = NewsLetter;
