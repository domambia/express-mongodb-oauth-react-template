import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "./../../models/user";
import { validateRequest } from "./../../middlewares/validate-request";
import { BadRequestError } from "./../../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/activate",
  [body("code").notEmpty().withMessage("Provide activation code")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code } = req.body;
    const existingUser = await User.findOne({ activationCode: code });
    if (!existingUser) {
      throw new BadRequestError("Failed. Invalid activation code!!!");
    }
    // Activate user and delete the activationCode from this
    existingUser.is_active = true;
    await existingUser.save();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account",
    });
  }
);

export { router as activiteAccount };
