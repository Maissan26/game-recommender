const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.render("profile",{ user: req.user });
});

module.exports = router;
