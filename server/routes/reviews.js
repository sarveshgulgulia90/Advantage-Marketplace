const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const adminAuth = require("../middleware/auth");

const Review = mongoose.models.Review || mongoose.model("Review",
  new mongoose.Schema({
    productName: { type: String, required: true },
    name:        { type: String, required: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    comment:     { type: String, default: "" },
    verified:    { type: Boolean, default: false },
  }, { timestamps: true })
);

// GET /api/reviews/:productName — public
router.get("/:productName", async (req, res) => {
  try {
    const reviews = await Review.find({
      productName: decodeURIComponent(req.params.productName)
    }).sort({ createdAt: -1 });
    const avg = reviews.length
      ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, avg: Number(avg), count: reviews.length });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// POST /api/reviews — public, submit review
router.post("/", async (req, res) => {
  try {
    const { productName, name, rating, comment } = req.body;
    if (!productName || !name || !rating)
      return res.status(400).json({ error: "Product, name and rating required" });
    const review = await Review.create({ productName, name, rating: Number(rating), comment });
    res.status(201).json(review);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// DELETE /api/reviews/:id — admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// GET /api/reviews — admin, all reviews
router.get("/", adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;