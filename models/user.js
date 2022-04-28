const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fbUserId: {
        type: String,
        required: true,
        unique: true
    },
    typeOfUser: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);