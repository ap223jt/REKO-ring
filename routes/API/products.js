const express = require('express');
const router = express.Router()
const Product = require('../../models/product')

//Getting all
router.get('/', async (req,res) => {
    try {
        const product = await Product.find();
        res.json(product)
    } catch(err) {
        res.status(500).json({message: err.message}) // 500 = error on server/database
    }
})

//Getting one
router.get('/:id', getProduct, (req,res) => {
    res.send(res.product)
})

router.get('/articleID/:id',async (req,res) => {
    let product
    try {
        product = await Product.find({articleID:req.params.id})
        if (product == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
        res.json(product)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

//Creating one
router.post('/', async (req,res) => {
    const article = new Product({
        articleID: req.body.articleID,
        pName: req.body.farmName,
        pQuantity: req.body.description,
        pDesc: req.body.products,
        pImg: req.body.pImg,
        pPrice: req.body.pPrice
    })

    try {
        const newProduct = await product.save(); //save in database
        res.status(201).json(newProduct); // automaticlly sends 200 which means successfull but 201 means you created something successfull
    } catch(err) {
        res.status(400).json({message: err.message}) // 400 = users input misstake
    }
})

//Updating one
router.patch('/:id', getProduct, async (req,res) => {
    if (req.body.description != null){
        res.article.description = req.body.description
    }
    try {
        const updatedProduct = await res.product.save()
        res.json(updatedArticle)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//Deleting one
router.delete('/:id',getProduct, async (req,res) => {
    try {
        await res.article.remove()
        res.json({message: "Article deleted!"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


async function getProduct(req, res, next){
    let product
    try {
        product = await Product.findById(req.params.id);
        if (product == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.product = product
    next()
}


module.exports = router //fix errors