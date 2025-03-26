import config from "@/config/appConfig";
import { ContentType, VoteDirection } from "@/types/content";
import axios from "axios";

export const voteOnContent = async (type: ContentType, id: string, voteDirection: VoteDirection) => {
  const url = `${config.apiUrl}/reddit/${type}s/${id}/vote`;

  try {
    await axios.post(url, { voteDirection }, { withCredentials: true });

    return true;
  } catch (err) {
    console.error(err); // !!!
    return false;
  }
};

export const saveContent = async (type: ContentType, id: string) => {
  const url = `${config.apiUrl}/reddit/${type}s/${id}/save`;

  try {
    await axios.post(url, {}, { withCredentials: true });

    return true;
  } catch (err) {
    console.error(err); // !!!
    return false;
  }
};

export const unsaveContent = async (type: ContentType, id: string) => {
  const url = `${config.apiUrl}/reddit/${type}s/${id}/unsave`;

  try {
    await axios.post(url, {}, { withCredentials: true });

    return true;
  } catch (err) {
    console.error(err); // !!!
    return false;
  }
};
