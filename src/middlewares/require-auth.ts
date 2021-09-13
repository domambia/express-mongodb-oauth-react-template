import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "./../errors/not-authorized-error";
import { Token } from "./../models/index";
import { UserPayload } from "./../utils/interface";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  const availableToken = await Token.findOne({
    token,
  });

  if (!token) {
    throw new NotAuthorizedError();
  }
  if (!availableToken) {
    throw new NotAuthorizedError();
  }
  /* Check if token has been invalidated*/
  if (!availableToken.is_active) {
    throw new NotAuthorizedError();
  }
  /*Verify Token*/

  try {
    const payload: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserPayload;

    if (!payload.id || payload.id === "") {
      throw new NotAuthorizedError();
    }
    req.user = payload;
  } catch (err) {}

  next();
};
