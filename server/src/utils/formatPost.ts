import { IPost } from "@/types/Post.js";
import { isValidUrl } from "@/utils/helpers.js";

export interface IApiPostData {
  data: {
    id: string;
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

export default (post: IApiPostData): IPost => {
  const {
    id,
    subreddit_id,
    subreddit,
    title,
    author,
    created,
    ups,
    post_hint,
    is_video,
    selftext,
    url,
    thumbnail,
    num_comments,
  } = post.data;

  return {
    id,
    subreddit: {
      id: subreddit_id,
      name: subreddit,
    },
    title,
    author,
    created,
    ups,
    content: {
      type: post_hint || "text",
      isVideo: is_video,
      text: selftext,
      url,
      thumbnail: isValidUrl(thumbnail) ? thumbnail : "", // !!!
    },
    comments: {
      num: num_comments, // !!!
    },
  };
};
