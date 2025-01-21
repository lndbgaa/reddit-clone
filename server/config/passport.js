const passport = require("passport");
const redditStrategy = require("./redditStrategy");
const User = require("../models/User");

passport.use(redditStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err, null);
  }
});

module.exports = passport;
