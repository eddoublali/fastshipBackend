const express = require("express");
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");

const router = express.Router();

// Create Product (Admin only)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        // Ensure image is an array (if missing, set default empty array)
        const { name, description, price, image = [], category, subCategory, sizes, date, bestseller } = req.body;

        if (!Array.isArray(image)) {
            return res.status(400).json({ message: "Image must be an array of strings" });
        }

        const product = new Product({
            name,
            description,
            price,
            image,  // This is now guaranteed to be an array
            category,
            subCategory,
            sizes,
            date,
            bestseller
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Products (Public access)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Product by ID (Public access)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Product (Admin only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Product (Admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
