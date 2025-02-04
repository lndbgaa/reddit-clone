import crypto from "crypto";
import mongoose from "mongoose";
import config from "../config/config.js";
const { Schema } = mongoose;
const encryptToken = (token) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(config.secrets.encryptSecret), iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};
const decryptToken = (encryptedToken) => {
    const parts = encryptedToken.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(config.secrets.encryptSecret), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
const userSchema = new Schema({
    redditId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    accessToken: {
        type: String,
        required: true,
        set: encryptToken,
    },
    accessTokenExpiration: {
        type: Number,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
        set: encryptToken,
    },
});
userSchema.methods.decryptAccessToken = function () {
    return decryptToken(this.accessToken);
};
userSchema.methods.decryptRefreshToken = function () {
    return decryptToken(this.refreshToken);
};
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=User.js.map