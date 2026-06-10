const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  email:   { type: String, default: "" },
  product: { type: String, default: "General" },
  message: { type: String, default: "" },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);