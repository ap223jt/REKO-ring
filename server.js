/**
 * Require & import stuff
 */
require("dotenv").config();

const express = require("express");
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
const { reset } = require("nodemon");
app.use("/articles", articlesRouter);

/**
 * Start files on localhost
 */
app.use(express.static("views"));
app.use(express.static("public"));

/**
 * Start Server
 */

app.listen(3000, () => console.log("Server Started"));

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
