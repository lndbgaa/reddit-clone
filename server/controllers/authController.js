const config = require("../config/environment");
const passport = require("../config/passport");
const crypto = require("crypto");

module.exports.redirectToRedditLogin = (req, res, next) => {
  req.session.state = crypto.randomBytes(32).toString("hex");

  passport.authenticate("reddit", {
    state: req.session.state,
    duration: "permanent",
    scope: ["read", "identity"],
  })(req, res, next);
};

module.exports.handleLoginCallback = (req, res, next) => {
  if (req.query.state !== req.session.state) {
    console.error("State verification failed: Possible CSRF detected.");
    return res.status(403).json({ message: "Forbidden" }); // !!!
  }

  passport.authenticate("reddit", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      console.error("Authentication failed:", info);
      return res.redirect(`${config.frontURL}?error=authFailed`);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      return res.redirect(config.frontURL);
    });
  })(req, res, next);
};
