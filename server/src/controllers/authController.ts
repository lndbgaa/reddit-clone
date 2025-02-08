import config from "@config/config.js";
import passport from "@config/passport.js";
import sessionConfig from "@config/session";
import { IUserDocument } from "@models/User.js";
import AppError from "@utils/AppError";
import { NextFunction, Request, Response } from "express";
import { AuthenticateOptions } from "passport";

interface RedditAuthenticateOptions extends AuthenticateOptions {
  //state: string;
  duration?: "temporary" | "permanent";
}

export const redirectToRedditLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect(config.clientUrl);
  }

  //const state = config.env === "production" ? crypto.randomBytes(32).toString("hex") : undefined;

  /*if (state) {
    req.session.state = state;
  }*/

  return passport.authenticate("reddit", {
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

  return passport.authenticate("reddit", {
    successRedirect: config.clientUrl,
    failureRedirect: `${config.clientUrl}?message=authFailed`, // !!!
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
  }

  req.logout((err: unknown) => {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return next(err);
      }

      res.clearCookie(sessionConfig.name || "connect.sid");
      return res.redirect(config.clientUrl); // !!!
    });
  });
};
