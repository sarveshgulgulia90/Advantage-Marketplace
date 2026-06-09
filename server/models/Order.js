// server/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        // Additional product details at time of purchase
        image: String,
        specs: Object,
      },
    ],
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      postalCode: String,
      phone: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);