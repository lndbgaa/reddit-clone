import SavedIcon from "@/assets/images/saved-icon.svg?react";
import UnsavedIcon from "@/assets/images/unsaved-icon.svg?react";
import { saveContent, unsaveContent } from "@/services/api/contentService";
import { ContentType } from "@/types/content";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./SaveBtn.module.css";

interface Props {
  userHasSaved: boolean;
  contentType: ContentType;
  contentId: string;
}

function SaveBtn({ userHasSaved, contentType, contentId }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(userHasSaved);

  const handleSave = async (action: "save" | "unsave") => {
    if (isLoading) return;

    setIsLoading(true);

    const response =
      action === "save"
        ? await saveContent(contentType, contentId)
        : await unsaveContent(contentType, contentId);

    if (response) {
      setIsSaved((prev) => !prev);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <button
      type="button"
      className={classNames(styles.container, {
        [styles.savePostBtn]: contentType === "post",
        [styles.saveCommentBtn]: contentType === "comment",
        [styles.isLoading]: isLoading,
        [styles.hasError]: error,
      })}
      disabled={isLoading}
      onClick={isSaved ? () => handleSave("unsave") : () => handleSave("save")}
      aria-label={isSaved ? "unsave" : "save"}
      aria-disabled={isLoading}
    >
      {isSaved ? <SavedIcon width="24px" height="24px" /> : <UnsavedIcon width="24px" height="24px" />}

      <span>{isSaved ? "Remove from saved" : "Save"}</span>
    </button>
  );
}

export default SaveBtn;
