import config from "@/config/config.js";
import { ISubreddit } from "@/types/subreddit.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiSubredditData {
  data: {
    id: string;
    display_name: string;
    created: number;
    icon_img: string;
    subscribers: number;
  };
}

interface IApiResponse {
  data: {
    children: IApiSubredditData[];
  };
}

export default async (accessToken: string): Promise<ISubreddit[]> => {
  const url = `${baseUrl}/subreddits/popular`;

  const response = await axios.get<IApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      limit: 30,
    },
  });

  if (!response.data?.data?.children) {
    return [];
  }

  return response.data.data.children.map((subreddit: IApiSubredditData): ISubreddit => {
    return {
      id: subreddit.data.id,
      name: subreddit.data.display_name,
      created: subreddit.data.created,
      icon: subreddit.data.icon_img,
      subscribers: subreddit.data.subscribers,
    };
  });
};
