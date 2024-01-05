const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Venue name is required.'],
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
    },
    country: {
      type: String,
      required: [true, 'Country name is required.'],
    },
    state: {
      type: String,
      required: [true, 'State name is required.'],
    },
    city: {
      type: String,
      required: [true, 'City name is required.'],
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required.'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required.'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required.'],
    },
    serviceCategory: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    },
    disabledDates: {
      type: [Date],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
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

venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
