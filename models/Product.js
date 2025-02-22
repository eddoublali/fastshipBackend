// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true }, // Must be an array of strings
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true },
    date: { type: Date, required: true },
    bestseller: { type: Boolean, default: false }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;