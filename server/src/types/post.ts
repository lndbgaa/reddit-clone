export interface IPost {
  id: string;
  subreddit: {
    id: string;
    name: string;
  };
  title: string;
  author: string;
  created: number;
  ups: number;
  comments: {
    num: number;
  };
  content: {
    type: string;
    isVideo: boolean;
    text: string;
    url: string;
    thumbnail: string;
  };
}
