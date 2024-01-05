const mongoose = require('mongoose');

const whyChooseUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WhyChooseUsCrud = mongoose.model('WhyChooseUsCrud', whyChooseUsSchema);
module.exports = WhyChooseUsCrud;
