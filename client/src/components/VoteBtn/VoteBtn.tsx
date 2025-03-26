import DownvoteIcon from "@/assets/images/downvote-icon.svg?react";
import UpvoteIcon from "@/assets/images/upvote-icon.svg?react";
import { voteOnContent } from "@/services/api/contentService";
import { ContentType, VoteDirection, VoteType } from "@/types/content";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./VoteBtn.module.css";

interface Props {
  userVote: VoteType; // "liked", "disliked" or null
  contentType: ContentType; // "post" or "comment"
  contentId: string;
  contentScore: number;
}

function VoteBtn({ userVote, contentType, contentId, contentScore }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [score, setScore] = useState<number>(contentScore);
  const [currentVote, setCurrentVote] = useState<VoteType>(userVote);

  function updateScore(currentVote: VoteType, newVote: VoteType) {
    if (currentVote === newVote) {
      // User is retracting their vote
      return newVote === "liked" ? score - 1 : score + 1;
    } else {
      if (currentVote === null) {
        // First-time vote
        return newVote === "liked" ? score + 1 : score - 1;
      } else if (currentVote === "liked") {
        // Changing from 'liked' to 'disliked
        return score - 2;
      } else {
        // Changing from 'disliked' to 'liked
        return score + 2;
      }
    }
  }

  const handleUpvote = async (): Promise<void> => {
    if (isLoading) return; // Prevent multiple votes if loading

    setIsLoading(true);

    const voteDirection: VoteDirection = currentVote === "liked" ? "0" : "1"; // "0": remove vote, "1": upvote
    const response: boolean = await voteOnContent(contentType, contentId, voteDirection);

    if (response) {
      setCurrentVote(currentVote === "liked" ? null : "liked");
      setScore(updateScore(currentVote, "liked"));
      setError(false);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  const handleDownvote = async (): Promise<void> => {
    if (isLoading) return; // Prevent multiple votes if loading

    setIsLoading(true);

    const voteDirection: VoteDirection = currentVote === "disliked" ? "0" : "-1"; // "0": remove vote, "-1": downvote
    const response: boolean = await voteOnContent(contentType, contentId, voteDirection);

    if (response) {
      setCurrentVote(currentVote === "disliked" ? null : "disliked");
      setScore(updateScore(currentVote, "disliked"));
      setError(false);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  // Resets the error state after 500ms to show the "shake" animation briefly.
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className={classNames(styles.container, {
        [styles.voteForPostBtn]: contentType === "post",
        [styles.voteForCommentBtn]: contentType === "comment",
        [styles.liked]: currentVote === "liked",
        [styles.disliked]: currentVote === "disliked",
        [styles.isLoading]: isLoading,
        [styles.hasError]: error,
      })}
    >
      <button
        type="button"
        className={styles.upvoteBtn}
        onClick={handleUpvote}
        disabled={isLoading}
        aria-label="upvote"
        aria-disabled={isLoading}
      >
        <UpvoteIcon width="16px" height="16px" />
      </button>
      <span className={styles.score}>{score}</span>
      <button
        type="button"
        className={styles.downvoteBtn}
        onClick={handleDownvote}
        disabled={isLoading}
        aria-label="downvote"
        aria-disabled={isLoading}
      >
        <DownvoteIcon width={"16px"} height={"16px"} />
      </button>
    </div>
  );
}

export default VoteBtn;
