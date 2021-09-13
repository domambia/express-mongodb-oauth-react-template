import express, { Response, Request } from "express";
import { User } from "./../../models/user";
import { body } from "express-validator";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";
import { randomCode } from "./../../utils/common";
const router = express.Router();

router.post(
  "/api/users/request-password-rest",
  [body("email").trim().isEmail().withMessage("Must be a valid email address")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("User does not exists!!");
    }
    const token = randomCode();

    await existingUser.save();

    res.send({
      status: "success",
      message:
        "Please check you phone to get the code to use to reset your password",
    });
  }
);

export { router as requestPasswordRest };
