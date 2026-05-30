require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");

const productRoutes  = require("./routes/products");
const inquiryRoutes  = require("./routes/inquiries");

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));  // 10mb for base64 images
app.use(express.urlencoded({ extended: true }));

/* ── Routes ── */
app.use("/api/products",  productRoutes);
app.use("/api/inquiries", inquiryRoutes);

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "Advantage API running ✓" }));

/* ── Connect DB then start server ── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });