import redditConfig from "@/config/reddit.config.js";
import formatPost, { ApiPostData } from "@/helpers/formatPost.helper.js";
import formatSubreddit, { ApiSubredditData } from "@/helpers/formatSubreddit.helper.js";
import { Post } from "@/types/post.d.js";
import { Subreddit } from "@/types/subreddit.d.js";
import AppError from "@/utils/AppError.js";

import axios, { AxiosError } from "axios";

const { baseUrl, userAgent } = redditConfig;

// Data Structure for Reddit API response for a single subreddit.
// A single subreddit object containing its details.
interface SubredditApiResponse {
  data: ApiSubredditData;
}

// Data Structure for Reddit API response for subreddits.
// Each "children" item contains data for a single subreddit.
interface SubredditsListApiResponse {
  data: {
    children: {
      data: ApiSubredditData;
    }[];
  };
}

// Data Structure for Reddit API response for posts.
// Each "children" item contains data for a single post.
interface PostsListApiResponse {
  data: {
    children: { data: ApiPostData }[];
  };
}

export const fetchSubredditDetails = async (accessToken: string, name: string): Promise<Subreddit | null> => {
  const url = `${baseUrl}/r/${name}/about`;

  const response = await axios.get<SubredditApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.data?.data) {
    return null;
  }

  return formatSubreddit(response.data.data);
};

export const fetchPopularSubreddits = async (accessToken: string): Promise<Subreddit[]> => {
  const url = `${baseUrl}/subreddits/popular`;

  const response = await axios.get<SubredditsListApiResponse>(url, {
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

  return response.data.data.children.map((subreddit: { data: ApiSubredditData }) =>
    formatSubreddit(subreddit.data)
  );
};

export const postSubscribe = async (
  accessToken: string,
  action: "sub" | "unsub",
  name: string
): Promise<void> => {
  const url = `${baseUrl}/api/subscribe`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    action,
    sr_name: name,
  });

  try {
    await axios.post(url, data, options);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new AppError({
        statusCode: 404,
        statusText: "Not Found",
        message: `Subreddit r/${name} not found.`,
      });
    } else {
      throw error;
    }
  }
};

export const fetchSubredditPopularPosts = async (accessToken: string, name: string): Promise<Post[]> => {
  const url = `${baseUrl}/r/${name}/top`;

  const response = await axios.get<PostsListApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      t: "day",
      limit: 70,
    },
  });

  if (!response.data?.data?.children || response.data.data.children.length === 0) {
    return [];
  }

  return response.data.data.children.map((post: { data: ApiPostData }) => formatPost(post.data));
};
