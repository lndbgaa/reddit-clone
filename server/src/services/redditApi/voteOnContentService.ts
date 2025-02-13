import config from "@/config/config.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

export default async (accessToken: string, id: string, type: string, voteDirection: "1" | "-1" | "0") => {
  const url = `${baseUrl}/api/vote`;

  const prefix = {
    posts: "t3_",
    comments: "t1_",
  };

  await axios.post(
    url,
    new URLSearchParams({
      id: `${prefix[type as "posts" | "comments"]}${id}`,
      dir: voteDirection,
    }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": userAgent,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
