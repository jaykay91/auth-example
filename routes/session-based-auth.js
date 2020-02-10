const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("session-based-auth");
});

module.exports = router;
