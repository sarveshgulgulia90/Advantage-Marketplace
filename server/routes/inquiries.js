const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const adminAuth = require("../middleware/auth");

const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry",
  new mongoose.Schema({
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    email:   { type: String, default: "" },
    product: { type: String, default: "General" },
    message: { type: String, default: "" },
    read:    { type: Boolean, default: false },
  }, { timestamps: true })
);

// POST /api/inquiries — public
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ error: "Name and phone are required" });

    const doc = await Inquiry.create({ name, phone, email: email||"", product: product||"General", message: message||"" });

    // Log new enquiry to terminal
    console.log("\n NEW ENQUIRY from "+name+" | "+phone);
    console.log("   Product: "+(product||"General")+"\n");

    // Email notifications (if configured)
    if(process.env.EMAIL_USER && process.env.EMAIL_PASS){
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{ user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS }
      });

      // Notify admin
      transporter.sendMail({
        from:`"Advantage Silchar Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject:`New Enquiry: ${product||"General"} — ${name}`,
        html:`<div style="font-family:Arial,sans-serif;max-width:500px;">
          <div style="background:#0B1F5E;padding:16px 24px;">
            <div style="font-size:16px;font-weight:900;color:#fff;">NEW ENQUIRY <span style="color:#CC1A1A;">— Advantage Silchar</span></div>
          </div>
          <div style="padding:20px 24px;background:#fff;border:1px solid #e2e4ea;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:100px;">Name</td><td style="padding:8px 0;font-weight:700;color:#0B1F5E;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;font-weight:700;"><a href="tel:${phone}" style="color:#CC1A1A;">${phone}</a></td></tr>
              ${email?`<tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${email}</td></tr>`:""}
              <tr><td style="padding:8px 0;color:#888;">Product</td><td style="padding:8px 0;font-weight:700;">${product||"General"}</td></tr>
              ${message?`<tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${message}</td></tr>`:""}
            </table>
            <div style="margin-top:16px;">
              <a href="https://wa.me/91${phone.replace(/[^0-9]/g,"")}?text=${encodeURIComponent("Hi "+name+", regarding your enquiry about "+product+"...")}" 
                style="background:#25D366;color:#fff;padding:10px 20px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block;margin-right:8px;">
                Reply on WhatsApp
              </a>
              <a href="tel:${phone}" style="background:#0B1F5E;color:#fff;padding:10px 20px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block;">
                Call Now
              </a>
            </div>
          </div>
        </div>`
      }).catch(e=>console.log("[Email] Admin notify failed:", e.message));

      // Send confirmation to customer if email provided
      if(email){
        transporter.sendMail({
          from:`"Advantage Silchar" <${process.env.EMAIL_USER}>`,
          to: email,
          subject:`Enquiry Received — Advantage Silchar`,
          html:`<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0B1F5E;padding:20px 28px;">
              <div style="font-size:20px;font-weight:900;color:#fff;">ADVANTAGE <span style="color:#CC1A1A;">SILCHAR</span></div>
            </div>
            <div style="padding:28px;background:#fff;border:1px solid #e2e4ea;">
              <h2 style="color:#0B1F5E;margin:0 0 12px;">Hi ${name},</h2>
              <p style="color:#555;font-size:14px;line-height:1.7;">Thank you for your enquiry. We will get back to you shortly.</p>
              <div style="background:#f5f7fa;border:1px solid #e2e4ea;padding:16px 20px;margin:20px 0;font-size:13px;">
                <strong>Product:</strong> ${product||"General"}<br/>
                <strong>Phone:</strong> ${phone}<br/>
                ${message?"<strong>Message:</strong> "+message:""}
              </div>
              <p style="color:#555;font-size:13px;">Our team will call you at <strong>${phone}</strong> soon.</p>
              <div style="margin-top:20px;padding:14px;background:#0B1F5E;color:#fff;font-size:12px;line-height:1.8;">
                Advantage Silchar — Anand Arcade, Opp. Civil Hospital, Silchar – 788001<br/>
                03842-230952 / 9435070738 | Mon–Sat 10AM–8PM
              </div>
            </div>
          </div>`
        }).catch(e=>console.log("[Email] Customer receipt failed:", e.message));
      }
    }

    res.status(201).json({ message: "Enquiry received", inquiry: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries — admin only
router.get("/", adminAuth, async (req, res) => {
  try {
    const docs = await Inquiry.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inquiries/:id/read
router.put("/:id/read", adminAuth, async (req, res) => {
  try {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;