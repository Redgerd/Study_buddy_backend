const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/userModel"); // Adjust according to your path

// JWT Strategy setup
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Ensure the secret is correct
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
