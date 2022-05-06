const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Article", productSchema);
