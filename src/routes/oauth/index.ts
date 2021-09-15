import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "./../../models/user";
import passport from "passport";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";

const router = Router();

router.get("/api/oauth/logout", (req: Request, res: Response) => {
  // logout the user
  res.status(200).json({
    message: "Successfully logout with your account",
    status: "success",
  });
});

//First entry to the handle the google OAuth

router.get(
  "/api/oauth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// Handle Redirect of user after successfully authentication

router.get(
  "/api/oauth/google/redirect",
  passport.authenticate("google"),
  (req: Request, res: Response) => {
    const message = `Welcome ${req.user} You have logged in successfully, `;
    res.send(message);
  }
);

export { router as OAuthPassportRoutes };
