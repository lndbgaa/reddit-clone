module.exports = {
  env: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL,
  serverUrl: process.env.SERVER_URL,
  dbUri: process.env.MONGODB_URI,
  secrets: {
    sessionSecret: process.env.SESSION_SECRET || "mySessionSecret",
    storeSecret: process.env.STORE_SECRET || "myStoreSecret",
    encryptSecret: process.env.ENCRYPTION_SECRET || "myEncryptionSecret",
  },
  redditApi: {
    clientID: process.env.REDDIT_API_CLIENT_ID,
    clientSecret: process.env.REDDIT_API_CLIENT_SECRET,
    userAgent: process.env.REDDIT_API_USER_AGENT,
    callbackURL: `${process.env.SERVER_URL}/api/auth/reddit/callback`,
    baseUrl: "https://www.reddit.com/api/v1",
  },
};
