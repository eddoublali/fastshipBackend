const express = require("express");
const Category = require("../models/Category");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

// Create Category (Admin only)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Categories (Public access)
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Category (Admin only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Category (Admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
