const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Login API
router.post("/login", async (req, res, next) => {
  try {
    const { id, pw } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      return res.json({
        code: 400,
        message: "아이디와 일치하는 회원이 존재하지 않습니다"
      });
    }

    const isCorrect = await bcrypt.compare(pw, user.pw);
    if (!isCorrect) {
      return res.json({
        code: 404,
        message: "비밀번호가 일치하지 않습니다"
      });
    }

    // Refresh-Token을 DB에 저장합니다
    const tokens = makeTokens({ id });

    await User.updateOne({ id }, { refreshToken: tokens.refresh });

    const payload = {
      user: {
        id: user.id,
        message: user.message
      },
      tokens
    };

    res.json({
      code: 200,
      message: "로그인에 성공했습니다",
      payload
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Join API
router.post("/join", async (req, res, next) => {
  try {
    const { id, pw, message } = req.body;

    const user = await User.findOne({ id });
    if (user) {
      return res.json({
        code: 400,
        message: "이미 존재하는 아이디입니다"
      });
    }

    const tokens = makeTokens({ id });
    const hashed = await bcrypt.hash(pw, 12);

    await new User({
      id,
      message,
      pw: hashed,
      refreshToken: tokens.refresh
    }).save();

    res.json({
      code: 200,
      message: "회원가입 및 로그인에 성공했습니다",
      payload: {
        user: { id, message },
        tokens
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Token 발급 API
router.post("/token", async (req, res, next) => {
  try {
    // Access-Token의 위조 여부를 검사합니다
    try {
      jwt.verify(req.headers.authorization, TOKEN_SECRET_KEY);
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        return res.json({
          code: 400,
          message: "Access-Token이 유효하지 않습니다"
        });
      }
    }

    // 전달 받은 Refresh-Token이 DB에 저장되어 있는 Refresh-Token과 일치하는지 검사합니다
    const decoded = jwt.decode(req.headers.authorization);
    const user = await User.findOne({ id: decoded.id });
    if (user.refreshToken !== req.body.refreshToken) {
      return res.json({
        code: 400,
        message: "Refresh-Token이 유효하지 않습니다"
      });
    }

    // Refresh-Token의 유효기간이 만료되었는지 검사합니다
    if (jwt.decode(user.refreshToken).exp * 1000 < Date.now()) {
      return res.json({
        code: 400,
        message: "Refresh-Token이 만료되었습니다"
      });
    }

    // Access-Token을 발급합니다
    const tokens = makeTokens({ id: user.id }, "access");
    res.json({
      code: 200,
      message: "Access-Token이 발급 되었습니다",
      payload: { tokens }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;

function makeTokens(data, type = "all") {
  const tokens = {};
  const ISSUER = "JK";

  if (type === "all" || type === "access") {
    tokens.access = jwt.sign(data, JWT_SECRET, {
      expiresIn: 60,
      issuer: ISSUER
    });
  }

  if (type === "all" || type === "refresh") {
    tokens.refresh = jwt.sign(data, JWT_SECRET, {
      expiresIn: 300,
      issuer: ISSUER
    });
  }

  return tokens;
}
