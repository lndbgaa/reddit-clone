import redditConfig from "@/config/reddit.config.js";
import formatUser, { IApiUserData } from "@/helpers/formatUser.helper.js";
import { IUser } from "@/types/User.type.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

interface IApiResponse1 extends IApiUserData {}

interface IApiResponse2 {
  data: IApiUserData;
}

export const fetchMyInfo = async (accessToken: string): Promise<IUser | null> => {
  const url = `${baseUrl}/api/v1/me`;

  const response = await axios.get<IApiResponse1>(url, {
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

export const fetchUserInfo = async (accessToken: string, username: string): Promise<IUser | null> => {
  const url = `${baseUrl}/user/${username}/about`;

  const response = await axios.get<IApiResponse2>(url, {
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
