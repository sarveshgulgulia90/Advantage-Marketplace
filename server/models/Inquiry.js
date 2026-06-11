import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  email:   { type: String, default: "" },
  product: { type: String, default: "General" },
  message: { type: String, default: "" },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Inquiry", inquirySchema);