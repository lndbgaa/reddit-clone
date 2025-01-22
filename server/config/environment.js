const env = process.env.NODE_ENV || "development";
const backURL =
  env !== "production"
    ? `http://localhost:${process.env.PORT || 8080}`
    : process.env.SERVER_URL;

const config = {
  development: {
    env: "development",
    frontURL: "http://localhost:5173",
    backURL,
    dbUri: process.env.MONGO_URI,
    secret: process.env.SECRET || "mySecret",
    redditAPI: {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      userAgent: process.env.USER_AGENT,
      callbackURL: `${backURL}/api/auth/reddit/callback`,
      baseUrl: "https://www.reddit.com/api/v1",
    },
  },
  production: {
    env: "production",
    frontUrl: "",
    backURL,
    dbUri: process.env.MONGO_URI,
    secret: process.env.SECRET,
    redditAPI: {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      userAgent: process.env.USER_AGENT,
      callbackURL: `${backURL}/api/auth/reddit/callback`,
      baseUrl: "https://www.reddit.com/api/v1",
    },
  },
  test: {
    env: "test",
    frontUrl: "",
    backURL,
    dbUri: process.env.MONGO_URI,
    secret: process.env.SECRET || "mySecret",
    redditAPI: {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      userAgent: process.env.USER_AGENT,
      callbackURL: `${backURL}/api/auth/reddit/callback`,
      baseUrl: "https://www.reddit.com/api/v1",
    },
  },
};

module.exports = config[env];
