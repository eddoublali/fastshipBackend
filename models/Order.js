const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            total: { type: Number, required: true }
        }
    ],
    status: { type: String, default: "pending" },
    totalAmount: { type: Number, required: true },
    shippingDetails: {
        name: { type: String, required: true, message: "Name is required" },
        address: { type: String, required: true, message: "Address is required" }
    }
}, { timestamps: true });

OrderSchema.pre('save', function (next) {
    if (!this.shippingDetails.name || !this.shippingDetails.address) {
        next(new Error('Both name and address are required in shipping details'));
    } else {
        next();
    }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;