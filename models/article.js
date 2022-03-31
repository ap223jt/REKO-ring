const mongoose = require('mongoose')
const comments = require('./comment');

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
    facebookPostID: {
        type: String,
    },
    comments: [comments]
})

module.exports = mongoose.model('Article', articleSchema);