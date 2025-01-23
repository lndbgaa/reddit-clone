const MongoStore = require("connect-mongo");
const config = require("./config");

module.exports = {
  store: MongoStore.create({
    mongoUrl: config.dbUri,
    ttl: 7 * 24 * 60 * 60, // 7 days
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
      secret: config.secrets.storeSecret,
    },
  }),
  name: "session",
  secret: config.secrets.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "Lax", // !!!
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};
