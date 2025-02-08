import config from "@config/config.js";
import AppError from "@utils/AppError.js";
import axios from "axios";

const { userAgent, clientId, clientSecret } = config.redditApi;

export default async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      context: "Token refresh",
      message: "Refresh token is missing or invalid.",
    });
  }

  const url = "https://www.reddit.com/api/v1/access_token";

  const config = {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  };

  try {
    const response = await axios.post(url, config);

    if (!response.data || !response.data.access_token) {
      return null;
    }

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (err) {
    console.error("Error getting new token from Reddit API");
    throw err;
  }
};
