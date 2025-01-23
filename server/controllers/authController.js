const config = require("../config/config");
const passport = require("../config/passport");
const crypto = require("crypto");

module.exports.redirectToRedditLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(config.clientUrl);
  }

  const state = config.env === "production" ? crypto.randomBytes(32).toString("hex") : undefined;

  if (state) {
    req.session.state = state;
  }

  passport.authenticate("reddit", {
    state,
    duration: "permanent",
    scope: ["read", "identity"],
  })(req, res, next);
};

module.exports.handleLoginCallback = (req, res, next) => {
  if (config.env === "production" && req.query.state !== req.session.state) {
    console.error(
      `State verification failed. Query state: ${req.query.state}, Session state: ${req.session.state}`
    );
    delete req.session.state;
    return res.status(403).json({ message: "Forbidden" });
  }

  passport.authenticate("reddit", {
    successRedirect: config.clientUrl,
    failureRedirect: `${config.clientUrl}?error=authFailed`,
  })(req, res, next);
};

module.exports.checkAuthStatus = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      username: req.user.name,
    });
  } else {
    res.json({ authenticated: false });
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error when logging out");
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error destroying session:", err);
      }

      res.clearCookie("session");
      return res.status(200).json({ success: true, message: "User logged out successfully" });
    });
  });
};
