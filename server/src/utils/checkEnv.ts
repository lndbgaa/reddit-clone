const requiredVars: string[] = [
  "CLIENT_URL",
  "SERVER_URL",
  "MONGO_URI",
  "SESSION_SECRET",
  "STORE_SECRET",
  "ENCRYPTION_SECRET",
  "REDDIT_API_USER_AGENT",
  "REDDIT_API_CLIENT_ID",
  "REDDIT_API_CLIENT_SECRET",
];

export default function () {
  const missingVars: string[] = [];

  requiredVars.forEach((variable) => {
    if (!process.env[variable]) {
      missingVars.push(variable);
    }
  });

  if (missingVars.length > 0) {
    console.error(`❌ The following variables are missing: ${missingVars.join(", ")}`);
    process.exit(1);
  } else {
    console.log("✅ All required environment variables are set.");
  }
}
