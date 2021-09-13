import express from "express";
const router = express.Router();
import { User } from "./../../models/user";
import { requireAuth } from "../../middlewares/require-auth";

router.get("/api/users/currentuser", requireAuth, async (req, res) => {
  const user = await User.findById(req.user?.id);
  res.status(200).json({
    status: "sucess",
    user,
  });
});

export { router as currentUserRouter };
