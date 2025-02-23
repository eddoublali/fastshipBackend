const express = require("express");
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

// Create Order (Protected for logged-in users)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        if (!items || !Array.isArray(items)) {
            throw new Error("Invalid items format");
        }

        if (!totalAmount || typeof totalAmount !== "number") {
            throw new Error("Total amount is required and must be a number");
        }

        // Check for required shipping details
        if (!req.body.shippingDetails || !req.body.shippingDetails.name || !req.body.shippingDetails.address) {
            throw new Error("Shipping details (name and address) are required");
        }

        // Proceed to create order
        const order = new Order({
            user: req.user.id,
            products: items.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            })),
            totalAmount,
            shippingDetails: req.body.shippingDetails,
            status: "pending"
        });

        await order.save();

        res.status(201).json(order);
    } catch (err) {
        console.error('[Error] Order creation failed:', err.message);
        res.status(400).json({ message: err.message });
    }
});
// Get User's Orders (Protected for logged-in users)
router.get("/user", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("user", "username email")
            .populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get All Orders (Admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email")
            .populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get Order by ID (Admin or order owner)
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "username email")
            .populate("products.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if user is admin or order owner
        if (req.user.isAdmin || order.user._id.toString() === req.user.id) {
            return res.status(200).json(order);
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update Order Status (Admin only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate("user", "username email")
         .populate("products.product");

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete Order (Admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted" });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;