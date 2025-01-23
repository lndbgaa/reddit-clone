require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const config = require("./config/config");
const connectDB = require("./config/db");
const sessionConfig = require("./config/session");

const AppError = require("./utils/AppError");

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
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

app.use("/api/auth/reddit", authRoutes);

app.use((req, res, next) => {
  next(
    new AppError({
      statusCode: 404,
      statusText: "Not Found",
      context: "Resource access attempt",
      message: "The requested resource could not be found.",
      details: {
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    })
  );
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
