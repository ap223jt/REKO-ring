const mongoose = require('mongoose')
const replies = require('./replies');


const commentSchema = new mongoose.Schema({
    fbCommentID:  {
        type: String,
        required: true,
        unique: true
    },
    message: String,
    replies: [replies]
})
