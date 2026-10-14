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

    // Send confirmation email to customer if they provided email
    if(email){
      try{
        const nodemailer = require("nodemailer");
        if(process.env.EMAIL_USER && process.env.EMAIL_PASS){
          const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{ user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS }
          });
          await transporter.sendMail({
            from: `"Advantage Silchar" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Enquiry Received — Advantage Silchar",
            html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
            <body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px;">
            <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e4ea;">
              <div style="background:#0B1F5E;padding:20px 28px;">
                <div style="font-size:20px;font-weight:900;color:#fff;">AD<span style="color:#CC1A1A;">V</span>ANTAGE <span style="font-size:13px;color:rgba(255,255,255,.5);">SILCHAR</span></div>
              </div>
              <div style="padding:28px;">
                <h2 style="color:#0B1F5E;margin:0 0 8px;">Hi ${name},</h2>
                <p style="color:#555;font-size:14px;line-height:1.7;">Thank you for your enquiry. We have received your request and will get back to you shortly.</p>
                <div style="background:#f5f7fa;border:1px solid #e2e4ea;padding:16px 20px;margin:20px 0;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:10px;">Your Enquiry Details</div>
                  <table style="width:100%;font-size:13px;">
                    <tr><td style="padding:5px 0;color:#555;width:100px;font-weight:600;">Product</td><td style="color:#0B1F5E;">${product||"General"}</td></tr>
                    <tr><td style="padding:5px 0;color:#555;font-weight:600;">Phone</td><td style="color:#0B1F5E;">${phone}</td></tr>
                    ${message?`<tr><td style="padding:5px 0;color:#555;font-weight:600;">Message</td><td style="color:#0B1F5E;">${message}</td></tr>`:""}
                  </table>
                </div>
                <p style="color:#555;font-size:13px;line-height:1.7;">Our team will call you at <strong>${phone}</strong> to discuss your requirements.</p>
                <div style="margin-top:20px;padding:14px 18px;background:#0B1F5E;color:#fff;font-size:13px;">
                  <strong>Advantage Silchar</strong><br/>
                  Anand Arcade, Opposite Civil Hospital, Hospital Road<br/>
                  Silchar – 788001, Assam<br/>
                  📞 03842-230952 / 9435070738<br/>
                  Mon–Sat · 10:00 AM – 8:00 PM
                </div>
              </div>
            </div>
            </body></html>`
          });
        }
      }catch(e){ console.log("[Email] Could not send receipt:", e.message); }
    }

    res.status(201).json({ message: "Enquiry received", inquiry: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define schema inline — no separate model file needed
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

// POST /api/inquiries — public, any customer can submit
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone)
      return res.status(400).json({ error: "Name and phone are required" });
    const doc = await Inquiry.create({ name, phone, email: email||"", product: product||"General", message: message||"" });

    // WhatsApp auto-notify admin (opens link on server — works only if you want a webhook)
    // We store the notify URL so admin can see it, but actual WA delivery needs Twilio/WATI
    // For now: log it clearly so admin sees it in terminal
    const adminPhone = process.env.ADMIN_PHONE || "919435070738";
    const notifyMsg  = encodeURIComponent(
      "New enquiry from "+name+" ("+phone+")\nProduct: "+(product||"General")+"\n"+message
    );
    console.log("\n📩 NEW ENQUIRY from "+name+" | "+phone);
    console.log("   Product: "+(product||"General"));
    console.log("   Notify URL: https://wa.me/"+adminPhone+"?text="+notifyMsg+"\n");

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