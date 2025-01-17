const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  redditID: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
