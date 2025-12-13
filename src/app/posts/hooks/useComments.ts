import { useState, useEffect } from "react";
import { getComments } from "@/api/likeComment";
import type { Comentario } from "@/types/Post";

export const useComments = (postId: string, isOpen: boolean) => {
  const [comments, setComments] = useState<Comentario[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (isOpen) {
        const commentsData = await getComments(postId);
        setComments(commentsData);
      }
    };
    fetchComments();
  }, [isOpen, postId]);

  const addComment = (newComment: Comentario) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  return { comments, addComment };
};
