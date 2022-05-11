const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    farmName:  {
        type: String,
        required: true
    },
    description: String
})
module.exports = mongoose.model('Article', articleSchema);