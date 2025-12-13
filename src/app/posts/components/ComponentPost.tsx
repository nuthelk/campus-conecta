import { MessageCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post } from "@/types/Post";
import { getUser } from "@/api/getUser";
import { createLike, deleteLike } from "@/api/likeComment";
import { supabase } from "@/lib/supabase";
import type { Perfil } from "@/types/User";
import CollapsibleText from "@/components/CollapsibleText";
import { toast } from "sonner";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { getYouTubeId, isYouTubeUrl, isImageFile } from "../utils/mediaUtils";
import Archive from "./Archive";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useSubcategoriesStore } from "@/stores/useSubcategoriesStore";
import { renderCategoryIcon } from "@/lib/iconMap";
import { getColorValue } from "@/lib/colorMap";

type Props = {
  post: Post;
  onOpenModal: () => void;
  onOpenProfile?: (profile: Perfil | null) => void;
};

const ComponentPost = ({ post, onOpenModal, onOpenProfile }: Props) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [user, setUser] = useState<Perfil | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { categories, getCategoryById, fetchCategories } = useCategoriesStore();
  const { subcategories, getSubcategoryById, fetchSubcategories } =
    useSubcategoriesStore();

  const category = getCategoryById(post.categoria_id);
  const subcategory = getSubcategoryById(post.subcategoria_id);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(post.usuario_id);
      setUser(user[0]);
    };
    fetchUser();
  }, [post.usuario_id]);

  useEffect(() => {
    // Cargar categorías y subcategorías si no están cargadas
    if (categories.length === 0) {
      fetchCategories();
    }
    if (subcategories.length === 0) {
      fetchSubcategories();
    }
  }, [
    categories.length,
    subcategories.length,
    fetchCategories,
    fetchSubcategories,
  ]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        // Verificar si el usuario actual ya le dio like a este post
        const userLiked = likes.some((like) => like.usuario_id === user.id);
        setIsLiked(userLiked);
      }
    };
    getCurrentUser();
  }, [likes]);

  const handleLike = async () => {
    if (!currentUser || isLiking) return;

    setIsLiking(true);

    try {
      if (isLiked) {
        // Quitar like
        const result = await deleteLike(post.id, currentUser.id);
        if (result.success) {
          setLikes(likes.filter((like) => like.usuario_id !== currentUser.id));
          setIsLiked(false);
          toast.success("Like eliminado");
        } else {
          toast.error("Error al eliminar like");
        }
      } else {
        // Dar like
        const result = await createLike(post.id, currentUser.id);
        if (result.success && result.like) {
          setLikes([...likes, result.like]);
          setIsLiked(true);
          toast.success("Like agregado");
        } else {
          toast.error("Error al agregar like");
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Error al procesar like");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="p-5 rounded-[10px] drop-shadow bg-[#F6F5FF] max-w-[700px] mb-4">
      {/* Header del post */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="rounded-full border-2 border-[#6400A9] w-12 h-12 overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => user && onOpenProfile && onOpenProfile(user)}
        >
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
          <div className="flex justify-between items-center gap-2 ">
            <div className="flex items-center gap-2">
              <p
                className="text-[#1B003A] font-semibold text-sm cursor-pointer hover:text-[#6400A9] transition-colors"
                onClick={() => user && onOpenProfile && onOpenProfile(user)}
              >
                {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
              </p>
              <span className="text-[#928A9C] font-normal text-sm">
                - {formatTimeAgo(post.creado_en)}
              </span>
            </div>
            {/* Categoría y Subcategoría */}
            {category && (
              <div className="flex flex-wrap gap-2 mb-3">
                <div
                  className="group relative overflow-hidden rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ backgroundColor: getColorValue(category.color) }}
                >
                  <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                    {renderCategoryIcon(category.icono, 16)}
                  </div>
                  <span className="font-medium text-white text-sm drop-shadow-sm">
                    {category.nombre}
                  </span>
                </div>

                {subcategory && (
                  <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="bg-gray-200 p-1 rounded-full">
                      {renderCategoryIcon(subcategory.icono, 16)}
                    </div>
                    <span className="font-medium text-gray-700 text-sm">
                      {subcategory.nombre}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-[#1B003A] font-semibold text-lg">
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
          isImageFile(
            post.url_archivo,
            post?.extension_archivo || undefined
          ) && (
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
          !isImageFile(
            post.url_archivo,
            post?.extension_archivo || undefined
          ) && (
            <Archive
              name={post.nombre_archivo || "Archivo adjunto"}
              url={post.url_archivo}
              extension={post.extension_archivo!}
            />
          )}
      </div>
      <div className="flex items-center gap-3 mt-4 justify-end">
        <div
          className={`cursor-pointer p-2 rounded-full flex items-center gap-1 transition-colors ${
            isLiked ? "bg-[#e8e6fc] text-[#6400A9]" : "hover:bg-[#e8e6fc]"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={isLiking ? undefined : handleLike}
        >
          <Heart size={23} fill={isLiked ? "#6400A9" : "none"} />
          {likes.length > 0 && (
            <span className="text-sm text-[#1B003A] font-medium">
              {likes.length}
            </span>
          )}
        </div>
        <div
          className="cursor-pointer hover:bg-[#e8e6fc] p-2 rounded-full flex items-center gap-1"
          onClick={onOpenModal}
        >
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

export default ComponentPost;
