import { useState } from "react";
import { createComment } from "@/api/likeComment";
import { toast } from "sonner";

export const useCommentSubmit = (
  postId: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCommentAdded: (comment: any) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async (commentText: string) => {
    if (!commentText.trim() || isSubmitting) return false;

    setIsSubmitting(true);

    try {
      const result = await createComment(postId, userId, commentText.trim());

      if (result.success && result.comment) {
        onCommentAdded(result.comment);
        toast.success("Comentario publicado");
        return true;
      } else {
        toast.error("Error al publicar comentario");
        return false;
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Error al publicar comentario");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitComment, isSubmitting };
};
