import MongoStore from "connect-mongo";
import { SessionOptions } from "express-session";
import config from "./config";

const sessionConfig: SessionOptions = {
  name: "session",
  store: MongoStore.create({
    mongoUrl: config.dbUri,
    ttl: 7 * 24 * 60 * 60, // 7 days
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
      secret: config.secrets.storeSecret,
    },
  }),
  secret: config.secrets.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

export default sessionConfig;
