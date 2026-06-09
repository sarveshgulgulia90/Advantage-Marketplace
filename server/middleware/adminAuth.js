// server/middleware/adminAuth.js
// Simple token-based auth for admin routes
// Token is set in .env as ADMIN_TOKEN

module.exports = function adminAuth(req, res, next) {
  const auth = req.headers["x-admin-token"] || req.query.token;
  if (!auth || auth !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};