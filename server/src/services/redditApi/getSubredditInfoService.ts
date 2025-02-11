import config from "@/config/config.js";
import { ISubreddit } from "@/types/Subreddit.js";
import formatSubreddit from "@/utils/formatSubreddit.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

export default async (accessToken: string, name: string): Promise<ISubreddit | null> => {
  const url = `${baseUrl}/r/${name}/about`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.data?.data || response.data.data?.dist === 0) {
    return null;
  }

  return formatSubreddit(response.data);
};
