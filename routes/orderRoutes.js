const express = require("express");
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

// Create Order (Protected for logged-in users)
router.post("/", verifyToken, async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Orders (Admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Order by ID (Admin only or user who owns the order)
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user").populate("products.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if the user is either an admin or the order's owner
        if (req.user.isAdmin || order.user.toString() === req.user.id.toString()) {
            return res.status(200).json(order);
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    } catch (err) {
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
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
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
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
