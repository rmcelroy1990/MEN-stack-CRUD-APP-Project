const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan")
const path = require("path");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Shop = require("./models/shop.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

//GET /shops
app.get("/shops", async (req, res) => {
  const allShops = await Shop.find();
  res.render("shops/index.ejs", { shops: allShops});
});

//POST /shops
app.post("/shops", async ( req, res) => {
  if (req.body.offersDelivery === "on") {
    req.body.offersDelivery = true;
  } else {
    req.body.offersDelivery = false;
  }
  await Shop.create(req.body);
  res.redirect("/shops");
});

// GET /shops/new
app.get("/shops/new", (req, res) => {
    res.render("shops/new.ejs", { shops: allShops});
});

app.get("/shops/:shopId", async (req, res) => {
  const foundShop = await Shop.findById(req.params.shopId);
  res.render("shops/show.ejs", { shop: foundShop });
})
app.get("shops/:shopId", async (req, res) => {
  const foundShop = await Shop.findById(req.params.shopId);
  res.render("shops/show.ejs", { shop: foundShop });
});

app.delete("/shops/:shopId", async (req, res) => {
  await Shop.findByIdAndDelete(req.params.shopId);
  res.redirect("/shops");
});

app.get("/shops/:shopId/edit", async (req, res) => {
  const foundShop = await Shop.findById(req.params.shopId);
  res.render("shops/edit.ejs", {
    shop: foundShop,
  });
});

app.delete("/shops/:shopId", async (req, res) => {
  await Shop.findByIdAndDelete(req.params.shopId);
  res.redirect("/shops");
});


app.put("/shops/:shopId", async (req, res) => {
  if (req.body.offersDelivery === "on") {
    req.body.offersDelivery = true;
  } else {
    req.body.offersDelivery = false;
  }
  await Shop.findByIdAndUpdate(req.params.shopId, req.body);
  res.redirect(`/shops/${req.params.shopId}`);
  });



app.get("/", async (req, res) => {
  res.send("hello, friend!");
});


app.listen(3001, () => {
  console.log("Listening on port 3001");
});

