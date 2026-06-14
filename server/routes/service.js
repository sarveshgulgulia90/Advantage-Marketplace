const express = require("express");
const router = express.Router();

// Your service routes will go here
router.get("/", (req, res) => {
  res.json({ message: "Service route works!" });
});

module.exports = router;