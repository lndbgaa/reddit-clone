import { CorsOptions } from "cors";

interface Config {
  env: string;
  port: number;
  corsOptions: CorsOptions;
  clientUrl: string;
  serverUrl: string;
}

const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

const config: Config = {
  env: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  corsOptions: {
    origin: clientUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  clientUrl,
  serverUrl: process.env.SERVER_URL ?? "http://localhost:8080",
};

export default config;
