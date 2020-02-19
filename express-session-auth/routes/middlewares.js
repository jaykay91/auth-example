exports.isLoggedInSession = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("message", "로그인이 필요합니다.");
    res.redirect("/");
  }
};

exports.isNotLoggedInSession = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    req.flash("message", "로그아웃이 필요합니다.");
    res.redirect("/");
  }
};
