const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  cat:        { type: String, required: true, enum: ["Laptops","Desktops","Printers","Accessories","Security & CCTV"] },
  price:      { type: String, required: true },
  icon:       { type: String, default: "💻" },
  image:      { type: String, default: "" },
  newArrival: { type: Boolean, default: false },
  inStock:    { type: Boolean, default: true },
  spec:       { type: String, default: "" },
  specs:      { type: Map, of: String, default: {} },
  highlights: { type: [String], default: [] },
  visible:    { type: Boolean, default: true },
  order:      { type: Number, default: 0 },
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model("Product", productSchema);