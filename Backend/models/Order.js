const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema ({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    farmerId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: false},
    products: {type: Array, required: true},
    totalAmount: {type: Number, required: true},
    status: {type: String, default: "pending"}

},{timestamps: true});

module.exports = mongoose.model("order", orderSchema);