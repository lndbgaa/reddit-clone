import config from "@config/config.js";
import User, { IUserDocument } from "@models/User.js";
import AppError from "@utils/AppError.js";
import { IRedditProfile, Strategy } from "passport-reddit";

export default new Strategy(
  {
    clientID: config.redditApi.clientId,
    clientSecret: config.redditApi.clientSecret,
    callbackURL: config.redditApi.callbackUrl,
  },
  async function (accessToken, refreshToken, expires_in, profile, done) {
    try {
      if (!accessToken || !refreshToken || !expires_in) {
        return done(
          new AppError({
            statusCode: 401,
            statusText: "Unauthorized",
            context: "Reddit auth strategy",
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
            context: "Reddit auth strategy",
            message: "Missing or invalid profile information returned by Reddit.",
          }),
          null
        );
      }

      const expiresIn = expires_in.expires_in; // wtf Reddit?

      const user = await User.findOne({ reddit_id: profile.id });

      if (!user) {
        const newUser = await createUser(profile, accessToken, refreshToken, expiresIn);
        return done(null, newUser);
      }

      await updateUser(user, profile, accessToken, refreshToken, expiresIn);
      return done(null, user);
    } catch (err: unknown) {
      return done(new Error("Unknown error occurred"), null); // !!!
    }
  }
);

async function createUser(
  profile: IRedditProfile,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  const newUser = new User({
    reddit_id: profile.id,
    name: profile.name,
    link_karma: profile.link_karma,
    comment_karma: profile.comment_karma,
    access_token: accessToken,
    access_token_expiration: Date.now() + expiresIn * 1000, // milliseconds
    refresh_token: refreshToken,
  });

  await newUser.save();
  return newUser;
}

async function updateUser(
  user: IUserDocument,
  profile: IRedditProfile,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  let updated = false;

  if (user.link_karma !== profile.link_karma) {
    user.link_karma = profile.link_karma;
    updated = true;
  }

  if (user.comment_karma !== profile.comment_karma) {
    user.comment_karma = profile.comment_karma;
    updated = true;
  }

  if (user.access_token_expiration <= Date.now() || user.refresh_token !== refreshToken) {
    user.access_token = accessToken;
    user.access_token_expiration = Date.now() + expiresIn * 1000;
    user.refresh_token = refreshToken;
    updated = true;
  }

  if (updated) {
    await user.save();
  }
}
