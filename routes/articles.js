const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router()
const Article = require('../models/article')

//Getting all
router.get('/', async (req,res) => {
    try {
        const articles = await Article.find();
        res.json(articles)
    } catch(err) {
        res.status(500).json({message: err.message}) // 500 = error on server/database
    }
})

//Getting one
router.get('/:id', getArticle, (req,res) => {
    res.send(res.article)
})

//Creating one
router.post('/', async (req,res) => {
    console.log(req);
    const article = new Article({
        description: req.body.description,
        product: req.body.product,
        quantity: req.body.quantity
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
    if (req.body.product != null){
        res.article.product = req.body.product
    }
    if (req.body.quantity != null){
        res.article.quantity = req.body.quantity
    }
    //only one comment gets inserted.....
    console.log(req.body);
    if (req.body.data != null){
        res.article.comments = req.body.data;
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
        article = await Article.findById(req.params.id)
        if (article == null) return res.status(404).json({message: 'Cannot find Article.'}) // 404 = could not find something, Article
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.article = article
    next()
}


module.exports = router //fix errors