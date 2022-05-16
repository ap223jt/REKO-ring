const express = require('express');
const router = express.Router()
const Article = require('../../models/article')

//Getting all
router.get('/', async (req,res) => {
    try {
        const article = await Article.find();
        res.json(article)
    } catch(err) {
        res.status(500).json({message: err.message}) // 500 = error on server/database
    }
})
//Getting one
router.get('/:id',getArticle, (req,res) => {
    res.send(res.article);
})

//Getting one
router.get('/farmID/:farmID',async (req,res) => {
    try {
        let article = await Article.find({farmID: req.params.farmID});        
        if (article == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
        res.json(article);
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

//Getting product of the array products, used in farm.js to get the product a user added to cart
router.get('/array/:id',async (req,res) => {
    let article
    try {
        article = await Article.find({"products._id":req.params.id}).select({ products: {$elemMatch: {_id: req.params.id}}});
        if (article == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
        res.json(article)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

//Creating one
router.post('/', async (req,res) => {
    const article = new Article({
        farmID: req.body.farmID,
        pName: req.body.farmName,
        pQuantity: req.body.description,
        pDesc: req.body.products,
        pImg: req.body.pImg,
        pPrice: req.body.pPrice
    })

    try {
        const newArticle = await article.save(); //save in database
        res.status(201).json(newArticle); // automaticlly sends 200 which means successfull but 201 means you created something successfull
    } catch(err) {
        res.status(400).json({message: err.message}) // 400 = users input misstake
    }
})

//Updating one
router.patch('/:id', getArticle, async (req,res) => {
    if (req.body.description != null){
        res.article.description = req.body.description
    }
    try {
        const updatedArticle = await res.article.save()
        res.json(updatedArticle)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//Deleting one
router.delete('/:id',getArticle, async (req,res) => {
    try {
        await res.article.remove()
        res.json({message: "Article deleted!"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


async function getArticle(req, res, next){
    let article
    try {
        article = await Article.findById(req.params.id);
        if (article == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.article = article
    next()
}


module.exports = router //fix errors