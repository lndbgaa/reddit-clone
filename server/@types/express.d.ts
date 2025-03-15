import { UserDocument } from "@/models/User.model.js";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
