import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

const config = {
  env: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL as string,
  serverUrl: process.env.SERVER_URL as string,
  dbUri: process.env.MONGODB_URI as string,
  secrets: {
    sessionSecret: process.env.SESSION_SECRET as string,
    storeSecret: process.env.STORE_SECRET as string,
    encryptSecret: process.env.ENCRYPTION_SECRET as string,
  },
  redditApi: {
    clientId: process.env.REDDIT_API_CLIENT_ID as string,
    clientSecret: process.env.REDDIT_API_CLIENT_SECRET as string,
    userAgent: process.env.REDDIT_API_USER_AGENT as string,
    callbackUrl: `${process.env.SERVER_URL}/api/auth/reddit/callback`,
    baseUrl: "https://oauth.reddit.com",
  },
};

export default config;
