import { NextFunction, Request, Response } from "express";

export default (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response> | Promise<void>
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((e: unknown) => next(e));
  };
};
