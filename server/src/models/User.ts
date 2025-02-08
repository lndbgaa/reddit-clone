import config from "@config/config.js";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IUserDocument extends Document {
  _id: string;
  reddit_id: string;
  name: string;
  link_karma: number;
  comment_karma: number;
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;

  decryptAccessToken: () => string;
  decryptRefreshToken: () => string;
}

const encryptToken = (token: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(config.secrets.encryptSecret), iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

const decryptToken = (encryptedToken: string) => {
  const parts = encryptedToken.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(config.secrets.encryptSecret), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const userSchema = new Schema<IUserDocument>({
  reddit_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  link_karma: {
    type: Number,
  },
  comment_karma: {
    type: Number,
  },
  access_token: {
    type: String,
    required: true,
    set: encryptToken,
  },
  access_token_expiration: {
    type: Number,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
    set: encryptToken,
  },
});

userSchema.methods.decryptAccessToken = function () {
  return decryptToken(this.access_token);
};

userSchema.methods.decryptRefreshToken = function () {
  return decryptToken(this.refresh_token);
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
