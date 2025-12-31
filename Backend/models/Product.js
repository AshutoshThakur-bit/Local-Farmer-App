const mongoose = require("mongoose");

const productSchema = new mongoose.Schema ({
    farmerId : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    description: String,
    price: Number,
    stock: Number,
    image: String
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);