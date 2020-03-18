const express = require("express");
const qs = require("querystring");
const axios = require("axios").default;
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
      jwt.verify(req.headers.authorization, JWT_SECRET);
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

const OAUTH_HOST = "https://kauth.kakao.com";
const USER_PROFILE_URL = "https://kapi.kakao.com/v2/user/me";
const redirect_uri = "http://localhost:3000/auth/kakao/callback";

router.get("/kakao", (req, res) => {
  res.redirect(
    `${OAUTH_HOST}/oauth/authorize?client_id=${process.env.KAKAO_SECRET}&redirect_uri=${redirect_uri}&response_type=code`
  );
});

router.get("/kakao/callback", async (req, res, next) => {
  try {
    if (req.query.error) {
      console.error(req.query.error);
      return res.redirect("/");
    }

    const body = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_SECRET,
      redirect_uri,
      code: req.query.code
    };

    let response;

    try {
      response = await axios.post(
        `${OAUTH_HOST}/oauth/token`,
        qs.stringify(body),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        }
      );
    } catch (err) {
      console.error(err);
      return res.redirect("/");
    }

    response = await axios.post(
      USER_PROFILE_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      }
    );

    const profile = response.data;
    const userId = `KAKAO${profile.id}`;

    const tokens = makeTokens({ id: userId });

    let user = await User.findOne({
      socialId: {
        kakao: profile.id
      }
    });

    if (!user) {
      user = await new User({
        id: userId,
        socialId: {
          kakao: profile.id
        },
        message: `${profile.properties.nickname}입니다`,
        refreshToken: tokens.refresh
      }).save();
    } else {
      await User.updateOne({ id: userId }, { refreshToken: tokens.refresh });
    }

    const payload = {
      user: {
        id: user.id,
        message: user.message
      },
      tokens
    };

    // response를 bypass로 전달합니다
    response = {
      code: 200,
      message: "카카오 로그인에 성공했습니다",
      payload
    };

    // req.flash("responseStr", JSON.stringify(response));
    // res.redirect("/auth/bypass");

    res.render("bypass", {
      responseEncoded: encodeURIComponent(JSON.stringify(response))
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// router.get("/bypass", (req, res) => {
//   res.render("bypass", {
//     responseEncoded: encodeURIComponent(req.flash("responseStr"))
//   });
// });

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
