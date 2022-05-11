const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  articleID: {
    type: String,
    required: true,
  },
  products: [
    {
      pID: {
        type: String,
        required: true,
      },
      pQuantity: {
        type: String,
        required: true,
      },
      pPrice: {
        type: String,
        required: true,
      },
    },
  ],
  acceptedByFarm : {
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model("Cart", cartSchema);
