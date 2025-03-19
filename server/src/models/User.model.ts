import AppError from "@/utils/AppError.js";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface UserDocument extends Document {
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

const encryptSecret = process.env.ENCRYPTION_SECRET as string;

const encryptToken = (token: string): string => {
  if (Buffer.from(encryptSecret).length !== 32) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Encryption secret must be 32 bytes for AES-256-GCM.",
    });
  }

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(encryptSecret), iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return iv.toString("hex") + ":" + encrypted + ":" + tag;
  } catch (err) {
    throw new AppError({
      message: "Failed to encrypt token.",
    });
  }
};

const decryptToken = (encryptedToken: string): string => {
  try {
    const parts = encryptedToken.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const tag = Buffer.from(parts[2], "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(encryptSecret), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Failed to decrypt token: data may be corrupted.",
    });
  }
};

const userSchema = new Schema<UserDocument>({
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

userSchema.methods.decryptAccessToken = function (): string {
  return decryptToken(this.access_token);
};

userSchema.methods.decryptRefreshToken = function (): string {
  return decryptToken(this.refresh_token);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
