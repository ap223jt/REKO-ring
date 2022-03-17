const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    description: String,
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Article', articleSchema);