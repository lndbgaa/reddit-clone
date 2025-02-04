import axios from "axios";
import config from "../../config/config.js";
const { baseUrl, userAgent, clientId, clientSecret } = config.redditApi;
export default async (refreshToken) => {
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
        const response = await axios.post(url, data, config);
        if (!response.data || !response.data.access_token) {
            return null;
        }
        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in,
            refreshToken: response.data.refresh_token,
        };
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=getNewToken.js.map