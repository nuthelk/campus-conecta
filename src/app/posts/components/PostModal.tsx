import { X, Heart, MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";
import type { Post } from "@/types/Post";
import type { Perfil } from "@/types/User";
import { getUser } from "@/api/getUser";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { useAuthUser } from "../hooks/useAuthUser";
import { useComments } from "../hooks/useComments";
import { useCommentSubmit } from "../hooks/useCommentSubmit";
import { useBodyScroll } from "../hooks/useBodyScroll";
import CommentItem from "./CommentItem";
import PostMedia from "./PostMedia";

type Props = {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
};

const PostModal = ({ post, isOpen, onClose }: Props) => {
  const [user, setUser] = useState<Perfil | null>(null);
  const [commentText, setCommentText] = useState("");

  const currentUser = useAuthUser();
  const { comments, addComment } = useComments(post.id, isOpen);
  const { submitComment, isSubmitting } = useCommentSubmit(
    post.id,
    currentUser?.id || "",
    addComment
  );

  useBodyScroll(isOpen);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(post.usuario_id);
      setUser(user[0]);
    };
    fetchUser();
  }, [post.usuario_id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitComment(commentText);
    if (success) {
      setCommentText("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-[70%] m-auto shadow rounded-2xl  h-[90%] inset-0 z-[9999] flex">
      {/* Modal - Full Screen */}
      <div className="relative w-full h-full shadow rounded-2xl flex flex-col lg:flex-row bg-white overflow-hidden">
        {/* Left Side - Post Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 bg-white z-10 px-4 py-[10px] border-b flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
            >
              <X size={24} className="text-[#1B003A]" />
            </button>
          </div>

          <div className="p-6 max-w-[800px] mx-auto">
            {/* Post Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-full border-2 border-[#6400A9] w-12 h-12 overflow-hidden flex-shrink-0">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.nombre} ${user.apellido}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#6400A9] to-[#4F82C0] flex items-center justify-center text-white font-semibold">
                    {user?.nombre?.charAt(0)}
                    {user?.apellido?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[#1B003A] font-semibold text-base">
                    {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
                  </p>
                  <span className="text-[#928A9C] font-normal text-sm">
                    - {formatTimeAgo(post.creado_en)}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-[#1B003A] font-bold text-2xl mb-4">
              {post.titulo}
            </h3>
            <p className="text-[#1B003A] text-base leading-relaxed mb-6">
              {post.contenido}
            </p>

            {/* Media Content */}
            <PostMedia
              url_archivo={post.url_archivo}
              nombre_archivo={post.nombre_archivo}
              extension_archivo={post.extension_archivo}
              url_video={post.url_video}
            />

            {/* Stats */}
            <div className="flex items-center gap-4 py-4 border-y">
              <div className="flex items-center gap-2 text-[#928A9C]">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{comments.length}</span>
              </div>
              <div className="flex items-center gap-2 text-[#928A9C]">
                <Heart size={20} />
                <span className="text-sm font-medium">
                  {post.likes?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Comments */}
        <div className="lg:w-[450px] border-l flex flex-col bg-white">
          <div className="p-4 border-b">
            <h4 className="font-semibold text-[#1B003A] text-lg">
              Comentarios
            </h4>
          </div>

          {/* Comments List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comentario) => (
                  <CommentItem key={comentario.id} comentario={comentario} />
                ))}
              </div>
            ) : (
              <p className="text-[#928A9C] text-sm text-center py-8">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            )}
          </div>

          {/* Comment Input - Fixed at bottom */}
          <div className="border-t p-4 bg-white">
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#6400A9] text-sm"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="p-2 bg-[#6400A9] text-white rounded-full hover:bg-[#520087] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
