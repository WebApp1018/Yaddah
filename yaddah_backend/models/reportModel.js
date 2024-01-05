const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
    },
    reportType: {
      type: String,
      enum: ['subscription', 'booking'],
      default: 'subscription',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;
