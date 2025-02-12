import config from "@/config/config.js";
import { ISubreddit } from "@/types/Subreddit.js";
import formatSubreddit, { IApiSubredditData } from "@/utils/formatSubreddit.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiResponse {
  data: {
    children: {
      data: IApiSubredditData;
    }[];
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
      limit: 7,
    },
  });

  if (!response.data?.data?.children || response.data.data.children.length === 0) {
    return [];
  }

  return response.data.data.children.map((subreddit: { data: IApiSubredditData }) =>
    formatSubreddit(subreddit.data)
  );
};
