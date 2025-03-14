import { IUserDocument } from "@models/User.js";

declare module "passport-reddit" {
  export interface IRedditProfile {
    id: string;
    name: string;
    link_karma: number;
    comment_karma: number;
  }

  interface IRedditStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    state?: boolean;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    expires_in: { expires_in: number },
    profile: IRedditProfile,
    done: (error: any, user?: IUserDocument | null) => void
  ) => void;

  export class Strategy {
    constructor(options: IRedditStrategyOptions, verify: VerifyFunction);
    authenticate(req: express.Request, options?: any): void;
  }
}
