import {
  X,
  Heart,
  MessageCircle,
  Send,
  StickyNote,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Post, Comentario } from "@/types/Post";
import type { Perfil } from "@/types/User";
import { getUser } from "@/api/getUser";

type Props = {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
};

const PostModal = ({ post, isOpen, onClose }: Props) => {
  const [user, setUser] = useState<Perfil | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(post.usuario_id);
      setUser(user[0]);
    };
    fetchUser();
  }, [post.usuario_id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const isImageFile = (url: string, extension?: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const urlLower = url.toLowerCase();

    if (extension) {
      return imageExtensions.includes(extension.toLowerCase());
    }

    return imageExtensions.some((ext) => urlLower.includes(`.${ext}`));
  };

  const formatTimeAgo = (dateString: string) => {
    let date: Date;

    if (typeof dateString === "string") {
      const normalizedDate = dateString.replace(" ", "T");
      date = new Date(normalizedDate);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return "Reciente";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const absDiffMs = Math.abs(diffMs);

    const diffSecs = Math.floor(absDiffMs / 1000);
    const diffMins = Math.floor(absDiffMs / 60000);
    const diffHours = Math.floor(absDiffMs / 3600000);
    const diffDays = Math.floor(absDiffMs / 86400000);

    if (diffSecs < 60) {
      return `${diffSecs}s`;
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // TODO: Implement comment submission logic
    console.log("Submitting comment:", commentText);
    setCommentText("");
  };

  return (
    <div className="fixed w-[70%] m-auto shadow rounded-2xl  h-[90%] inset-0 z-[9999] flex">
      {/* Backdrop con blur */}

      {/* Modal - Full Screen */}
      <div className="relative w-full h-full shadow rounded-2xl flex flex-col lg:flex-row bg-white overflow-hidden">
        {/* Left Side - Post Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            {post.url_video && isYouTubeUrl(post.url_video) && (
              <div className="rounded-[10px] overflow-hidden mb-6">
                <div className="relative pt-[56.25%] bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      post.url_video
                    )}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    onLoad={() => setIsVideoLoaded(true)}
                  />
                  {!isVideoLoaded && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6400A9]"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {post.url_archivo &&
              isImageFile(post.url_archivo, post?.extension_archivo) && (
                <div className="rounded-[10px] overflow-hidden mb-6">
                  <img
                    src={post.url_archivo}
                    alt={post.nombre_archivo || "Imagen adjunta"}
                    className="w-full h-auto object-contain max-h-[600px] mx-auto"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  {!isImageLoaded && (
                    <div className="flex items-center justify-center bg-gray-100 h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6400A9]"></div>
                    </div>
                  )}
                </div>
              )}

            {post.url_archivo &&
              !isImageFile(post.url_archivo, post?.extension_archivo) && (
                <Archive
                  name={post.nombre_archivo || "Archivo adjunto"}
                  url={post.url_archivo}
                  extension={post.extension_archivo!}
                />
              )}

            {/* Stats */}
            <div className="flex items-center gap-4 py-4 border-y">
              <div className="flex items-center gap-2 text-[#928A9C]">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">
                  {post.comentarios?.length || 0}
                </span>
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
            {post.comentarios && post.comentarios.length > 0 ? (
              <div className="space-y-4">
                {post.comentarios.map((comentario) => (
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
                disabled={!commentText.trim()}
                className="p-2 bg-[#6400A9] text-white rounded-full hover:bg-[#520087] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

type CommentItemProps = {
  comentario: Comentario;
};

const CommentItem = ({ comentario }: CommentItemProps) => {
  const [user, setUser] = useState<Perfil | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(comentario.usuario_id);
      setUser(userData[0]);
    };
    fetchUser();
  }, [comentario.usuario_id]);

  const formatTimeAgo = (dateString: string) => {
    let date: Date;

    if (typeof dateString === "string") {
      const normalizedDate = dateString.replace(" ", "T");
      date = new Date(normalizedDate);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return "Reciente";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const absDiffMs = Math.abs(diffMs);

    const diffSecs = Math.floor(absDiffMs / 1000);
    const diffMins = Math.floor(absDiffMs / 60000);
    const diffHours = Math.floor(absDiffMs / 3600000);

    if (diffSecs < 60) {
      return `${diffSecs}s`;
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `hace ${Math.floor(diffHours / 24)}d`;
    }
  };

  return (
    <div className="flex gap-3">
      <div className="rounded-full border-2 border-[#6400A9] w-10 h-10 overflow-hidden flex-shrink-0">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={`${user.nombre} ${user.apellido}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6400A9] to-[#4F82C0] flex items-center justify-center text-white text-xs font-semibold">
            {user?.nombre?.charAt(0)}
            {user?.apellido?.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="bg-[#F6F5FF] rounded-2xl px-4 py-2">
          <p className="font-semibold text-[#1B003A] text-sm">
            {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
          </p>
          <p className="text-[#1B003A] text-sm mt-1">{comentario.contenido}</p>
        </div>
        <span className="text-xs text-[#928A9C] ml-4 mt-1 inline-block">
          {formatTimeAgo(comentario.creado_en)}
        </span>
      </div>
    </div>
  );
};

interface ArchiveProps {
  name: string;
  url: string;
  extension?: string;
}

const Archive = ({ name, url, extension }: ArchiveProps) => {
  const handleDownload = () => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="rounded-[10px] bg-[#4F82C0] max-w-[300px] p-3 flex items-center gap-2 justify-between cursor-pointer hover:bg-[#3a6ba8] transition-colors mb-6"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-2">
        <StickyNote size={30} className="text-white" />
        <div className="flex flex-col">
          <p className="text-white font-semibold text-base truncate max-w-[200px]">
            {name}
          </p>
          {extension && (
            <p className="text-white/80 text-xs">.{extension.toLowerCase()}</p>
          )}
        </div>
      </div>
      <Download className="text-white" />
    </div>
  );
};

export default PostModal;
