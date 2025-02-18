import redditConfig from "@/config/reddit.config.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

const prefix = {
  posts: "t3_",
  comments: "t1_",
};

export const submitVote = async (
  accessToken: string,
  id: string,
  type: string,
  voteDirection: "1" | "-1" | "0"
): Promise<void> => {
  const url = `${baseUrl}/api/vote`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams({
    id: `${prefix[type as "posts" | "comments"]}${id}`,
    dir: voteDirection,
  });

  await axios.post(url, params, options);
};
