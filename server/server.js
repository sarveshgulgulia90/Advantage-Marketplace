require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ── Debug token check (remove after fixing) ── */
app.get("/api/debug-token", (req, res) => {
  const sent = (req.headers["x-admin-token"] || "").trim();
  const expected = (process.env.ADMIN_TOKEN || "advantage_admin_secret_2025").trim();
  
  res.json({
    match: sent === expected,
    sentLength: sent.length,
    expectedLength: expected.length,
    sentFirst10: sent.slice(0, 10),
    expectedFirst10: expected.slice(0, 10),
  });
});

/* ── Routes ── */
app.use("/api/products", require("./routes/products"));
app.use("/api/inquiries", require("./routes/inquiries"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/components", require("./routes/components"));
app.use("/api/service", require("./routes/service"));

// Auth and orders need extra packages — load only if available
try {
  app.use("/api/auth", require("./routes/auth"));
  console.log("✓ Auth routes loaded");
} catch (e) {
  console.warn("⚠ Auth routes skipped:", e.message);
}

try {
  app.use("/api/orders", require("./routes/orders"));
  console.log("✓ Order routes loaded");
} catch (e) {
  console.warn("⚠ Order routes skipped:", e.message);
}

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "Advantage API running ✓" }));

/* ── Always return JSON for unknown routes ── */
app.use((req, res) => res.status(404).json({ error: "Route not found: " + req.path }));

/* ── Always return JSON for errors ── */
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: err.message });
});

/* ── Connect DB then start ── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () => console.log("✓ Server running on http://localhost:" + PORT));
  })
  .catch(err => {
    console.error("✗ MongoDB failed:", err.message);
    process.exit(1);
  });