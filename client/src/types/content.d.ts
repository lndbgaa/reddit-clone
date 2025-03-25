export type ContentType = "post" | "comment";

export type VoteType = "liked" | "disliked" | null; // null: no vote

export type VoteDirection = "1" | "-1" | "0"; // "1": upvote, "-1": downvote, "0": remove vote
