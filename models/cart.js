const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  articleID: {
    type: String,
    required: true,
  },
  products: [
    {
      pName: {
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
});

module.exports = mongoose.model("Article", articleSchema);
