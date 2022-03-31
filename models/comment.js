const mongoose = require('mongoose');
const subComment = require('./subComment');

const commentSchema = new mongoose.Schema({
    fbCommentID:  {
        type: String,
        required: true,
        unique: true
    },
    message: String,
    replies: [subComment]
})

