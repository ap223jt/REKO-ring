const express = require('express');
const router = express.Router();
const auth = require('../auth');
const admin = require('../admin');

//Getting all
router.get('/', async (req,res) => {
    console.log(res);
    res.send('Dashboard');
})

module.exports = router //fix errors