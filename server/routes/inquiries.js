const express   = require("express");
const router    = express.Router();
const Inquiry   = require("../models/Inquiry");
const adminAuth = require("../middleware/auth");

// POST /api/inquiries — customer submits (public)
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ error: "Name and phone are required" });

    const inquiry = await Inquiry.create({ name, phone, email, product, message });
    res.status(201).json({ message: "Enquiry received", inquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries — admin views all
router.get("/", adminAuth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inquiries/:id/read
router.put("/:id/read", adminAuth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!inquiry) return res.status(404).json({ error: "Not found" });
    res.json(inquiry);
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