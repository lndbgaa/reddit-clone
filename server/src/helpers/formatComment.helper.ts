import { Comment } from "@/types/Comment.type.js";

export interface ApiCommentData {
  id: string;
  author: string;
  body: string;
  subreddit: string;
  parent_id: string;
  permalink: string;
  created: number;
  score: number;
  replies: {
    data: { children: { data: ApiCommentData }[] };
  };
}

// Function that extracts and reformats specific data from an object of type ApiCommentData (data sent by the API)
// into an object of type Comment, mapping relevant properties for the application.

const formatComments = (comment: ApiCommentData): Comment => {
  const { id, author, body, subreddit, parent_id, permalink, created, score, replies } = comment;

  const formattedReplies =
    replies?.data?.children.map((reply: { data: ApiCommentData }) => formatComments(reply.data)) || [];

  return {
    id,
    author,
    body,
    subreddit: {
      name: subreddit,
    },
    parent_id,
    permalink,
    created,
    score,
    replies: formattedReplies,
  };
};

export default formatComments;
