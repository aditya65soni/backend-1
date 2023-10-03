const mongoose = require("mongoose");

const addProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    userId: String,
    company: String,
})

const AddProduct = mongoose.model("AddProduct", addProductSchema)

module.exports = AddProduct