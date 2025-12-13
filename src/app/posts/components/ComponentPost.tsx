import { Download, StickyNote, MessageCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post } from "@/types/Post";
import { getUser } from "@/api/getUser";
import type { Perfil } from "@/types/User";
import CollapsibleText from "@/components/CollapsibleText";

type Props = {
  post: Post;
};

const ComponentPost = ({ post }: Props) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [user, setUser] = useState<Perfil | null>(null);

  // Función para extraer el ID de YouTube de una URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Detectar si es una URL de YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Detectar si es una imagen por extensión
  const isImageFile = (url: string, extension?: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const urlLower = url.toLowerCase();

    if (extension) {
      return imageExtensions.includes(extension.toLowerCase());
    }

    return imageExtensions.some((ext) => urlLower.includes(`.${ext}`));
  };

  // Formatear fecha relativa
  const formatTimeAgo = (dateString: string) => {
    // Parse the date string correctly, handling different formats
    let date: Date;

    // Attempt to create a date object more reliably
    if (typeof dateString === "string") {
      // Normalize the date string to ensure proper parsing
      const normalizedDate = dateString.replace(" ", "T"); // Convert space separator to T
      date = new Date(normalizedDate);
    } else {
      date = new Date(dateString);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Fecha inválida:", dateString);
      return "Reciente";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Convert to positive value to avoid negative differences due to timezone issues
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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(post.usuario_id);
      setUser(user[0]);
    };
    fetchUser();
  }, []);

  return (
    <div className="p-5 rounded-[10px] drop-shadow bg-[#F6F5FF] max-w-[900px] mb-4">
      {/* Header del post */}
      <div className="flex items-start gap-4 mb-4">
        <div className="rounded-full border-2 border-[#6400A9] w-12 h-12 overflow-hidden flex-shrink-0">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.nombre} ${user.apellido}`}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6400A9] to-[#4F82C0] flex items-center justify-center text-white font-semibold">
              {user?.nombre?.charAt(0)}
              {user?.apellido?.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4 ">
            <p className="text-[#1B003A] font-semibold text-sm">
              {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
            </p>
            <span className="text-[#928A9C] font-normal text-sm">
              - {formatTimeAgo(post.creado_en)}
            </span>
          </div>
          <div className="flex items-center gap-2 ">
            <h3 className="text-[#1B003A] font-semibold text-lg ">
              {post.titulo}
            </h3>
          </div>
          <CollapsibleText
            text={post.contenido}
            maxLength={150}
            className="mt-2"
          />
        </div>
      </div>

      {/* Contenido multimedia */}
      <div className="space-y-3 ml-16">
        {/* Preview de YouTube */}
        {post.url_video && isYouTubeUrl(post.url_video) && (
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative pt-[56.25%] bg-black rounded-t-[10px]">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(
                  post.url_video
                )}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-t-[10px]"
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

        {/* Imagen adjunta */}
        {post.url_archivo &&
          isImageFile(post.url_archivo, post?.extension_archivo) && (
            <div className="rounded-[10px] overflow-hidden border border-gray-200">
              <div className="relative">
                <div className="aspect-video rounded-[10px] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={post.url_archivo}
                    alt={post.nombre_archivo || "Imagen adjunta"}
                    className="w-full h-full rounded-[10px] object-contain max-h-[400px]"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-full h-64 flex flex-col items-center justify-center bg-gray-100 text-gray-400";
                        fallback.innerHTML = `
                        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Error al cargar la imagen</span>
                      `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6400A9]"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Archivo no imagen */}
        {post.url_archivo &&
          !isImageFile(post.url_archivo, post?.extension_archivo) && (
            <Archive
              name={post.nombre_archivo || "Archivo adjunto"}
              url={post.url_archivo}
              extension={post.extension_archivo!}
            />
          )}
      </div>
      <div className="flex items-center gap-3 mt-4 justify-end">
        <div className="cursor-pointer hover:bg-[#e8e6fc] p-2 rounded-full flex items-center gap-1">
          <Heart size={23} />
          {post.likes && post.likes.length > 0 && (
            <span className="text-sm text-[#1B003A] font-medium">
              {post.likes.length}
            </span>
          )}
        </div>
        <div className="cursor-pointer hover:bg-[#e8e6fc] p-2 rounded-full flex items-center gap-1">
          <MessageCircle size={20} />
          {post.comentarios && post.comentarios.length > 0 && (
            <span className="text-sm text-[#1B003A] font-medium">
              {post.comentarios.length}
            </span>
          )}
        </div>
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
      className="rounded-[10px] bg-[#4F82C0] max-w-[300px] p-3 flex items-center gap-2 justify-between cursor-pointer hover:bg-[#3a6ba8] transition-colors"
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

export default ComponentPost;
