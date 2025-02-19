import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

import config from "@/config/app.config.js";

interface RedditConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  userAgent: string;
  baseUrl: string;
  scopes: string[];
}

const redditConfig: RedditConfig = {
  clientID: process.env.REDDIT_API_CLIENT_ID as string,
  clientSecret: process.env.REDDIT_API_CLIENT_SECRET as string,
  callbackURL: `${config.serverUrl}/api/v1/auth/reddit/callback` as string,
  userAgent: process.env.REDDIT_API_USER_AGENT as string,
  baseUrl: "https://oauth.reddit.com",
  scopes: ["read", "identity", "vote", "save", "subscribe", "submit", "edit"],
};

export default redditConfig;
