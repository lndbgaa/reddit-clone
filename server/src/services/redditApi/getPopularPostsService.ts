import config from "@/config/config.js";
import { IPost } from "@/types/post.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiPostData {
  data: {
    subreddit_id: string;
    subreddit: string;
    title: string;
    author: string;
    created: number;
    post_hint?: string;
    selftext: string;
    ups: number;
    url: string;
    thumbnail: string;
    num_comments: number;
    is_video: boolean;
  };
}

interface IApiResponse {
  data: {
    children: IApiPostData[];
  };
}

export default async (accessToken: string): Promise<IPost[]> => {
  const url = `${baseUrl}/r/all/hot`;

  const response = await axios.get<IApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      g: "GLOBAL",
      limit: 30,
    },
  });

  if (!response.data?.data?.children) {
    return [];
  }

  return response.data.data.children.map((post: IApiPostData): IPost => {
    return {
      subreddit: {
        id: post.data.subreddit_id,
        name: post.data.subreddit,
      },
      title: post.data.title,
      author: post.data.author,
      created: post.data.created,
      ups: post.data.ups,
      content: {
        hint: post.data.post_hint || "",
        isVideo: post.data.is_video,
        text: post.data.selftext,
        url: post.data.url,
        thumbnail: post.data.thumbnail, // !!!
      },
      comments: {
        num: post.data.num_comments, // !!!
      },
    };
  });
};
