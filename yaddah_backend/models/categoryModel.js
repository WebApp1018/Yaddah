const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Please enter category name.'],
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    showDescription: {
      type: Boolean,
      default: true,
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
