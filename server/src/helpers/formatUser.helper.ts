import { User } from "@/types/User.type.js";

export interface ApiUserData {
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

// Function that extracts and reformats specific data from an object of type ApiUserData (data sent by the API)
// into an object of type User, mapping relevant properties for the application.

export default (user: ApiUserData): User => {
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
