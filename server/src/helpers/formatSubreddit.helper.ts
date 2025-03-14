import { Subreddit } from "@/types/Subreddit.type.js";

export interface ApiSubredditData {
  id: string;
  display_name: string;
  title: string;
  created: number;
  lang: string;
  public_description: string;
  icon_img: string;
  banner_img: string;
  primary_color: string;
  subscribers: number;
  subreddit_type: "public" | "restricted" | "private" | "archived";
  submission_type: "any" | "link" | "self";
  over18: boolean;
  restrict_posting: boolean;
  restrict_commenting: boolean;
  allow_images: boolean;
  allow_galleries: boolean;
  allow_videos: boolean;
  allow_videogifs: boolean;
  allow_discovery: boolean;
  user_is_banned: boolean;
  user_is_muted: boolean;
  user_is_moderator: boolean;
  user_is_contributor: boolean;
  user_is_subscriber: boolean;
}

// Function that extracts and reformats specific data from an object of type ApiSubredditData (data sent by the API)
// into an object of type Subreddit, mapping relevant properties for the application.

export default (subreddit: ApiSubredditData): Subreddit => {
  const {
    id,
    display_name: name,
    title,
    created,
    lang,
    public_description: description,
    icon_img: icon,
    banner_img: banner,
    primary_color: color,
    subscribers,
    subreddit_type: type,
    submission_type,
    over18,
    restrict_posting,
    restrict_commenting,
    allow_images,
    allow_galleries,
    allow_videos,
    allow_videogifs,
    allow_discovery,
    user_is_banned,
    user_is_muted,
    user_is_moderator,
    user_is_contributor,
    user_is_subscriber,
  } = subreddit;

  return {
    id,
    name,
    title,
    created,
    lang,
    description: description || "",
    appearance: {
      icon: icon || "", // !!!
      banner: banner || "", // !!!
      color: color || "",
    },
    stats: {
      subscribers,
    },
    settings: {
      type,
      submission_type,
      over18,
      restrict_posting,
      restrict_commenting,
      allow_images,
      allow_galleries,
      allow_videos,
      allow_videogifs,
      allow_discovery,
    },
    moderation: {
      user_is_banned,
      user_is_muted,
      user_is_moderator,
      user_is_contributor,
      user_is_subscriber,
    },
  };
};
