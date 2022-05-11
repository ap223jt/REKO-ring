const express = require('express');
const router = express.Router()
const Cart = require('../../models/cart')

//Getting all
router.get('/', async (req,res) => {
    try {
        const cart = await Cart.find();
        res.json(cart)
    } catch(err) {
        res.status(500).json({message: err.message}) // 500 = error on server/database
    }
})

//Getting one
router.get('/:id', getCart, (req,res) => {
    res.send(res.cart)
})

router.get('/articleID/:id',async (req,res) => {
    let cart
    try {
        cart = await Cart.find({articleID:req.params.id})
        if (cart == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
        res.json(cart)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

//Creating one
router.post('/', async (req,res) => {
    const cart = new Cart({
        articleID: req.body.articleID,
        pName: req.body.farmName,
        pQuantity: req.body.description,
        pDesc: req.body.products,
        pImg: req.body.pImg,
        pPrice: req.body.pPrice
    })

    try {
        const newCart = await cart.save(); //save in database
        res.status(201).json(newCart); // automaticlly sends 200 which means successfull but 201 means you created something successfull
    } catch(err) {
        res.status(400).json({message: err.message}) // 400 = users input misstake
    }
})

//Deleting one
router.delete('/:id',getCart, async (req,res) => {
    try {
        await res.article.remove()
        res.json({message: "Article deleted!"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


async function getCart(req, res, next){
    let cart
    try {
        cart = await Cart.find({userID: req.params.id});
        if (cart == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.cart = cart
    next()
}


module.exports = router //fix errors