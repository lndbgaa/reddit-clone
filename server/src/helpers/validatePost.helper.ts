import { fetchSubredditDetails } from "@/services/reddit/subreddits.service.js";
import { CreatePostData } from "@/types/CreatePostData.type.js";
import { Subreddit } from "@/types/Subreddit.type.js";
import AppError from "@/utils/AppError.js";
import { isValidUrl } from "@/utils/validators.utils.js";

// Function to validate post data before submission to Reddit
// Ensures that the required fields are present and meet the subreddit-specific rules

export default async (accessToken: string, postData: CreatePostData) => {
  const { subreddit, title, kind, text, url } = postData;

  if (!subreddit || typeof subreddit !== "string" || subreddit.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'subreddit' is missing or invalid. Must be a non-empty string.",
    });
  }

  const subredditInfo: Subreddit | null = await fetchSubredditDetails(accessToken, subreddit);

  if (!subredditInfo) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `The subreddit r/${subreddit} does not exist.`,
    });
  }

  const { moderation, settings } = subredditInfo;

  if (settings.type === "private") {
    throw new AppError({
      statusCode: 403,
      statusText: "Forbidden",
      message: "This subreddit is private. You cannot post here.",
    });
  }

  if (settings.type === "restricted" && !moderation.user_is_contributor) {
    throw new AppError({
      statusCode: 403,
      statusText: "Forbidden",
      message: "This subreddit is restricted. Only approved users can post.",
    });
  }

  if (settings.type === "archived") {
    throw new AppError({
      statusCode: 403,
      statusText: "Forbidden",
      message: "This subreddit is archived. Posting is not allowed.",
    });
  }

  if (moderation.user_is_banned) {
    throw new AppError({
      statusCode: 403,
      statusText: "Forbidden",
      message: "You are banned from posting in this subreddit.",
    });
  }

  if (moderation.user_is_muted) {
    throw new AppError({
      statusCode: 403,
      statusText: "Forbidden",
      message: "You are muted in this subreddit and cannot post.",
    });
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'title' is missing or invalid. Must be a non-empty string.",
    });
  }

  if (title.length > 300) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Title is too long. Maximum length is 300 characters.",
    });
  }

  const validKind = ["self", "link", "image", "video", "videogif"];

  if (!validKind.includes(kind)) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: `Request body parameter 'kind' is missing or invalid. Must be one of: ${validKind.join(
        ", "
      )}.`,
    });
  }

  if (settings.submission_type === "self" && kind !== "self") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "This subreddit only accepts self posts.",
    });
  }

  if (settings.submission_type === "link" && kind === "self") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "This subreddit only accepts link posts.",
    });
  }

  if (kind === "self" && (!text || text.trim() === "")) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'text' is required for self posts. Must be a non-empty string.",
    });
  }

  if (kind === "link" && (!url || !isValidUrl(url) || url.trim() === "")) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'url' is required for link posts. Must be a valid URL.",
    });
  }

  if (kind === "image" && !settings.allow_images) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "This subreddit does not allow image posts.",
    });
  }

  if (kind === "video" && !settings.allow_videos) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "This subreddit does not allow video posts.",
    });
  }

  if (kind === "videogif" && !settings.allow_videogifs) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "This subreddit does not allow video GIFs.",
    });
  }
};
