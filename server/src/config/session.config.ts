import config from "@/config/app.config.js";
import MongoStore from "connect-mongo";
import { SessionOptions } from "express-session";

const sessionConfig: SessionOptions = {
  name: "session",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 7 * 24 * 60 * 60, // 7 days
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
      secret: process.env.STORE_SECRET as string,
    },
  }),
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

export default sessionConfig;
