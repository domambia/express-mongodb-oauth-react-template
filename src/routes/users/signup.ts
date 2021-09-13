import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";
import { User } from "./../../models/user";
import { randomCode } from "./../../utils/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("username").notEmpty().withMessage("Please provide your username"),
    body("email").isEmail().withMessage("Please provide your email address"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Please provide your password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { email, username, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username: username }],
    });

    if (existingUser) {
      throw new BadRequestError(
        "User with the already provided credentials exists"
      );
    }

    // const activateCode = randomCode();
    const user = User.build({
      email,
      username,
      password,
    });

    await user.save();
    res.status(201).json({
      user,
      status: "success",
      message: "Successfully created your account",
    });
  }
);

export { router as signUpRouter };
