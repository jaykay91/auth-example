const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

// middlewares

const User = require("../schemas/User");

const router = express.Router();

router.get("/", (req, res) => {
  let user;
  if (req.user) {
    user = {
      id: req.user.id,
      message: req.user.message
    };
  }
  res.render("session-based-auth", {
    message: req.flash("message"),
    user
  });
});

router.post("/join", async (req, res, next) => {
  try {
    const { id, pw, message } = req.body;

    const user = await User.findOne({ id });
    if (user) {
      req.flash("message", "이미 가입한 회원 id입니다.");
      return res.redirect("/session-based-auth");
    }

    const hash = await bcrypt.hash(pw, 12);
    await new User({
      id,
      pw: hash,
      message
    }).save();

    req.flash("message", "회원 가입에 성공했습니다.");
    res.redirect("/session-based-auth");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!user) {
      req.flash("message", info.message);
      return res.redirect("/session-based-auth");
    }

    req.login(user, err => {
      if (err) {
        console.error(err);
        return next(err);
      }
      req.flash("message", "로그인에 성공했습니다.");
      res.redirect("/session-based-auth");
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  try {
    req.logout();
    // req.session.destroy();
    req.flash("message", "로그아웃 되었습니다.");
    res.redirect("/session-based-auth");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
