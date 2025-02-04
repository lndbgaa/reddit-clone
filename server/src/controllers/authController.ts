import { NextFunction, Request, Response } from "express";
import { AuthenticateOptions } from "passport";
import config from "../config/config.js";
import passport from "../config/passport.js";
import { IUserDocument } from "../models/User.js";

interface RedditAuthenticateOptions extends AuthenticateOptions {
  //state: string;
  duration?: "temporary" | "permanent";
}

export const redirectToRedditLogin = (req: Request, res: Response, next: NextFunction) => {
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
  } as RedditAuthenticateOptions)(req, res, next);
};

export const handleLoginCallback = (req: Request, res: Response, next: NextFunction) => {
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
  } as RedditAuthenticateOptions)(req, res, next);
};

export const checkAuthStatus = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUserDocument;
    res.status(200).json({
      authenticated: true,
      username: user.name,
    });
  } else {
    res.status(200).json({ authenticated: false });
  }
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: any) => {
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
