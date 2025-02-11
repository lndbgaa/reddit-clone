import config from "@/config/config.js";
import axios from "axios";

const { userAgent, clientId, clientSecret } = config.redditApi;

export default async (refreshToken: string) => {
  const url = "https://www.reddit.com/api/v1/access_token";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "User-Agent": userAgent,
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
      }
    );

    if (!response.data || !response.data.access_token) {
      return null;
    }

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (err) {
    console.error("Error getting new token from Reddit API.");
    throw err;
  }
};
