const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let user;
  if (req.user) {
    user = {
      id: req.user.id,
      message: req.user.message
    };
  }
  res.render("index", {
    message: req.flash("message"),
    user
  });
});

module.exports = router;
