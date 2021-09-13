import { app } from "../app";
/** Start Of User Routes */
import {
  signInRouter,
  signUpRouter,
  signOutRouter,
  currentUserRouter,
  activiteAccount,
  updateProfile,
  restPassword,
  requestPasswordRest,
} from "./users/index";
app.use([
  signInRouter,
  signUpRouter,
  signOutRouter,
  currentUserRouter,
  activiteAccount,
  updateProfile,
  requestPasswordRest,
  restPassword,
]);
