export interface Subreddit {
  id: string;
  name: string;
  title: string;
  created: number;
  lang: string;
  description: string;
  appearance: {
    icon: string;
    banner: string;
    color: string;
  };
  stats: {
    subscribers: number;
  };
  settings: {
    type: "public" | "restricted" | "private" | "archived";
    over18: boolean;
    restrict_posting: boolean;
    restrict_commenting: boolean;
    allow_images: boolean;
    allow_galleries: boolean;
    allow_videos: boolean;
    allow_videogifs: boolean;
    allow_polls: boolean;
    allow_talks: boolean;
    allow_predictions: boolean;
    allow_discovery: boolean;
    submission_type: "any" | "link" | "self";
  };
  moderation: {
    user_is_banned: boolean;
    user_is_muted: boolean;
  };
}
