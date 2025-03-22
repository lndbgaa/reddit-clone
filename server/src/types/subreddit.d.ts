import { PostType } from "@/types/post";

export type SubType = "public" | "restricted" | "private" | "archived";

export interface SubSettings {
  type: SubType;
  submission_type: PostType; // Allowed post types in subreddit
  over18: boolean;
  restrict_posting?: boolean;
  restrict_commenting?: boolean;
  allow_images?: boolean;
  allow_videos?: boolean;
  allow_videogifs?: boolean;
  allow_discovery?: boolean;
  allow_galleries?: boolean;
}

export interface SubModeration {
  user_is_banned: boolean;
  user_is_muted: boolean;
  user_is_moderator: boolean;
  user_is_contributor: boolean;
  user_is_subscriber: boolean;
}

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
  settings: SubSettings;
  moderation: SubModeration;
}
