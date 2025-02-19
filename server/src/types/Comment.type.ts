export interface Comment {
  id: string;
  parent_id: string;
  subreddit: {
    name: string;
  };
  author: string;
  body: string;
  created: number;
  score: number;
  permalink: string;
  replies?: Comment[];
}
