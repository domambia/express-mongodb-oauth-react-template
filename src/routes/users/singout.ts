import express, { Request, Response } from "express";
import { Token } from "./../../models/index";
import { requireAuth } from "../../middlewares/index";

const router = express.Router();

router.post(
  "/api/users/signout",
  requireAuth,
  async (req: Request, res: Response) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    req.user = undefined;
    /* Get Token and invalidate it*/
    const availableToken = await Token.findOneAndDelete({
      token,
    });
    if (availableToken) {
      availableToken.is_active = false;
      await availableToken.save();
    }
    res.send({ message: "Sign Out successfully" });
  }
);

export { router as signOutRouter };
