import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

import config from "@/config/app.config.js";
import mongoConfig from "@/config/mongo.config.js";
import MongoStore from "connect-mongo";
import { SessionOptions } from "express-session";

const sessionConfig: SessionOptions = {
  name: "session",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoConfig.uri,
    mongoOptions: mongoConfig.options,
    ttl: 7 * 24 * 60 * 60, // 7 days
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
      secret: process.env.STORE_SECRET as string,
    },
  }),
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

export default sessionConfig;
