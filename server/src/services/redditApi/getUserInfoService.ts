import config from "@/config/config.js";
import { IUser } from "@/types/User.js";
import formatUser, { IApiUserData } from "@/utils/formatUser.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiResponse {
  data: IApiUserData;
}

export default async (accessToken: string, username: string): Promise<IUser | null> => {
  const url = `${baseUrl}/user/${username}/about`;

  const response = await axios.get<IApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.data?.data) {
    return null;
  }

  return formatUser(response.data.data);
};
