const express = require("express");
const router  = express.Router();
const adminAuth = require("../middleware/auth");

// In-memory store for now — replace with MongoDB model later
let inquiries = [];

// POST /api/inquiries — customer submits enquiry
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });

    const inquiry = {
      id: Date.now().toString(),
      name, phone,
      email: email || "",
      product: product || "General",
      message: message || "",
      createdAt: new Date().toISOString(),
      read: false,
    };
    inquiries.unshift(inquiry);
    res.status(201).json({ message: "Enquiry received", inquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries — admin views all enquiries
router.get("/", adminAuth, async (req, res) => {
  res.json(inquiries);
});

// PUT /api/inquiries/:id/read — mark as read
router.put("/:id/read", adminAuth, async (req, res) => {
  const inq = inquiries.find(i => i.id === req.params.id);
  if (!inq) return res.status(404).json({ error: "Not found" });
  inq.read = true;
  res.json(inq);
});

// DELETE /api/inquiries/:id
router.delete("/:id", adminAuth, async (req, res) => {
  inquiries = inquiries.filter(i => i.id !== req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;