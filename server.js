const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Shop = require("./models/shop.js");

app.use(express.urlencoded({ extended: false }));

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

app.get("/", async (req, res) => {
  res.send("hello, friend!");
});


app.listen(3001, () => {
  console.log("Listening on port 3001");
});

