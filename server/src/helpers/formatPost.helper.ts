import { Post } from "@/types/post.d.js";
import { isValidUrl } from "@/utils/validators.utils.js";

export interface ApiPostData {
  id: string;
  subreddit_id: string;
  subreddit: string;
  title: string;
  author: string;
  created: number;
  score: number;
  num_comments: number;
  post_hint?: string;
  is_video: boolean;
  selftext: string;
  url: string;
  thumbnail: string;
}

// Function that extracts and reformats specific data from an object of type ApiPostData (data sent by the API)
// into an object of type Post, mapping relevant properties for the application.

export default (post: ApiPostData): Post => {
  const {
    id,
    subreddit_id,
    subreddit,
    title,
    author,
    created,
    score,
    num_comments,
    post_hint,
    is_video,
    selftext,
    url,
    thumbnail,
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
    num_comments,
    content: {
      type: post_hint ?? "text",
      is_video: is_video,
      text: selftext,
      url,
      thumbnail: isValidUrl(thumbnail) ? thumbnail : "", // !!!
    },
  };
};
