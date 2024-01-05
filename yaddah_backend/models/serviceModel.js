const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Service name is required.'],
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      type: Number,
      default: 0,
    },
    length: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    staff: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    },
    venue: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
    },
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
