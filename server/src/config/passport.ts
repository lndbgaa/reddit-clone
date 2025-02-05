import passport from "passport";
import User, { IUserDocument } from "../models/User";
import redditStrategy from "./redditStrategy";

passport.use(redditStrategy);

passport.serializeUser((user: IUserDocument, done: (err: any, userId?: string) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: IUserDocument | null) => void) => {
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
