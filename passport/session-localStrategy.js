const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../schemas/User");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "id",
        passwordField: "pw"
      },
      async (username, password, done) => {
        try {
          // username: id, password: pw
          const user = await User.findOne({ id: username });

          // id가 같은 사용자가 존재하지 않는 경우
          if (!user) {
            return done(null, false, {
              message: "일치하는 id가 존재하지 않습니다."
            });
          }

          // pw가 일치하지 않는 경우
          const isCorrectPw = await bcrypt.compare(password, user.pw);
          if (!isCorrectPw) {
            return done(null, false, {
              message: "비밀번호가 일치하지 않습니다."
            });
          }

          // id도 존재하고 pw도 일치하는 경우 => 로그인 성공
          done(null, user);
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
