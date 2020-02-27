const local = require("./localStrategy");
const User = require("../schemas/User");

module.exports = passport => {
  // 처음 로그인할 때 사용자 정보에서 사용자 ID를 저장한다.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 로그인 후에 접속할때마다 ID에서 사용자 정보를 가져온다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ id });

      const newUser = {
        id: user.id,
        message: user.message
      };

      done(null, newUser);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  // localStrategy에 passport를 등록한다.
  local(passport);
};
