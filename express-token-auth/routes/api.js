const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("./middlewares");

const router = express.Router();

router.use(verifyToken);

router.get("/message", (req, res) => {
  res.json({
    code: 200,
    message: "Hello, API!"
  });
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      code: 200,
      message: "사용자 데이터를 성공적으로 가져왔습니다.",
      payload: { users }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    // req.decoded
    // {
    //   id: 1,
    //   iat: 'iat',
    //   exp: 'exp',
    // }

    const profileData = await User.findOne({ id: req.decoded.id });

    res.json({
      code: 200,
      message: "프로파일 데이터를 성공적으로 가져왔습니다",
      paylaod: { profileData }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
