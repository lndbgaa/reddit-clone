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
    submission_type: "any" | "link" | "self";
    over18: boolean;
    restrict_posting: boolean;
    restrict_commenting: boolean;
    allow_images: boolean;
    allow_videos: boolean;
    allow_videogifs: boolean;
    allow_discovery: boolean;
    allow_galleries: boolean;
  };
  moderation: {
    user_is_banned: boolean;
    user_is_muted: boolean;
    user_is_moderator: boolean;
    user_is_contributor: boolean;
    user_is_subscriber: boolean;
  };
}
