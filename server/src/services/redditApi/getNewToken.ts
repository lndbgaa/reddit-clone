import config from "@config/config.js";
import axios from "axios";

const { baseUrl, userAgent, clientId, clientSecret } = config.redditApi;

interface ApiResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export default async (refreshToken: string) => {
  const url = `${baseUrl}/access_token`;

  const data = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
  };

  try {
    const response: ApiResponse = await axios.post(url, data, config);

    if (!response.data || !response.data.access_token) {
      return null;
    }

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (err) {
    throw err;
  }
};
