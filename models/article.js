const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema({
  farmID: {
    type: String,
    required:true
  },
  dealingDate: {
    type: String,
  },
  products: [{
    pName: {
      type: String,
      required: true,
    },
    pQuantity: {
      type: String,
      required: true,
    },
    pDesc: {
      type: String,
    },
    pImg: {
      type: String,
    },
    pPrice: {
      type: String,
      required: true,
    }
  }]
});

module.exports = mongoose.model("Article", articleSchema);
