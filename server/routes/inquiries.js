const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");
const adminAuth = require("../middleware/auth");

// Define schema inline — no separate model file needed
const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry",
  new mongoose.Schema({
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    email:   { type: String, default: "" },
    product: { type: String, default: "General" },
    message: { type: String, default: "" },
    read:    { type: Boolean, default: false },
  }, { timestamps: true })
);

// POST /api/inquiries — public, any customer can submit
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ error: "Name and phone are required" });
    const doc = await Inquiry.create({ name, phone, email: email||"", product: product||"General", message: message||"" });
    res.status(201).json({ message: "Enquiry received", inquiry: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries — admin only
router.get("/", adminAuth, async (req, res) => {
  try {
    const docs = await Inquiry.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inquiries/:id/read
router.put("/:id/read", adminAuth, async (req, res) => {
  try {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;