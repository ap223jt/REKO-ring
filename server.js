/**
 * Require & import stuff
 */
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

/**
 * Connect to mongoDB Database
 */

mongoose.connect(process.env.DATABASE_URL) 
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.json())

const articlesRouter = require('./routes/articles')
app.use('/articles', articlesRouter)

/**
 * Start files on localhost
 */
app.use(express.static('views'))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/pics', express.static(__dirname + 'public/pics'))






/**
 * Start Server
 */

app.listen(3000, () => console.log("Server Started"))