const MongoStore = require("connect-mongo");
const config = require("../config/environment");

module.exports = {
  store: MongoStore.create({
    mongoUrl: config.dbUri,
    ttl: 7 * 24 * 60 * 60, // 7 days
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
      secret: config.secret,
    },
  }),
  name: "session",
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};
