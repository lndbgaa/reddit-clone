import dotenv from "dotenv";

export default function () {
  const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
  dotenv.config({ path: envFile });
}
