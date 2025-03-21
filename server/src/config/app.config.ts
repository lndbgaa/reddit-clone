import { CorsOptions } from "cors";
import { CookieOptions } from "csurf";

interface Config {
  env: string;
  port: number;
  corsOptions: CorsOptions;
  csrfOptions: { cookie: CookieOptions };
  clientUrl: string;
  serverUrl: string;
  cspOptions: any;
}

const env = process.env.NODE_ENV ?? "development";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
const serverUrl = process.env.SERVER_URL ?? "http://localhost:8080";

const config: Config = {
  env,
  port,
  clientUrl,
  serverUrl,
  corsOptions: {
    origin: clientUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "Accept"],
    credentials: true,
  },
  csrfOptions: {
    cookie: {
      httpOnly: true,
      secure: env === "production",
      sameSite: env === "production" ? "none" : "lax",
      maxAge: 3600000, // FIXME 1h ? too short? too long?
    },
  },
  cspOptions: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
    },
  },
};

export default config;
