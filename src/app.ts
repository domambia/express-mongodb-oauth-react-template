import express from "express";
import morgan from "morgan";
import passport from "passport";
import cookieSession from "cookie-session";
import { configs } from "./../config";
import "express-async-errors";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

// read the content of the .env file
app.use(express.json());

// passport middleware
import "./utils/passport-config";

// configure session
app.use(
  cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: [configs.jwt.secret] })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

/**
 * LOGGER IN Development ENV
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * ROUTES
 */
import "./routes/index";

/**API DOCUMENTATION */
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
