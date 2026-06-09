// server/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Middleware to protect routes
const auth = require('../middleware/auth');

// @desc    Create a new order
// @route   POST /api/orders/create
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Please include at least one product' });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({ message: 'Please include shipping address' });
    }

    // Create new order
    const order = new Order({
      user: req.user.id, // Assuming auth middleware attaches user to req
      products,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      totalAmount: totalAmount || 0,
      status: 'Pending' // Default status
    });

    // Save order
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: 'Please include status' });
    }

    // Find and update order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;