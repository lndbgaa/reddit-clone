import SavedIcon from "@/assets/images/saved-icon.svg?react";
import UnsavedIcon from "@/assets/images/unsaved-icon.svg?react";
import { saveContent, unsaveContent } from "@/services/api/contentService";
import { ContentType } from "@/types/content";
import { useState } from "react";
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

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const response = await saveContent(contentType, contentId);

    if (response) {
      setIsSaved(true);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  const handleUnsave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const response = await unsaveContent(contentType, contentId);

    if (response) {
      setIsSaved(false);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  return isSaved ? (
    <button type="button" className={styles.container} aria-label="unsave" onClick={handleUnsave}>
      <SavedIcon width="24px" height="24px" />
    </button>
  ) : (
    <button type="button" className={styles.container} aria-label="save" onClick={handleSave}>
      <UnsavedIcon width="24px" height="24px" />
    </button>
  );
}

export default SaveBtn;
