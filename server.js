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

const farmRouter = require("./routes/API/farms");
const usersRouter = require("./routes/API/users");
const articlesRouter = require("./routes/API/articles");
const cartsRouter = require("./routes/API/carts");

app.use("/API/farms", farmRouter);
app.use("/API/users", usersRouter);
app.use("/API/articles", articlesRouter);
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
const Farm = require("./models/farm");
const Article = require("./models/article");
const Cart = require("./models/cart");

app.post("/edit-profile", async (req, res) => {
  let farm;
  try {
    //check if there is a Farm with same fbUserID, if there isnt it inserts, if there is a record in db it updates it
    farm = await Farm.find({ fbUserID: req.body.fbUserID });
    if (farm.length <= 0) {
      const savedFarm = new Farm(req.body);
      savedFarm.save();
    } else {
      await Farm.findOneAndUpdate(req.body);
    }
    res.redirect("./profil.html");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post("/create-article", async (req, res) => {
  try {
    console.log(req.body);
    const savedFarm = await new Article(req.body);
    savedFarm.save();
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

app.post("/change-orderstatus", async (req, res) => {
  try {
    await Cart.findOneAndUpdate({_id:req.body.cartID},{orderStatus:req.body.orderStatus});
    res.redirect("./farmOrders.html");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

const XLSX = require('xlsx');

app.post("/export-xls", async (req, res) => {
  console.log(req.body.export);
  const workSheet = XLSX.utils.json_to_sheet(req.body.export);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook,workSheet,"user_bookings");

  //generate buffer
  XLSX.write(workBook,{bookType: 'xlsx', type:"buffer"});

  //binary string
  XLSX.write(workBook,{bookType: 'xlsx', type:"binary"});

  //download
  XLSX.writeFile(workBook,"user_bookings.xlsx");
});
