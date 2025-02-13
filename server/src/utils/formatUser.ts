import { IUser } from "@/types/User.js";

export interface IApiUserData {
  name: string;
  title: string;
  link_karma: number;
  comment_karma: number;
  created: number;
  snoovatar_img?: string;
  subreddit: {
    public_description?: string;
  };
}

export default (user: IApiUserData): IUser => {
  const { name, title, link_karma, comment_karma, created, snoovatar_img } = user;
  const { public_description } = user.subreddit || {};

  return {
    username: name,
    profile_title: title,
    link_karma,
    comment_karma,
    created,
    avatar: snoovatar_img || "", // !!!
    bio: public_description || "",
  };
};
