const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan")

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Shop = require("./models/shop.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/shops", async (req, res) => {
  const allShops = await Shop.find();
  res.render("shops/index.ejs", { shops: allShops});
});

app.post("/shops", async ( req, res) => {
  if (req.body.offersDelivery === "on") {
    req.body.offersDelivery = true;
  } else {
    req.body.offersDelivery = false;
  }
  await Shop.create(req.body);
  res.redirect("/shops");
});

app.get("/shops/new", (req, res) => {
  res.render("shops/new.ejs");
})

app.get("/shops/:shopId", async (req, res) => {
  const foundShop = await Shop.findById(req.params.shopId);
  res.render("shops/show.ejs", { shop: foundShop });
});

app.delete("/shops/:shopId", async (req, res) => {
  await Shop.findByIdAndDelete(req.params.shopId);
  res.redirect("/shops");
});

app.get("/", async (req, res) => {
  res.send("hello, friend!");
});


app.listen(3001, () => {
  console.log("Listening on port 3001");
});

