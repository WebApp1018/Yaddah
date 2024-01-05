const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    name: {
      type: String,
    },
    create_time: {
      type: Date,
    },
    links: {
      type: [
        {
          href: { type: String },
          rel: { type: String },
          method: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
