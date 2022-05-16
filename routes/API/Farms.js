const express = require('express');
const router = express.Router()
const Farm = require('../../models/farm')

//Getting all
router.get('/', async (req,res) => {
    try {
        const farms = await Farm.find();
        res.json(farms)
    } catch(err) {
        res.status(500).json({message: err.message}) // 500 = error on server/database
    }
})

//Getting one with ID
router.get('/:id', getFarm, (req,res) => {
    res.send(res.farm)
})

//Getting one with fbUserID
router.get('/:userID',async (req,res) => {
    try {
        let farm = await Farm.find({fbUserID: req.params.userID});
        if (farm == null) return res.status(404).json({message: 'Cannot find Farm.'}) // 404 = could not find something, Farm
        res.json(farm);
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

//Deleting one
router.delete('/:id',getFarm, async (req,res) => {
    try {
        await res.farm.remove()
        res.json({message: "Farm deleted!"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


async function getFarm(req, res, next){
    let farm
    try {
        farm = await Farm.find({id: req.params.fbUserID});
        if (farm == null) return res.status(404).json({message: 'Cannot find Farm.'}) // 404 = could not find something, Farm
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.farm = farm
    next()
}


module.exports = router //fix errors