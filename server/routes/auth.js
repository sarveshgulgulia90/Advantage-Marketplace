module.exports = function adminAuth(req, res, next) {
  const token    = (req.headers["x-admin-token"] || req.query.token || "").trim();
  const envToken = (process.env.ADMIN_TOKEN || "").trim();
  const fallback = "advantage_admin_secret_2025";

  if (!token)
    return res.status(401).json({ error: "No admin token provided" });

  // Accept if matches env token OR the hardcoded fallback
  if (token === fallback || (envToken && token === envToken))
    return next();

  console.error("[AUTH] Token mismatch. Received:", token.slice(0,12)+"... Expected:", (envToken||fallback).slice(0,12)+"...");
  return res.status(401).json({ error: "Invalid admin token. Check VITE_ADMIN_TOKEN in .env.local" });
};