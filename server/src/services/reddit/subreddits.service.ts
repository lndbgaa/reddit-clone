import redditConfig from "@/config/reddit.config.js";
import formatPost, { IApiPostData } from "@/helpers/formatPost.helper.js";
import formatSubreddit, { IApiSubredditData } from "@/helpers/formatSubreddit.helper.js";
import { IPost } from "@/types/Post.type.js";
import { ISubreddit } from "@/types/Subreddit.type.js";

import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

interface IApiResponse1 {
  data: IApiSubredditData; // a single subreddit object containing its details
}

interface IApiResponse2 {
  data: {
    children: {
      data: IApiSubredditData; // each "children" item contains data for a single subreddit
    }[];
  };
}

interface IApiResponse3 {
  data: {
    children: { data: IApiPostData }[]; // each "children" item contains data for a single post
  };
}

export const fetchSubredditDetails = async (
  accessToken: string,
  name: string
): Promise<ISubreddit | null> => {
  const url = `${baseUrl}/r/${name}/about`;

  const response = await axios.get<IApiResponse1>(url, {
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

export const fetchPopularSubreddits = async (accessToken: string): Promise<ISubreddit[]> => {
  const url = `${baseUrl}/subreddits/popular`;

  const response = await axios.get<IApiResponse2>(url, {
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

export const fetchSubredditPopularPosts = async (accessToken: string, name: string): Promise<IPost[]> => {
  const url = `${baseUrl}/r/${name}/top`;

  const response = await axios.get<IApiResponse3>(url, {
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

  return response.data.data.children.map((post: { data: IApiPostData }) => formatPost(post.data));
};
