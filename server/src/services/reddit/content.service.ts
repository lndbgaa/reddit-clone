import redditConfig from "@/config/reddit.config.js";
import axios from "axios";

const { baseUrl, userAgent } = redditConfig;

export const submitVote = async (
  accessToken: string,
  id: string,
  type: string,
  voteDirection: "1" | "-1" | "0"
): Promise<void> => {
  const url = `${baseUrl}/api/vote`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    id,
    dir: voteDirection,
  });

  await axios.post(url, data, options);
};

export const submitSave = async (accessToken: string, id: string): Promise<void> => {
  const url = `${baseUrl}/api/save`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    id,
  });

  await axios.post(url, data, options);
};

export const submitUnsave = async (accessToken: string, id: string): Promise<void> => {
  const url = `${baseUrl}/api/unsave`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    id,
  });

  await axios.post(url, data, options);
};

export const editContent = async (accessToken: string, id: string, text: string): Promise<void> => {
  const url = `${baseUrl}/api/editusertext`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    thing_id: id,
    text,
  });

  await axios.post(url, data, config);
};

export const deleteContent = async (accessToken: string, id: string): Promise<void> => {
  const url = `${baseUrl}/api/del`;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  };

  const data = new URLSearchParams({
    id,
  });

  await axios.post(url, data, config);
};
