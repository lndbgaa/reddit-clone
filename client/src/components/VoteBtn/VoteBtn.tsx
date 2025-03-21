import DownvoteIcon from "@assets/images/downvote-icon.svg?react";
import UpvoteIcon from "@assets/images/upvote-icon.svg?react";
import { useState } from "react";
import style from "./VoteBtn.module.css";

type VoteType = "liked" | "disliked" | null;

interface Props {
  contentType: "post" | "comment";
  contentId: string;
  contentScore: number;
  userVote: VoteType;
}

// TODO connect to server data !

function VoteBtn({ contentType, contentId, contentScore, userVote }: Props) {
  const [score, setScore] = useState(contentScore);
  const [currentVote, setCurrentVote] = useState<VoteType>(userVote);

  const updateScore = (type: VoteType): number => {
    if (type === "liked") {
      return currentVote === "liked" ? score - 1 : currentVote === "disliked" ? score + 2 : score + 1;
    } else if (type === "disliked") {
      return currentVote === "disliked" ? score + 1 : currentVote === "liked" ? score - 2 : score - 1;
    }
    return score;
  };

  const handleUpvote = () => {
    if (currentVote === "liked") {
      setCurrentVote(null);
    } else {
      setCurrentVote("liked");
    }

    const updatedScore = updateScore("liked");
    setScore(updatedScore);
  };

  const handleDownvote = () => {
    if (currentVote === "disliked") {
      setCurrentVote(null);
    } else {
      setCurrentVote("disliked");
    }

    const updatedScore = updateScore("disliked");
    setScore(updatedScore);
  };

  return (
    <div className={style.container}>
      <button
        type="button"
        className={style.upvote}
        onClick={handleUpvote}
        aria-label="upvote"
        aria-pressed={currentVote === "liked"}
      >
        <UpvoteIcon width={"16px"} height={"16px"} />
      </button>
      <span className={style.score}>{score}</span>
      <button
        type="button"
        className={style.downvote}
        onClick={handleDownvote}
        aria-label="downvote"
        aria-pressed={currentVote === "disliked"}
      >
        <DownvoteIcon width={"16px"} height={"16px"} />
      </button>
    </div>
  );
}

export default VoteBtn;
