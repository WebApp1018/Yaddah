const mongoose = require('mongoose');

const staffScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    default: null,
  },
  timeSlot: {
    type: [{ time: String, status: String }],
    default: [],
  },
});

const staffSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Staff name is required.'],
    },
    slug: {
      type: String,
      default: null,
    },
    slugId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Staff email is required.'],
    },
    phoneNo: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Staff number is required.'],
    },
    description: {
      type: String,
    },
    disabledDates: {
      type: [Date],
      default: [],
    },
    schedule: {
      type: [staffScheduleSchema],
      default: [],
    },
    image: {
      type: String,
      default: 'default.png',
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
  {
    timestamps: true,
  }
);

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
