/**
 * Require & import stuff
 */
require("dotenv").config();

const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
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
const productsRouter = require("./routes/API/products");
const cartsRouter = require("./routes/API/carts");

app.use("/API/articles", articlesRouter);
app.use("/API/users", usersRouter);
app.use("/API/products", productsRouter);
app.use("/API/carts", cartsRouter);

/**
 * Start files on localhost
 */
app.use(express.static("views"));
app.use(express.static("public"));

/**
 * Start HTTPS Server
 */

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

sslServer.listen(3000, () => console.log("Server Started"));

/**
 * Form POST to DB
 */
const Article = require("./models/article");
const Product = require("./models/product");
const Cart = require("./models/cart");
const jwt = require("jsonwebtoken");

app.post("/create-article", (req, res) => {
    console.log(req.user);
  try {
    const saveArticle = new Article(req.body);
    saveArticle.save();

    console.log(saveArticle._id);
    for (let i = 0; i < req.body.products.length; i++) {
      const saveProduct = new Product({
        articleID: saveArticle._id,
        pName: req.body.products[i].pName,
        pQuantity: req.body.products[i].pQuantity,
        pDesc: req.body.products[i].pDesc,
        pImg: req.body.products[i].pImg,
        pPrice: req.body.products[i].pPrice,
      });
      saveProduct.save();
    }
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 = users input misstake
  }
});

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "./views", "/farm.html"));
});

app.post("/completed-cart", async (req, res) => {
  let saveCart;
  //endast body.cart 0 sparas då alla produkter hamnar i första objectet, resten innehar endast articleID
  try {
    saveCart = new Cart(req.body.cart[0]);
    saveCart.save();
    res.redirect("/myOrders.html");
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 = users input misstake
  }
});