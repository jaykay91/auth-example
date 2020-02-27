const express = require("express");
const router = express.Router();

const { isLogin, isLogout } = require("./middlewares");

router.use((req, res, next) => {
  req.renderData = {
    user: req.user,
    message: req.flash("message")
  };
  next();
});

router.get("/", (req, res) => {
  res.render("index", req.renderData);
});

router.get("/join", isLogout, (req, res) => {
  res.render("join", req.renderData);
});

router.get("/profile", isLogin, (req, res) => {
  res.render("profile", req.renderData);
});

module.exports = router;
