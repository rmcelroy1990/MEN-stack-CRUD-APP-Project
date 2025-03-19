const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    name: String,
    offersDelivery: Boolean,
  });

  const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
