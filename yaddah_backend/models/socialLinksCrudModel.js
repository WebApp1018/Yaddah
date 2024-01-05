const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    link: {
      type: String,
    },
    platformType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SocialLinks = mongoose.model('SocialLink', socialLinkSchema);
module.exports = SocialLinks;
