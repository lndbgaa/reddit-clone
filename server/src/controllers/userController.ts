import AppError from "@utils/AppError.js";
import { NextFunction, Request, Response } from "express";

export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json({
      username: req.user.name,
      link_karma: req.user.link_karma,
      comment_karma: req.user.comment_karma,
    });
  } else {
    next(
      new AppError({
        statusCode: 401,
        statusText: "Unauthorized",
        context: "UserInfo retrieval",
        message: "No user is logged in.",
      })
    );
  }
};
