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
  user_is_banned: boolean;
  user_is_muted: boolean;
}

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
    over18,
    restrict_posting,
    restrict_commenting,
    allow_images,
    allow_galleries,
    allow_videos,
    allow_videogifs,
    allow_polls,
    allow_talks,
    allow_predictions,
    allow_discovery,
    submission_type,
    user_is_banned,
    user_is_muted,
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
      over18,
      restrict_posting,
      restrict_commenting,
      allow_images,
      allow_galleries,
      allow_videos,
      allow_videogifs,
      allow_polls,
      allow_talks,
      allow_predictions,
      allow_discovery,
      submission_type,
    },
    moderation: {
      user_is_banned,
      user_is_muted,
    },
  };
};
