import config from "@/config/config.js";
import { IComment } from "@/types/Comment";
import formatComments, { IApiCommentData } from "@/utils/formatComments.js";
import axios from "axios";

const { baseUrl, userAgent } = config.redditApi;

interface IApiResponse {
  data: {
    children: { data: IApiCommentData }[];
  };
}

export default async (accessToken: string, id: string): Promise<IComment[]> => {
  const url = `${baseUrl}/comments/${id}`;

  const response = await axios.get<IApiResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (
    !response.data ||
    !Array.isArray(response.data) ||
    response.data.length < 2 ||
    !response.data[1]?.data?.children?.length
  ) {
    return [];
  }

  return response.data[1].data.children.map((comment: { data: IApiCommentData }) =>
    formatComments(comment.data)
  );
};
