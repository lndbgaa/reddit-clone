import redditConfig from "@/config/reddit.config.js";
import axios from "axios";

const { userAgent, clientID, clientSecret } = redditConfig;

export const fetchNewToken = async (refreshToken: string) => {
  const url = "https://www.reddit.com/api/v1/access_token";

  const response = await axios.post(
    url,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        "User-Agent": userAgent,
        Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString("base64")}`,
      },
    }
  );

  if (!response.data?.access_token) {
    return null;
  }

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
    refreshToken: response.data.refresh_token,
  };
};
