export interface CreatePostData {
  subreddit: string;
  title: string;
  kind: "self" | "link" | "image" | "video" | "videogif";
  text?: string; // Optional: Only for "self" posts
  url?: string; // Optional: Required for "link", "image", "video" or "videogif" posts
}
