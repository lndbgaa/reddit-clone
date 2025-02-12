import { IComment } from "@/types/Comment.js";

export interface IApiCommentData {
  id: string;
  author: string;
  body: string;
  subreddit: string;
  parent_id: string;
  permalink: string;
  created: number;
  score: number;
  replies: {
    data: { children: { data: IApiCommentData }[] };
  };
}

const formatComments = (comment: IApiCommentData): IComment => {
  const { id, author, body, subreddit, parent_id, permalink, created, score, replies } = comment;

  const formattedReplies =
    replies?.data?.children.map((reply: { data: IApiCommentData }) => formatComments(reply.data)) || [];

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
