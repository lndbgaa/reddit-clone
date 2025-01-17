require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");

const config = require("./config/environment");
const connectDB = require("./config/db");
const sessionConfig = require("./config/session");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: config.frontURL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

connectDB();

app.use(cors(corsOptions));
app.use(helmet());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use("/api/auth/reddit", authRoutes);

app.all("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
    statusCode: 404,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
