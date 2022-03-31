const mongoose = require('mongoose')

const subComment = new mongoose.Schema({
    fbCommentID:  {
        type: String,
        required: true,
        unique: true
    },
    message: String
})

