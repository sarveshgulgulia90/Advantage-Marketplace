const express  = require("express");
const router   = express.Router();
const Product  = require("../models/Product");
const adminAuth = require("../middleware/auth");

/* ══════════════════════════════════════════
   PUBLIC ROUTES  (no auth needed)
══════════════════════════════════════════ */

// GET /api/products — all visible products
router.get("/", async (req, res) => {
  try {
    const { cat, search } = req.query;
    let filter = { visible: true };

    if (cat && cat !== "All") filter.cat = cat;

    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ name: re }, { spec: re }, { cat: re }];
    }

    const products = await Product.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id — single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.visible)
      return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════════
   ADMIN ROUTES  (auth required)
══════════════════════════════════════════ */

// GET /api/products/admin/all — all products including hidden (admin)
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — create product
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id — update product
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id — delete product
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/seed — seed default products (run once)
router.post("/seed", adminAuth, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0)
      return res.status(400).json({ error: "Products already exist. Delete all first." });
    const products = await Product.insertMany(req.body);
    res.json({ message: `Seeded ${products.length} products`, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products — delete ALL products (admin only)
router.delete("/", adminAuth, async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
require("dotenv").config();
