const dotenv = require("dotenv"); 
dotenv.config(); 
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan")
const path = require("path");
const session = require('express-session');


const app = express();

const authController = import("./controllers/auth.js");

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Shop = require("./models/shop.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    }),
);



app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});


app.get("/shops", async (req, res) => {
  const allShops = await Shop.find();
  res.render("shops/index.ejs", { shops: allShops});
});

app.get("/garden-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the garden ${req.session.user.username}.`);
  } else {
    res.send("Sorry, you haven't been pruned yet for the garden lounge.");
  }
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

let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3001;
}

app.use("/auth", authController);

app.listen(3001, () => {
  console.log("Listening on port 3001");
});

