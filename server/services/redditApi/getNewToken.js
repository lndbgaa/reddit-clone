const axios = require("axios");
const config = require("../../config/config");

const { baseUrl, userAgent, clientID, clientSecret } = config.redditApi;

module.exports = async (refreshToken) => {
  const url = `${baseUrl}/access_token`;

  const data = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString("base64")}`,
    },
  };

  try {
    const response = await axios.post(url, data, config);

    if (!response.data || !response.data.access_token) {
      return null;
    }

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (err) {
    err.context = "Reddit API Token Refresh";
    throw err;
  }
};
