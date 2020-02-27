exports.isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("message", "로그인이 필요합니다.");
  res.redirect("/");
};

exports.isLogout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.flash("message", "로그아웃이 필요합니다.");
  res.redirect("/");
};
