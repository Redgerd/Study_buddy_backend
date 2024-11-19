const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/userModel.js"); // Adjust the path to your User model
require("dotenv").config();

// JWT strategy options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
  secretOrKey: process.env.JWT_SECRET, // JWT secret key (make sure this matches your signing key)
};

// JWT strategy
const jwtStrategy = new JwtStrategy(options, (jwt_payload, done) => {
  User.findById(jwt_payload.id) // Search for the user by ID
    .then((user) => {
      if (user) {
        return done(null, user); // Successfully authenticated, attach user to req.user
      }
      return done(null, false); // If user not found, authentication failed
    })
    .catch((err) => done(err, false)); // Handle errors
});

// Use the strategy in Passport
passport.use(jwtStrategy);

module.exports = passport;
