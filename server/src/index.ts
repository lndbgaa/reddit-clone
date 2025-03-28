import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

import config from "@/config/app.config.js";
import sessionConfig from "@/config/session.config.js";
import connectDB from "@/database/mongo.database.js";
import errorHandler from "@/middleware/errorHandler.middleware.js";
import authRoutes from "@/routes/auth.routes.js";
import commentsRoutes from "@/routes/comments.routes.js";
import contentRoutes from "@/routes/content.routes.js";
import postsRoutes from "@/routes/posts.routes.js";
import subredditsRoutes from "@/routes/subreddits.routes.js";
import usersRoutes from "@/routes/users.routes.js";
import AppError from "@/utils/AppError.js";
import checkEnv from "@/utils/checkEnv.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";

checkEnv();

const app = express();
const PORT = config.port;

connectDB();

const csrfProtection = csrf(config.csrfOptions);

app.use(cors(config.corsOptions));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf(config.csrfOptions));

app.get("/", (req, res) => {
  res.json({ status: "Server is up and running!" });
});

app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/v1/auth/reddit", authRoutes);
app.use("/api/v1/reddit", contentRoutes);
app.use("/api/v1/reddit/subreddits", subredditsRoutes);
app.use("/api/v1/reddit/posts", postsRoutes);
app.use("/api/v1/reddit/comments", commentsRoutes);
app.use("/api/v1/reddit/users", usersRoutes);

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
