import config from "@/config/config.js";
import { IUser } from "@/types/User.js";
import formatUser, { IApiUserData } from "@/utils/formatUser.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiResponse extends IApiUserData {}

export default async (accessToken: string): Promise<IUser | null> => {
  const url = `${baseUrl}/api/v1/me`;

  const response = await axios.get<IApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.data) {
    return null;
  }

  return formatUser(response.data);
};
