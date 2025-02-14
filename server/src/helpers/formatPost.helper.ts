import { IPost } from "@/types/Post.type.js";
import { isValidUrl } from "@/utils/validators.utils.js";

export interface IApiPostData {
  id: string;
  subreddit_id: string;
  subreddit: string;
  title: string;
  author: string;
  created: number;
  post_hint?: string;
  selftext: string;
  score: number;
  url: string;
  thumbnail: string;
  num_comments: number;
  is_video: boolean;
}

export default (post: IApiPostData): IPost => {
  const {
    id,
    subreddit_id,
    subreddit,
    title,
    author,
    created,
    score,
    post_hint,
    is_video,
    selftext,
    url,
    thumbnail,
    num_comments,
  } = post;

  return {
    id,
    subreddit: {
      id: subreddit_id,
      name: subreddit,
    },
    title,
    author,
    created,
    score,
    content: {
      type: post_hint || "text",
      is_video: is_video,
      text: selftext,
      url,
      thumbnail: isValidUrl(thumbnail) ? thumbnail : "", // !!!
    },
    num_comments,
  };
};
