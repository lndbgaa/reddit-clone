const { Strategy: RedditStrategy } = require("passport-reddit");
const User = require("./../models/User");
const config = require("./environment");

module.exports = new RedditStrategy(
  {
    clientID: config.redditAPI.clientID,
    clientSecret: config.redditAPI.clientSecret,
    callbackURL: config.redditAPI.callbackURL,
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      if (!profile.id) {
        return done(new Error("No profile ID received from Reddit"), null);
      }

      const user = await User.findOne({ redditID: profile.id });

      if (!user) {
        const newUser = new User({
          redditID: profile.id,
          name: profile,
          accessToken,
          refreshToken,
        });

        await newUser.save();

        done(null, newUser);
      } else {
        done(null, user);
      }
    } catch (err) {
      console.error("Error in strategy:", err);
      done(err, null);
    }
  }
);
