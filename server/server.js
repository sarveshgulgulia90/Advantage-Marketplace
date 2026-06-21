require("dotenv").config();
const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");

const app  = express();
const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "advantage_admin_secret_2025";

/* ── Middleware ── */
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

/* ── Admin auth helper ── */
function adminAuth(req, res, next){
  const token = (req.headers["x-admin-token"] || "").trim();
  if (!token || token !== ADMIN_TOKEN.trim()){
    console.log("401 — got:", token.slice(0,10), "expected:", ADMIN_TOKEN.trim().slice(0,10));
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* ── Debug route ── */
app.get("/api/debug-token", (req, res) => {
  const sent = (req.headers["x-admin-token"] || "").trim();
  res.json({ match: sent === ADMIN_TOKEN.trim(), sentFirst10: sent.slice(0,10), expectedFirst10: ADMIN_TOKEN.trim().slice(0,10) });
});

/* ── Inline ServiceJob model & routes ── */
const ServiceJob = mongoose.models.ServiceJob || mongoose.model("ServiceJob",
  new mongoose.Schema({
    jobId:        { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone:        { type: String, required: true },
    deviceType:   { type: String, required: true },
    brand:        { type: String, default: "" },
    model:        { type: String, default: "" },
    issue:        { type: String, default: "" },
    serviceType:  { type: String, default: "Carry-in" },
    status:       { type: String, default: "Received",
                    enum: ["Received","Diagnosed","In Progress","Ready for Pickup","Completed","Cancelled"] },
    estimatedCost:{ type: Number, default: 0 },
    timeline: [{ status: String, date: { type: Date, default: Date.now }, note: { type: String, default: "" } }],
  }, { timestamps: true })
);

function genJobId(){
  return "ADV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
}

// PUBLIC — track repair by job ID
app.get("/api/service/track/:jobId", async (req, res) => {
  try {
    const job = await ServiceJob.findOne({ jobId: req.params.jobId.trim().toUpperCase() });
    if (!job) return res.status(404).json({ error: "Job ID not found. Please check and try again." });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN — get all jobs
app.get("/api/service/all", adminAuth, async (req, res) => {
  try {
    const jobs = await ServiceJob.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUBLIC — create job (called by repair booking form)
app.post("/api/service/create", async (req, res) => {
  try {
    const { customerName, phone, deviceType, brand, model, issue, serviceType } = req.body;
    if (!customerName || !phone || !deviceType)
      return res.status(400).json({ error: "Name, phone and device type required" });
    let jobId = genJobId();
    while (await ServiceJob.findOne({ jobId })) { jobId = genJobId(); }
    const job = await ServiceJob.create({
      jobId, customerName, phone,
      deviceType, brand: brand||"", model: model||"",
      issue: issue||"", serviceType: serviceType||"Carry-in",
      status: "Received",
      timeline: [{ status: "Received", date: new Date(), note: "Device received at store" }],
    });
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN — update status
app.put("/api/service/:jobId/status", adminAuth, async (req, res) => {
  try {
    const { status, note, estimatedCost } = req.body;
    const job = await ServiceJob.findOne({ jobId: req.params.jobId.toUpperCase() });
    if (!job) return res.status(404).json({ error: "Job not found" });
    job.status = status;
    if (estimatedCost !== undefined) job.estimatedCost = Number(estimatedCost);
    job.timeline.push({ status, date: new Date(), note: note||"" });
    await job.save();
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN — delete job
app.delete("/api/service/:jobId", adminAuth, async (req, res) => {
  try {
    await ServiceJob.findOneAndDelete({ jobId: req.params.jobId.toUpperCase() });
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Other routes (from files) ── */
app.use("/api/products",   require("./routes/products"));
app.use("/api/inquiries",  require("./routes/inquiries"));
app.use("/api/ai",         require("./routes/ai"));
app.use("/api/components", require("./routes/components"));
app.use("/api/email",      require("./routes/email"));

try { app.use("/api/auth",   require("./routes/auth"));   } catch(e){ console.warn("auth skipped:", e.message); }
try { app.use("/api/orders", require("./routes/orders")); } catch(e){ console.warn("orders skipped:", e.message); }

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "Advantage API running ✓" }));

/* ── 404 ── */
app.use((req, res) => res.status(404).json({ error: "Route not found: " + req.path }));

/* ── Error handler ── */
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

/* ── Connect DB ── */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () => console.log("✓ Server running on http://localhost:" + PORT));
  })
  .catch(err => { console.error("✗ MongoDB failed:", err.message); process.exit(1); });