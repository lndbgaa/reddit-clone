require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
