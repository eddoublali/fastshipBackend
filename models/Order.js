const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true }
        }
    ],
    status: { type: String, default: "Pending" },
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
