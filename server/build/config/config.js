import dotenvSafe from "dotenv-safe";
dotenvSafe.config();
const config = {
    env: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,
    dbUri: process.env.MONGODB_URI,
    secrets: {
        sessionSecret: process.env.SESSION_SECRET,
        storeSecret: process.env.STORE_SECRET,
        encryptSecret: process.env.ENCRYPTION_SECRET,
    },
    redditApi: {
        clientId: process.env.REDDIT_API_CLIENT_ID,
        clientSecret: process.env.REDDIT_API_CLIENT_SECRET,
        userAgent: process.env.REDDIT_API_USER_AGENT,
        callbackUrl: `${process.env.SERVER_URL}/api/auth/reddit/callback`,
        baseUrl: "https://www.reddit.com/api/v1",
    },
};
export default config;
//# sourceMappingURL=config.js.map