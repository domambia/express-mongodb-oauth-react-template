import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";
import { PasswordManager } from "./../../utils/password";
import { Token, User, UserDoc } from "../../models";

const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("username").notEmpty().withMessage("Please provide your username"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Please provide your password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = (await User.findOne({$or: [{ email: username }, { username: username }]})) as UserDoc;
    const passwordMatch = await PasswordManager.compare(
      existingUser.password!,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Sorry. Invalid email or password");
    }
    // login the user
    const token = jwt.sign(
      {
        ...existingUser.toObject(),
        id: existingUser.id,
      },
      process.env.JWT_SECRET!
    );

    await Token.build({
      token,
    }).save();

    res.status(200).json({
      status: "success",
      message: "Welcome to Once App",
      token,
    });
  }
);

export { router as signInRouter };
