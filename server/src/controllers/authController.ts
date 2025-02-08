import config from "@config/config.js";
import passport from "@config/passport.js";
import sessionConfig from "@config/session.js";
import AppError from "@utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import { AuthenticateOptions } from "passport";

interface RedditAuthenticateOptions extends AuthenticateOptions {
  //state: string;
  duration?: "temporary" | "permanent";
}

export const redirectToRedditLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect(config.clientUrl); // !!!
  }

  //req.session.state = crypto.randomBytes(32).toString("hex");

  return passport.authenticate("reddit", {
    //state: req.session.state,
    duration: "permanent",
    scope: ["read", "identity"],
  } as RedditAuthenticateOptions)(req, res, next);
};

export const handleLoginCallback = (req: Request, res: Response, next: NextFunction) => {
  /*if (!req.session.state || req.query.state !== req.session.state) {
    delete req.session.state;
    return next(
      new AppError({
        statusCode: 403,
        statusText: "Forbidden",
        context: "Logging in to Reddit",
        message: "State verification failed",
        details: {
          "query state": req.query.state,
          "session state": req.session.state || "undefined",
        },
      })
    );
  } 

  passport.authenticate("reddit", (err: any, user: any, info: any) => {
    if (err) {
      console.log("Authentication error with Reddit: ", err);
    }

    if (!user) {
      console.log("Authentication failed: ", info);
      return res.redirect(`${config.clientUrl}?message=authFailed`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.log("Error logging in the user: ", loginErr);
      }

      console.log("Authentication successful, redirecting to the client.");
      return res.redirect(config.clientUrl);
    });
  })(req, res, next); */

  passport.authenticate("reddit", {
    successRedirect: config.clientUrl, // !!!
    failureRedirect: `${config.clientUrl}?message=authFailed`, // !!!
  } as RedditAuthenticateOptions)(req, res, next);
};

export const checkAuthStatus = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json({
      authenticated: true,
      username: req.user.name,
    });
  } else {
    res.status(200).json({ authenticated: false });
  }
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return next(
      new AppError({
        statusCode: 401,
        statusText: "Unauthorized",
        context: "Logging out",
        message: "No user is logged in.",
      })
    );
  } else {
    req.logout((err: unknown) => {
      if (err) {
        console.error("Error logging out:", err);
        next(err);
        return;
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          next(err);
          return;
        }

        res.clearCookie(sessionConfig.name || "connect.sid");
        res.redirect(config.clientUrl); // !!!
      });
    });
  }
};
