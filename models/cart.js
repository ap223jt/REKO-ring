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
      pName: {
        type: String,
        required: true,
      },
      pImg: {
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
  orderStatus : {
    type: String,
    default: "pending",
    required: true
  },
  createdAt: {
    type: String,
  }
}

);

module.exports = mongoose.model("Cart", cartSchema);
