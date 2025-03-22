import redditConfig from "@/config/reddit.config.js";
import formatUser, { ApiUserData } from "@/helpers/formatUser.helper.js";
import { User } from "@/types/user.d.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

// Data Structure for Reddit API response for current user's info.
interface MyInfoApiResponse extends ApiUserData {}

// Data Structure for Reddit API response for a particular user's info.
interface UserInfoApiResponse {
  data: ApiUserData;
}

export const fetchMyInfo = async (accessToken: string): Promise<User | null> => {
  const url = `${baseUrl}/api/v1/me`;

  const response = await axios.get<MyInfoApiResponse>(url, {
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

export const fetchUserInfo = async (accessToken: string, username: string): Promise<User | null> => {
  const url = `${baseUrl}/user/${username}/about`;

  const response = await axios.get<UserInfoApiResponse>(url, {
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
