import config from "@/config/config.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

export default async (accessToken: string, postId: string, voteDirection: "1" | "-1" | "0") => {
  const url = `${baseUrl}/api/vote`;

  const response = await axios.post(
    url,
    new URLSearchParams({
      id: `t3_${postId}`,
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

  return null;
};
