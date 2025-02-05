import { IUserDocument } from "../src/models/User";

declare module "passport-reddit" {
  export interface RedditProfile {
    id: string;
    name: string;
  }

  interface RedditStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    state?: boolean;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    expires_in: { expires_in: number },
    profile: RedditProfile,
    done: (error: any, user?: IUserDocument | null) => void
  ) => void;

  export class Strategy {
    constructor(options: RedditStrategyOptions, verify: VerifyFunction);
    authenticate(req: express.Request, options?: any): void;
  }
}
