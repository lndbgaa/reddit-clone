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
