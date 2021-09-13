import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });

import { app } from "./app";

const start = async () => {
  if (
    !process.env.JWT_SECRET &&
    !process.env.AT_SECRET &&
    !process.env.AT_USERNAME &&
    !process.env.APP_NAME &&
    !process.env.PORT &&
    !process.env.DB_URL
  ) {
    throw new Error(
      "APP_NAME && JWT_SECRET && AT_USERNAME && AT_SECRET && PORT $$ DB_URL  Must be defined in your .env FILE"
    );
  }

  /** GET ENV VARIABLES */
  const DB_URL = process.env.DB_URL!;
  const PORT = process.env.PORT! || 4000;
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Auth Running on port ${PORT}`);
  });
};

start();
