const mongoose = require('mongoose')

const farmSchema = new mongoose.Schema({
    fbUserID: {
        type: String,
        required: true
    },
    farmName:  {
        type: String,
        required: true
    },
    description: String,
    farmImg: String
})
module.exports = mongoose.model('Farm', farmSchema);