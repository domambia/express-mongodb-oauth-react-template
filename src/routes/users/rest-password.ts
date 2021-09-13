import express, { Response, Request } from "express";
import { User } from "./../../models/user";
import { body } from "express-validator";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";
import { PasswordManager } from "./../../utils/password";

const router = express.Router();

router.post(
  "/api/users/rest-password",
  [
    body("code")
      .trim()
      .isLength({ min: 6, max: 6 })
      .notEmpty()
      .withMessage("Must provide sms token"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Must provide password"),
    body("password_confirm")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Please confirm your password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, password, password_confirm } = req.body;
    if (password !== password_confirm) {
      throw new BadRequestError(
        "Password and Password Confirm must be the same"
      );
    }
    const existingUser = await User.findOne({ password_change_token: code });
    if (!existingUser) {
      throw new BadRequestError("User does not exists!!");
    }
    existingUser.password = password;
    await existingUser.save();

    res.send({
      status: "success",
      message: "Successfully changed your password",
    });
  }
);

export { router as restPassword };
