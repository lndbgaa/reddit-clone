import { IUserDocument } from "../src/models/User";

declare global {
  namespace Express {
    interface User extends IUserDocument {}
  }
}
