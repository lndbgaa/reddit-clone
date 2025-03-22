import redditConfig from "@/config/reddit.config.js";
import formatComment from "@/helpers/formatComment.helper.js";
import { Comment } from "@/types/comment.d.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

interface CommentData {
  parent: string;
  text: string;
}

export const submitComment = async (accessToken: string, commentData: CommentData): Promise<void> => {
  const url = `${baseUrl}/api/comment`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    thing_id: commentData.parent,
    text: commentData.text,
  });

  await axios.post(url, data, config);
};

export const fetchCommentById = async (accessToken: string, id: string): Promise<Comment | null> => {
  const url = `${baseUrl}/api/info`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
    params: {
      id: `t1_${id}`,
    },
  };

  const response = await axios.get(url, config);

  if (!response.data?.data?.children?.length) {
    return null;
  }

  return formatComment(response.data.data.children[0].data);
};
