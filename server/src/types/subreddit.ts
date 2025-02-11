export interface ISubreddit {
  id: string;
  name: string;
  title: string;
  created: number;
  descriptions: {
    short: string;
  };
  appearance: {
    icon: string;
    banner: string;
    color: string;
  };
  stats: {
    subscribers: number;
  };
  category: string;
  type: string;
  lang: string;
  over18: boolean;
}
