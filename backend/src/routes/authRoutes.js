const express = require("express");
const passport = require("../auth/steamAuth");

const router = express.Router();

// Redirect user to Steam for authentication
router.get("/steam", passport.authenticate("steam"));

// Steam returns user here after login
router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile"); // Redirect to profile page after login
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
