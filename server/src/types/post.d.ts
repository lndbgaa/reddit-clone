export type PostType = "any" | "link" | "self";

export interface Post {
  id: string;
  subreddit: {
    id: string;
    name: string;
  };
  title: string;
  author: string;
  created: number;
  score: number;
  num_comments: number;
  content: {
    type: string;
    is_video: boolean;
    text: string;
    url: string;
    thumbnail: string;
  };
}

export interface CreatePostData {
  subreddit: string;
  title: string;
  kind: "self" | "link" | "image" | "video" | "videogif";
  text?: string; // Optional: Only for "self" posts
  url?: string; // Optional: Required for "link", "image", "video" or "videogif" posts
}
