// Admin auth middleware — checks x-admin-token header
module.exports = function adminAuth(req, res, next) {
  const token = (req.headers["x-admin-token"] || req.query.token || "").trim();
  const expected = (process.env.ADMIN_TOKEN || "advantage_admin_secret_2025").trim();

  if (!token) {
    return res.status(401).json({ error: "No admin token provided" });
  }
  if (token !== expected) {
    console.log("Token mismatch. Got:", token.slice(0,10)+"...", "Expected:", expected.slice(0,10)+"...");
    return res.status(401).json({ error: "Invalid admin token" });
  }
  next();
};