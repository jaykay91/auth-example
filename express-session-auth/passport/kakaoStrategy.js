const kakaoStrategy = require("passport-kakao").Strategy;

const User = require("../schemas/User");

module.exports = passport => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_SECRET,
        callbackURL: "/auth/kakao/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            socialId: {
              kakao: profile.id
            }
          });

          if (exUser) {
            return done(null, exUser);
          }

          const newUser = await new User({
            id: `KAKAO${profile.id}`,
            socialId: {
              kakao: profile.id
            },
            message: profile._json.properties.nickname
          }).save();

          done(null, newUser);
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
