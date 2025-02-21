import redditConfig from "@/config/reddit.config.js";
import formatComments, { ApiCommentData } from "@/helpers/formatComments.helper.js";
import formatPost, { ApiPostData } from "@/helpers/formatPost.helper.js";
import { Comment } from "@/types/Comment.type.js";
import { CreatePostData } from "@/types/CreatePostData.type.js";
import { Post } from "@/types/Post.type.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

// Data Structure for Reddit API response for posts.
// Each "children" item contains data for a single post.
interface PostsListApiResponse {
  data: {
    children: { data: ApiPostData }[];
  };
}

// Data structure for Reddit API response for comments.
// Each "children" item contains data for a single comment.
interface CommentsListApiResponse {
  data: {
    children: { data: ApiCommentData }[];
  };
}

export const submitPost = async (accessToken: string, postData: CreatePostData): Promise<void> => {
  const url = `${redditConfig.baseUrl}/api/submit`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    title: postData.title,
    sr: postData.subreddit,
    kind: postData.kind,
    resubmit: "true",
    sendreplies: "true",
  });

  if (postData.kind === "self") {
    data.append("text", postData.text as string);
  } else {
    data.append("url", postData.url as string);
  }

  await axios.post(url, data, config);
};

export const fetchPopularPosts = async (accessToken: string): Promise<Post[]> => {
  const url = `${baseUrl}/r/all/hot`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      g: "GLOBAL",
      limit: 70,
    },
  };

  const response = await axios.get<PostsListApiResponse>(url, config);

  if (!response.data?.data?.children?.length) {
    return [];
  }

  return response.data.data.children.map((post: { data: ApiPostData }) => formatPost(post.data));
};

export const fetchPostsByKeyword = async (accessToken: string, q: string): Promise<Post[]> => {
  const url = `${baseUrl}/r/all/search`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      q,
      limit: 70,
    },
  };

  const response = await axios.get<PostsListApiResponse>(url, config);

  if (!response.data?.data?.children?.length) {
    return [];
  }

  return response.data.data.children.map((post: { data: ApiPostData }) => formatPost(post.data));
};

export const fetchCommentsForPost = async (accessToken: string, postId: string): Promise<Comment[]> => {
  const url = `${baseUrl}/comments/${postId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const response = await axios.get<CommentsListApiResponse>(url, config);

  if (
    !response.data ||
    !Array.isArray(response.data) ||
    response.data.length < 2 ||
    !response.data[1]?.data?.children?.length
  ) {
    return [];
  }

  return response.data[1].data.children.map((comment: { data: ApiCommentData }) =>
    formatComments(comment.data)
  );
};

export const fetchPostById = async (accessToken: string, id: string): Promise<Post | null> => {
  const url = `${redditConfig.baseUrl}/api/info`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      id: `t3_${id}`,
    },
  };

  const response = await axios.get<PostsListApiResponse>(url, config);

  if (!response.data?.data?.children?.length) {
    return null;
  }

  return formatPost(response.data.data.children[0].data);
};

export const editPost = async (accessToken: string, id: string, text: string): Promise<void> => {
  const url = `${redditConfig.baseUrl}/api/editusertext`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    thing_id: `t3_${id}`,
    text,
  });

  await axios.post(url, data, config);
};

export const deletePost = async (accessToken: string, id: string): Promise<void> => {
  const url = `${redditConfig.baseUrl}/api/del`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    id: `t3_${id}`,
  });

  await axios.post(url, data, config);
};
