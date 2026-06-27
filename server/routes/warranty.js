const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const adminAuth = require("../middleware/auth");

const Warranty = mongoose.models.Warranty || mongoose.model("Warranty",
  new mongoose.Schema({
    serialNumber:  { type: String, required: true, unique: true },
    productName:   { type: String, required: true },
    customerName:  { type: String, required: true },
    customerPhone: { type: String, default: "" },
    purchaseDate:  { type: Date, required: true },
    warrantyMonths:{ type: Number, required: true },
    expiryDate:    { type: Date, required: true },
    notes:         { type: String, default: "" },
  }, { timestamps: true })
);

// PUBLIC — check warranty by serial number
router.get("/check/:serial", async (req, res) => {
  try {
    const w = await Warranty.findOne({
      serialNumber: req.params.serial.trim().toUpperCase()
    });
    if (!w) return res.status(404).json({ error: "Serial number not found in our records." });
    const now   = new Date();
    const valid = w.expiryDate > now;
    const daysLeft = Math.ceil((w.expiryDate - now) / (1000*60*60*24));
    res.json({ ...w.toObject(), valid, daysLeft });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// ADMIN — get all warranties
router.get("/", adminAuth, async (req, res) => {
  try {
    const list = await Warranty.find().sort({ createdAt: -1 });
    res.json(list);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// ADMIN — add warranty
router.post("/", adminAuth, async (req, res) => {
  try {
    const { serialNumber, productName, customerName, customerPhone, purchaseDate, warrantyMonths, notes } = req.body;
    if (!serialNumber || !productName || !customerName || !purchaseDate || !warrantyMonths)
      return res.status(400).json({ error: "All required fields must be filled" });
    const purchase = new Date(purchaseDate);
    const expiry   = new Date(purchase);
    expiry.setMonth(expiry.getMonth() + Number(warrantyMonths));
    const w = await Warranty.create({
      serialNumber: serialNumber.trim().toUpperCase(),
      productName, customerName, customerPhone,
      purchaseDate: purchase, warrantyMonths: Number(warrantyMonths),
      expiryDate: expiry, notes: notes||"",
    });
    res.status(201).json(w);
  } catch(err){
    if(err.code===11000) return res.status(400).json({ error: "Serial number already registered" });
    res.status(500).json({ error: err.message });
  }
});

// ADMIN — delete warranty
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Warranty.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;