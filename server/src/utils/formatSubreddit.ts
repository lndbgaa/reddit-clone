import { ISubreddit } from "@/types/Subreddit.js";

export interface IApiSubredditData {
  data: {
    id: string;
    display_name: string;
    title: string;
    created: number;
    public_description: string;
    icon_img: string;
    banner_img: string;
    primary_color: string;
    subscribers: number;
    advertiser_category: string;
    subreddit_type: string;
    lang: string;
    over18: boolean;
  };
}

export default (subreddit: IApiSubredditData): ISubreddit => {
  const {
    id,
    display_name,
    title,
    created,
    public_description,
    icon_img,
    banner_img,
    primary_color,
    subscribers,
    advertiser_category,
    subreddit_type,
    lang,
    over18,
  } = subreddit.data;

  return {
    id,
    name: display_name,
    title,
    created,
    descriptions: {
      short: public_description,
    },
    appearance: {
      icon: icon_img, // !!!
      banner: banner_img, // !!!
      color: primary_color,
    },
    stats: {
      subscribers, // !!!
    },
    category: advertiser_category,
    type: subreddit_type,
    lang,
    over18,
  };
};
