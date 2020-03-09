const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello, API!" });
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

module.exports = router;
