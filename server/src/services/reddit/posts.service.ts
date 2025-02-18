import redditConfig from "@/config/reddit.config.js";
import formatComments, { IApiCommentData } from "@/helpers/formatComments.helper.js";
import formatPost, { IApiPostData } from "@/helpers/formatPost.helper.js";
import { IComment } from "@/types/Comment.type.js";
import { IPost } from "@/types/Post.type.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

interface IApiResponse1 {
  data: {
    children: { data: IApiPostData }[];
  };
}

interface IApiResponse2 {
  data: {
    children: { data: IApiCommentData }[];
  };
}

interface PostData {
  subreddit: string;
  title: string;
  kind: "self" | "link";
  text: string;
  url: string;
}

export const fetchPopularPosts = async (accessToken: string): Promise<IPost[]> => {
  const url = `${baseUrl}/r/all/hot`;

  const response = await axios.get<IApiResponse1>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      g: "GLOBAL",
      limit: 70,
    },
  });

  if (!response.data?.data?.children || response.data.data.children.length === 0) {
    return [];
  }

  return response.data.data.children.map((post: { data: IApiPostData }) => formatPost(post.data));
};

export const fetchPostsByKeyword = async (accessToken: string, q: string): Promise<IPost[]> => {
  const url = `${baseUrl}/r/all/search`;

  const response = await axios.get<IApiResponse1>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      q,
      limit: 70,
    },
  });

  if (!response.data?.data?.children || response.data.data.children.length === 0) {
    return [];
  }

  return response.data.data.children.map((post: { data: IApiPostData }) => formatPost(post.data));
};

export const fetchCommentsForPost = async (accessToken: string, postId: string): Promise<IComment[]> => {
  const url = `${baseUrl}/comments/${postId}`;

  const response = await axios.get<IApiResponse2>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (
    !response.data ||
    !Array.isArray(response.data) ||
    response.data.length < 2 ||
    !response.data[1]?.data?.children?.length
  ) {
    return [];
  }

  return response.data[1].data.children.map((comment: { data: IApiCommentData }) =>
    formatComments(comment.data)
  );
};

export const submitPost = async (accessToken: string, postData: PostData): Promise<void> => {
  const url = `${redditConfig.baseUrl}/api/submit`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams({
    title: postData.title,
    sr: postData.subreddit,
    kind: postData.kind,
  });

  if (postData.kind === "self") {
    params.append("text", postData.text);
  } else if (postData.kind === "link") {
    params.append("url", postData.url);
  }

  await axios.post(url, params, options);
};
