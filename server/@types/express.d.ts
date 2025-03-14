import { IUserDocument } from "../src/models/User.model";

declare global {
  namespace Express {
    interface User extends IUserDocument {}
  }
}
