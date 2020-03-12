const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.json({
        code: 404,
        message: "Access-Token의 유효기간이 만료되었습니다"
      });
    }
    res.json({
      code: 400,
      message: "토큰이 유효하지 않습니다"
    });
  }
};
