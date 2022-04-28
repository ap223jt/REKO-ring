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
const Article = require("./models/article")



app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Connect to mongoDB Database
 */

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");


const { reset } = require("nodemon");
const { log } = require("console");
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);



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
 * POST data from form create-article
 */

app.post("/create-article", (req, res) => {
    try {
        const saveArticle = new Article(req.body);
        saveArticle.save()
    } catch (error) {
        res.status(400).json({message: err.message}) // 400 = users input misstake
    }
});

app.put("/article/:id", async(req, res) => {
    let id = req.params.id;
    Article.findByIdAndUpdate(id, {
        facebookPostID: req.body.facebookID
    }, function(err,response) {
        if(err) res.status(400).json({message: err.message})
    })
   console.log(req.params.id);
});
