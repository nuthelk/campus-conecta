import { X, Mail, Calendar } from "lucide-react";
import type { Perfil } from "@/types/User";
import { getPosts } from "@/api/getPosts";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Props = {
  user: Perfil | null;
  isOpen: boolean;
  onClose: () => void;
};

const UserProfileSlider = ({ user, isOpen, onClose }: Props) => {
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        // Obtener posts del usuario
        const allPosts = await getPosts();
        const userPosts = allPosts.filter(
          (post) => post.usuario_id === user.id
        );
        setPostsCount(userPosts.length);

        // Obtener comentarios del usuario
        const { data: comments } = await supabase
          .from("comentarios")
          .select("id")
          .eq("usuario_id", user.id);

        setCommentsCount(comments?.length || 0);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [user]);

  // Formatear fecha a dd/mm/yyyy
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "fecha desconocida";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[10000] transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6400A9] to-[#4F82C0] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="flex flex-col items-center">
            {/* Avatar Grande */}
            <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mb-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.nombre} ${user.apellido}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/30 flex items-center justify-center text-white font-bold text-2xl">
                  {user.nombre?.charAt(0)}
                  {user.apellido?.charAt(0)}
                </div>
              )}
            </div>

            <h2 className="text-white font-bold text-xl mb-1">
              {user.nombre} {user.apellido}
            </h2>
            <div className="text-white/90 text-sm text-center px-4">
              {user.universidad && <p>{user.universidad}</p>}
              {user.carrera && <p>{user.carrera}</p>}
              {user.semestre && <p>Semestre {user.semestre}</p>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información de Contacto */}
          <div>
            <h3 className="font-semibold text-[#1B003A] mb-3">
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} />
                <span className="text-sm">
                  {user.correo || "No disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div>
            <h3 className="font-semibold text-[#1B003A] mb-3">
              Información Personal
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} />
                <span className="text-sm">
                  Miembro desde {formatDate(user.creado_en)}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <h3 className="font-semibold text-[#1B003A] mb-3">Actividad</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-[#6400A9]">
                  {postsCount}
                </div>
                <div className="text-xs text-gray-600">Publicaciones</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-[#4F82C0]">
                  {commentsCount}
                </div>
                <div className="text-xs text-gray-600">Comentarios</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSlider;
