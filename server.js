/**
 * Require & import stuff
 */
require("dotenv").config();

const express = require("express");
const https = require('https');
const path = require('path');
const fs = require('fs');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Connect to mongoDB Database
 */

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

/**
 * Routes
 */


const articlesRouter = require("./routes/API/articles");
const usersRouter = require("./routes/API/users");

app.use("/API/articles", articlesRouter);
app.use("/API/users", usersRouter);



/**
 * Start files on localhost
 */
app.use(express.static("views"));
app.use(express.static("public"));

/**
 * Start HTTPS Server
 */

 const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert','key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert','cert.pem'))
},app)

sslServer.listen(3000, () => console.log("Server Started"));

/**
 * Form POST to DB
 */
const Article = require('./models/article')

app.post("/create-article", (req, res) => {
    console.log(req.body);
    try {
        const saveArticle = new Article(req.body);
        saveArticle.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).json({message: err.message}) // 400 = users input misstake
    }
});


app.get("/:id", (req, res) => {
        res.sendFile(path.join(__dirname, './views', '/farm.html'));
});