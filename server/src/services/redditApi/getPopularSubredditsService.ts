import config from "@config/config.js";
import AppError from "@utils/AppError.js";
import axios from "axios";

interface ISubreddits {
  id: string;
  displayName: string;
  prefixedName: string;
  title: string;
  created: number;
  icon?: string;
  banner?: string;
  description: string;
  subscribers: number;
}

const { baseUrl, userAgent } = config.redditApi;

export default async (accessToken: string) => {
  if (!accessToken) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      context: "Popular subreddits fetch",
      message: "Access token is missing or invalid.",
    });
  }

  const url = `${baseUrl}/subreddits/popular`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      limit: 30,
    },
  };

  try {
    const response = await axios.get(url, config);

    if (!response.data || !response.data.data || !response.data.data.children) {
      return null;
    }

    return response.data.data.children;
  } catch (err) {
    console.error("Error getting popular subreddits from Reddit API");
    throw err;
  }
};
