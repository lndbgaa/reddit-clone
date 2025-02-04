import passportReddit from "passport-reddit";
import User, { IUserDocument } from "../models/User.js";
import AppError from "../utils/AppError.js";
import config from "./config.js";

const RedditStrategy = passportReddit.Strategy;

interface RedditProfile {
  id: string;
  name: string;
}

export default new RedditStrategy(
  {
    clientID: config.redditApi.clientId,
    clientSecret: config.redditApi.clientSecret,
    callbackURL: config.redditApi.callbackUrl,
  },
  async function (
    accessToken: string,
    refreshToken: string,
    expires_in: { expires_in: number },
    profile: RedditProfile,
    done: (err: any, user?: IUserDocument | null) => void
  ) {
    try {
      if (!accessToken || !refreshToken || !expires_in) {
        return done(
          new AppError({
            statusCode: 401,
            statusText: "Unauthorized",
            message: "Missing or invalid tokens returned by Reddit.",
          }),
          null
        );
      }

      if (!profile || !profile.id || !profile.name) {
        return done(
          new AppError({
            statusCode: 401,
            statusText: "Unauthorized",
            message: "Missing or invalid profile information returned by Reddit.",
          }),
          null
        );
      }

      const expiresIn = expires_in.expires_in; // wtf Reddit?

      const user = await User.findOne({ redditId: profile.id });

      if (!user) {
        const newUser = await createUser(profile, accessToken, refreshToken, expiresIn);
        return done(null, newUser);
      }

      await updateUser(user, accessToken, refreshToken, expiresIn);
      done(null, user);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        err.context = "Reddit authentication strategy";
        done(err, null);
      } else {
        done(new Error("Unknown error occurred"), null);
      }
    }
  }
);

async function createUser(
  profile: RedditProfile,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  const newUser = new User({
    redditId: profile.id,
    name: profile.name,
    accessToken,
    accessTokenExpiration: Date.now() + expiresIn * 1000, // milliseconds
    refreshToken,
  });

  await newUser.save();
  return newUser;
}

async function updateUser(user: IUserDocument, accessToken: string, refreshToken: string, expiresIn: number) {
  let updated = false;

  if (user.accessTokenExpiration <= Date.now() || user.refreshToken !== refreshToken) {
    user.accessToken = accessToken;
    user.accessTokenExpiration = Date.now() + expiresIn * 1000;
    user.refreshToken = refreshToken;
    updated = true;
  }

  if (updated) {
    await user.save();
  }
}
