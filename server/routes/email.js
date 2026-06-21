const express    = require("express");
const router     = express.Router();
const nodemailer = require("nodemailer");
const adminAuth  = require("../middleware/auth");

// POST /api/email/invoice — admin sends invoice email to customer
router.post("/invoice", adminAuth, async (req, res) => {
  const { to, customerName, invNo, date, items, subtotal, gstAmt, total, gst, notes, phone } = req.body;

  if (!to || !customerName) {
    return res.status(400).json({ error: "Recipient email and name required" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ error: "Email not configured. Add EMAIL_USER and EMAIL_PASS to server/.env" });
  }

  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const rows = (items || []).map(it => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;">${it.desc}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:center;">${it.qty}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:right;">Rs.${parseFloat(it.rate||0).toLocaleString()}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">Rs.${parseFloat(it.amount||0).toLocaleString()}</td>
    </tr>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
<div style="max-width:620px;margin:24px auto;background:#fff;border:1px solid #e2e4ea;">

  <!-- Header -->
  <div style="background:#0B1F5E;padding:24px 28px;display:flex;justify-content:space-between;align-items:flex-start;">
    <div>
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-.01em;">AD<span style="color:#CC1A1A;">V</span>ANTAGE <span style="font-size:14px;font-weight:700;color:rgba(255,255,255,.5);">SILCHAR</span></div>
      <div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:6px;line-height:1.7;">
        Anand Arcade, Opp. Civil Hospital, Hospital Road<br/>
        Silchar – 788001, Assam &nbsp;|&nbsp; 9435070738
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:.04em;">INVOICE</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px;">${invNo}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5);">${date}</div>
    </div>
  </div>

  <!-- Bill To -->
  <div style="background:#f5f7fa;padding:16px 28px;border-bottom:1px solid #e2e4ea;">
    <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:6px;">Bill To</div>
    <div style="font-size:16px;font-weight:700;color:#0B1F5E;">${customerName}</div>
    <div style="font-size:12px;color:#666;margin-top:3px;">Phone: ${phone || "—"} &nbsp;|&nbsp; Email: ${to}</div>
  </div>

  <!-- Items Table -->
  <div style="padding:0 28px 0;">
    <table style="width:100%;border-collapse:collapse;margin-top:0;">
      <thead>
        <tr style="background:#0B1F5E;">
          <td style="padding:10px 16px;font-size:10px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;width:44%;">Description</td>
          <td style="padding:10px 16px;font-size:10px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;text-align:center;width:10%;">Qty</td>
          <td style="padding:10px 16px;font-size:10px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;text-align:right;width:20%;">Rate</td>
          <td style="padding:10px 16px;font-size:10px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;text-align:right;width:20%;">Amount</td>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- Totals -->
  <div style="padding:0 28px 20px;display:flex;justify-content:flex-end;">
    <table style="width:260px;border-collapse:collapse;margin-top:0;">
      <tr>
        <td style="padding:8px 14px;font-size:13px;color:#555;border-bottom:1px solid #f0f0f0;">Subtotal</td>
        <td style="padding:8px 14px;font-size:13px;font-weight:600;color:#0B1F5E;text-align:right;border-bottom:1px solid #f0f0f0;">Rs.${parseFloat(subtotal||0).toLocaleString()}</td>
      </tr>
      ${gst ? `<tr><td style="padding:8px 14px;font-size:13px;color:#555;border-bottom:1px solid #f0f0f0;">GST (18%)</td><td style="padding:8px 14px;font-size:13px;font-weight:600;color:#0B1F5E;text-align:right;border-bottom:1px solid #f0f0f0;">Rs.${parseFloat(gstAmt||0).toFixed(2)}</td></tr>` : ""}
      <tr style="background:#0B1F5E;">
        <td style="padding:12px 14px;font-size:15px;font-weight:700;color:#fff;">Total</td>
        <td style="padding:12px 14px;font-size:15px;font-weight:700;color:#fff;text-align:right;">Rs.${parseFloat(total||0).toLocaleString()}</td>
      </tr>
    </table>
  </div>

  <!-- Notes -->
  ${notes ? `<div style="margin:0 28px 20px;padding:14px 16px;background:#f5f7fa;border:1px solid #e2e4ea;font-size:12px;color:#555;line-height:1.7;"><strong>Notes:</strong> ${notes}</div>` : ""}

  <!-- Footer -->
  <div style="background:#0B1F5E;padding:16px 28px;text-align:center;">
    <div style="font-size:11px;color:rgba(255,255,255,.4);">
      Advantage Silchar — Est. 1995 &nbsp;|&nbsp; Silchar's trusted computer store &nbsp;|&nbsp; Mon–Sat, 10AM–8PM<br/>
      Anand Arcade, Opposite Civil Hospital, Hospital Road, Silchar – 788001
    </div>
  </div>

</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Advantage Silchar" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Invoice ${invNo} from Advantage Silchar`,
      html,
    });
    res.json({ message: "Invoice sent to " + to });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email: " + err.message });
  }
});

module.exports = router;