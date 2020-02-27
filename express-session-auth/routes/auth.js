const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const { isLogin, isLogout } = require("./middlewares");
const User = require("../schemas/User");

const router = express.Router();

router.post("/join", isLogout, async (req, res, next) => {
  try {
    const { id, pw, message } = req.body;

    const user = await User.findOne({ id });
    if (user) {
      req.flash("message", "이미 가입한 회원 id입니다.");
      return res.redirect("/");
    }

    const hash = await bcrypt.hash(pw, 12);
    await new User({
      id,
      pw: hash,
      message
    }).save();

    req.flash("message", "회원 가입에 성공했습니다.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", isLogout, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!user) {
      req.flash("message", info.message);
      return res.redirect("/");
    }

    req.login(user, err => {
      if (err) {
        console.error(err);
        return next(err);
      }
      req.flash("message", "로그인에 성공했습니다.");
      res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLogin, (req, res, next) => {
  try {
    req.logout();
    // req.session.destroy();
    req.flash("message", "로그아웃 되었습니다.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/"
  }),
  (req, res) => {
    req.flash("message", "KAKAO 로그인에 성공하였습니다.");
    res.redirect("/");
  }
);

module.exports = router;
