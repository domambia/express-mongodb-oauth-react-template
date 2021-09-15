import { VerifyCallback } from "jsonwebtoken";
import passport, { Profile } from "passport";
import { Strategy } from "passport-google-oauth20";
import { configs } from "./../../config";
import { User, UserDoc } from "./../models/index";

// Serializer

passport.serializeUser((user: any, done: VerifyCallback) => {
  done(null, user?.toObject());
});

passport.deserializeUser(async (done: VerifyCallback, id: any) => {
  const user = await User.findById(id);
  done(null, user?.toObject());
});

passport.use(
  new Strategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: configs.passport.google.clientID,
      clientSecret: configs.passport.google.clientSecret,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      console.log("Processing data from google");

      let user: UserDoc | null = await User.findOne({
        googleID: profile.id,
      });

      let email: any;
      let photo: any;

      email = profile.emails?.pop()?.value;
      photo = profile.photos?.pop()?.value;

      if (!user) {
        user = new User({
          username: profile.displayName,
          email: email,
          googleID: profile.id,
          photo: photo,
        });
      } else {
        console.log("User Exists");
      }

      done(null, user);
    }
  )
);
