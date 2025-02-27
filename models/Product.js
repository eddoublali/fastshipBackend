// models/Product.js
const mongoose = require('mongoose');

//	models/Product.js
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: String },
    sizes: { type: Array },
    date: { type: Date },
    bestseller: { type: Boolean }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;