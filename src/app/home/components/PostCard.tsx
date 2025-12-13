import { MessageCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post } from "@/types/Post";
import { getUser } from "@/api/getUser";
import { supabase } from "@/lib/supabase";
import type { Perfil } from "@/types/User";
import { formatTimeAgo } from "@/app/posts/utils/formatTimeAgo";
import { renderCategoryIcon } from "@/lib/iconMap";
import { getColorValue } from "@/lib/colorMap";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useSubcategoriesStore } from "@/stores/useSubcategoriesStore";

type Props = {
  post: Post;
  onOpenModal: (post: Post) => void;
};

const PostCard = ({ post, onOpenModal }: Props) => {
  const [user, setUser] = useState<Perfil | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const { getCategoryById } = useCategoriesStore();
  const { getSubcategoryById } = useSubcategoriesStore();

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
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Verificar si el usuario actual ya le dio like a este post
        const userLiked = post.likes?.some(
          (like) => like.usuario_id === user.id
        );
        setIsLiked(userLiked || false);
      }
    };
    getCurrentUser();
  }, [post.likes]);

  const handleCardClick = () => {
    onOpenModal(post);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
      onClick={handleCardClick}
    >
      {/* Header con avatar y usuario */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-full border-2 border-[#6400A9] w-8 h-8 overflow-hidden flex-shrink-0">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.nombre} ${user.apellido}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#6400A9] to-[#4F82C0] flex items-center justify-center text-white font-semibold text-xs">
                {user?.nombre?.charAt(0)}
                {user?.apellido?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#1B003A] font-semibold text-xs truncate">
              {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
            </p>
            <span className="text-[#928A9C] font-normal text-xs">
              {formatTimeAgo(post.creado_en)}
            </span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-[#1B003A] font-bold text-sm line-clamp-2 mb-2">
          {post.titulo}
        </h3>

        {/* Categoría y Subcategoría */}
        {category && (
          <div className="flex flex-wrap gap-1 mb-2">
            <div
              className="rounded-full px-2 py-0.5 flex items-center gap-1"
              style={{ backgroundColor: getColorValue(category.color) }}
            >
              <div className="bg-white/20 p-0.5 rounded-full">
                {renderCategoryIcon(category.icono, 10)}
              </div>
              <span className="font-medium text-white text-xs">
                {category.nombre}
              </span>
            </div>

            {subcategory && (
              <div className="bg-gray-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                <div className="bg-gray-200 p-0.5 rounded-full">
                  {renderCategoryIcon(subcategory.icono, 10)}
                </div>
                <span className="font-medium text-gray-700 text-xs">
                  {subcategory.nombre}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Contenido truncado */}
        <p className="text-gray-600 text-xs line-clamp-3 mb-3">
          {post.contenido}
        </p>
      </div>

      {/* Footer con interacciones */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart
                size={16}
                fill={isLiked ? "#6400A9" : "none"}
                className={isLiked ? "text-[#6400A9]" : "text-gray-500"}
              />
              {post.likes && post.likes.length > 0 && (
                <span className="text-xs text-gray-600">
                  {post.likes.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} className="text-gray-500" />
              {post.comentarios && post.comentarios.length > 0 && (
                <span className="text-xs text-gray-600">
                  {post.comentarios.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decoración hover */}
      <div className="absolute inset-0 bg-[#4F82C0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default PostCard;
