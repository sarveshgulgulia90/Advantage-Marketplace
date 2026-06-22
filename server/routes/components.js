const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const adminAuth = require("../middleware/auth");

const ComponentPrice = mongoose.models.ComponentPrice || mongoose.model("ComponentPrice",
  new mongoose.Schema({
    category:    { type: String, required: true },
    componentId: { type: String, required: true },
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    inStock:     { type: Boolean, default: true },
    note:        { type: String, default: "" },
    specs:       { type: mongoose.Schema.Types.Mixed, default: {} },
  }, { timestamps: true })
);

// GET /api/components — all, grouped by category (public)
router.get("/", async (req, res) => {
  try {
    const all = await ComponentPrice.find().sort({ category: 1, name: 1 });
    const grouped = {};
    for (const item of all) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/components/seed — seed defaults (admin)
router.post("/seed", adminAuth, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });
    let created = 0, skipped = 0;
    for (const item of items) {
      const exists = await ComponentPrice.findOne({ category: item.category, componentId: item.componentId });
      if (!exists) { await ComponentPrice.create(item); created++; }
      else skipped++;
    }
    res.json({ message: `Seeded ${created} components, skipped ${skipped} existing` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/components/:category/:componentId — upsert (admin)
router.put("/:category/:componentId", adminAuth, async (req, res) => {
  try {
    const { category, componentId } = req.params;
    const { price, inStock, note, name, specs } = req.body;
    const doc = await ComponentPrice.findOneAndUpdate(
      { category, componentId },
      { $set: { price: Number(price), inStock, note: note||"", name, category, componentId, specs: specs||{} } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/components/:category/:componentId (admin)
router.delete("/:category/:componentId", adminAuth, async (req, res) => {
  try {
    await ComponentPrice.findOneAndDelete({ category: req.params.category, componentId: req.params.componentId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Inline model — no separate file needed
const ComponentPrice = mongoose.models.ComponentPrice || mongoose.model("ComponentPrice",
  new mongoose.Schema({
    category:    { type: String, required: true },
    componentId: { type: String, required: true },
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    inStock:     { type: Boolean, default: true },
    note:        { type: String, default: "" },
  }, { timestamps: true })
);

// GET /api/components — public, grouped by category
router.get("/", async (req, res) => {
  try {
    const all = await ComponentPrice.find().sort({ category: 1, name: 1 });
    const grouped = {};
    for (const item of all) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/components/seed — admin, seed defaults
router.post("/seed", adminAuth, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });
    let created = 0, skipped = 0;
    for (const item of items) {
      const exists = await ComponentPrice.findOne({ category: item.category, componentId: item.componentId });
      if (!exists) { await ComponentPrice.create(item); created++; }
      else skipped++;
    }
    res.json({ message: `Seeded ${created} components, skipped ${skipped} existing` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/components/:category/:componentId — admin, upsert
router.put("/:category/:componentId", adminAuth, async (req, res) => {
  try {
    const { category, componentId } = req.params;
    const { price, inStock, note, name } = req.body;
    const doc = await ComponentPrice.findOneAndUpdate(
      { category, componentId },
      { $set: { price: Number(price), inStock, note: note||"", name, category, componentId } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/components/:category/:componentId — admin
router.delete("/:category/:componentId", adminAuth, async (req, res) => {
  try {
    await ComponentPrice.findOneAndDelete({ category: req.params.category, componentId: req.params.componentId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;