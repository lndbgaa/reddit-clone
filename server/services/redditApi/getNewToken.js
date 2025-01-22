const axios = require("axios");
const config = require("../../config/environment");
const AppError = require("../../utils/AppError");

const { baseUrl, userAgent, clientID, clientSecret } = config.redditAPI;

module.exports = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Refresh token is required",
    });
  }

  const url = `${baseUrl}/access_token`;

  const data = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString(
        "base64"
      )}`,
    },
  };

  try {
    const response = await axios.post(url, data, config);

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (err) {
    throw err;
  }
};
