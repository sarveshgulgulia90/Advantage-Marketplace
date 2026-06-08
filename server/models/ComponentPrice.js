const mongoose = require("mongoose");

const componentPriceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    componentId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent duplicate component entries within the same category
componentPriceSchema.index(
  { category: 1, componentId: 1 },
  { unique: true }
);

module.exports = mongoose.model("ComponentPrice", componentPriceSchema);