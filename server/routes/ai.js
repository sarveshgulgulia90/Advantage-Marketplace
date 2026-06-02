const express = require("express");
const router  = express.Router();

// POST /api/ai/compare
router.post("/compare", async (req, res) => {
  try {
    const { products, useCase } = req.body;

    if (!products || !useCase)
      return res.status(400).json({ error: "products and useCase are required" });

    const key = process.env.GEMINI_API_KEY;
    if (!key)
      return res.status(500).json({ error: "GEMINI_API_KEY not set in server .env" });

    const productSummary = products.map((p, i) =>
      "Product " + (i+1) + ": " + p.name +
      " | Price: " + p.price +
      " | Specs: " + Object.entries(p.specs || {}).map(([k,v]) => k + ": " + v).join(", ") +
      " | Highlights: " + (p.highlights || []).join(", ")
    ).join("\n");

    const prompt =
      "You are a helpful computer store assistant at Advantage Silchar, India.\n" +
      "Customer need: \"" + useCase + "\"\n\n" +
      "Products:\n" + productSummary + "\n\n" +
      "Recommend the best product for this need.\n" +
      "Reply ONLY with valid JSON, no markdown:\n" +
      "{\"winner\":\"exact product name\",\"reason\":\"2-3 sentences why best\",\"verdicts\":[{\"name\":\"product name\",\"verdict\":\"one line\",\"rating\":\"Excellent or Good or Average or Not Recommended\"}],\"tip\":\"one practical buying tip\"}";

    console.log("Calling Gemini for use case:", useCase);

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
        })
      }
    );

    const raw = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini error:", JSON.stringify(raw));
      return res.status(geminiRes.status).json({
        error: raw.error?.message || "Gemini API returned error " + geminiRes.status
      });
    }

    const text   = raw.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean  = text.replace(/```json|```/g, "").trim();

    console.log("Gemini raw response:", clean.slice(0, 200));

    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error("AI route exception:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;