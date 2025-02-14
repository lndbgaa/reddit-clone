import redditStrategy from "@/config/redditStrategy.config.js";
import User, { IUserDocument } from "@/models/User.model.js";
import passport from "passport";

passport.use(redditStrategy);

passport.serializeUser((user: IUserDocument, done: (err: unknown, userId?: string) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: (err: unknown, user?: IUserDocument | null) => void) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err, null);
  }
});

export default passport;
