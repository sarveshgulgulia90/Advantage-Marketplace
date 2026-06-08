// server/routes/components.js
const express = require('express');
const router = express.Router();
const ComponentPrice = require('../models/ComponentPrice');
const { protect, admin } = require('../middleware/authMiddleware'); // Adjust path to your auth middleware

// @desc    Get all components and prices for the PC Builder
// @route   GET /api/components
// @access  Public
router.get('/', async (req, res) => {
  try {
    const components = await ComponentPrice.find({});
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching components', error: error.message });
  }
});

// @desc    Update or Bulk Update component prices
// @route   POST /api/components/update
// @access  Private/Admin
router.post('/update', protect, admin, async (req, res) => {
  const { category, name, price, inStock } = req.body;

  try {
    // Upsert mechanism: updates if exists matching category + name, otherwise creates new
    const updatedComponent = await ComponentPrice.findOneAndUpdate(
      { category, name },
      { price, inStock },
      { new: true, upsert: true }
    );
    res.json(updatedComponent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating component price', error: error.message });
  }
});

module.exports = router;