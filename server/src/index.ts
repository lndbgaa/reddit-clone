import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";

import config from "@/config/config.js";
import { connectDB } from "@/config/db.js";
import sessionConfig from "@/config/session.js";

import AppError from "@/utils/AppError.js";

import errorHandler from "@/middleware/errorHandler.js";

import authRoutes from "@/routes/authRoutes.js";
import postsRoutes from "@/routes/postsRoutes.js";
import subredditsRoutes from "@/routes/subredditsRoutes.js";
import userRoutes from "@/routes/userRoutes.js";

import { CorsOptions } from "cors";

const app = express();
const PORT = (process.env.PORT || 8080) as number;

const corsOptions: CorsOptions = {
  origin: config.clientUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const csrfProtection = csrf({ cookie: true });

connectDB();

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ status: "Server is up and running" });
});

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/v1/auth/reddit", authRoutes);
app.use("/api/v1/reddit/subreddits", subredditsRoutes);
app.use("/api/v1/reddit/posts", postsRoutes);
app.use("/api/v1/reddit/user", userRoutes);

app.use((req, res, next) => {
  next(
    new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "The requested resource could not be found.",
      details: {
        path: req.originalUrl,
        method: req.method,
      },
    })
  );
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
