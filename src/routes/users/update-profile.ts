import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "./../../middlewares/validate-request";
import { requireAuth } from "./../../middlewares/require-auth";
import { User, UserDoc } from "./../../models/user";

const router = express.Router();

router.patch(
  "/api/users/update-profile",
  [
    body("email").isEmail().withMessage("Please provide your email address"),
    body("username").isEmail().withMessage("Please provide your username"),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, photo, username,  } = req.body;
    const existingUser = (await User.findById(req.user?.id)) as UserDoc;
    if (photo) {
      //save image
    }
    existingUser.email = email;
    existingUser.username = username;
    existingUser.photo = photo;
    await existingUser.save();
    res.send({
      status: "success",
      user: existingUser,
    });
  }
);

export { router as updateProfile };
