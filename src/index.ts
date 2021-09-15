import dotenv from "dotenv";
import mongoose from "mongoose";
import { configs } from "./../config";

import { app } from "./app";

const start = async () => {
  if (
    !configs.jwt.secret &&
    !configs.appName &&
    !configs.port &&
    !configs.db.mongoDb
  ) {
    throw new Error(
      "Some required configurations is not provided. Please create config.ts folder in the project root directory and copy the contents of config.ts.example and replace with your information"
    );
  }

  /** GET ENV VARIABLES */
  const DB_URL = configs.db.mongoDb!;
  const PORT = configs.port! || 4000;
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
