import config from "@/config/config.js";
import { IPost } from "@/types/Post.js";
import formatPost, { IApiPostData } from "@/utils/formatPost.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiResponse {
  data: {
    children: { data: IApiPostData }[];
  };
}

export default async (accessToken: string, name: string): Promise<IPost[]> => {
  const url = `${baseUrl}/r/${name}/top`;

  const response = await axios.get<IApiResponse>(url, {
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
