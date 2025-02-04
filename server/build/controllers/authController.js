import config from "../config/config.js";
import passport from "../config/passport.js";
export const redirectToRedditLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect(config.clientUrl);
    }
    //const state = config.env === "production" ? crypto.randomBytes(32).toString("hex") : undefined;
    /*if (state) {
      req.session.state = state;
    }*/
    passport.authenticate("reddit", {
        //state,
        duration: "permanent",
        scope: ["read", "identity"],
    })(req, res, next);
};
export const handleLoginCallback = (req, res, next) => {
    /*if (config.env === "production" && req.query.state !== req.session.state) {
      console.error(
        `State verification failed. Query state: ${req.query.state}, Session state: ${req.session.state}`
      );
      delete req.session.state;
      return res.status(403).json({ message: "Forbidden" });
    }*/
    passport.authenticate("reddit", {
        successRedirect: config.clientUrl,
        failureRedirect: `${config.clientUrl}?error=authFailed`,
    })(req, res, next);
};
export const checkAuthStatus = (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.status(200).json({
            authenticated: true,
            username: user.name,
        });
    }
    else {
        res.status(200).json({ authenticated: false });
    }
};
export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.status(500).send("Error when logging out");
        }
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, message: "Error destroying session" });
            }
            res.clearCookie("session");
            res.status(200).json({ success: true, message: "User logged out successfully" });
        });
    });
};
//# sourceMappingURL=authController.js.map