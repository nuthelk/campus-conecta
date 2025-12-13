import { useEffect, useState } from "react";
import type { Comentario } from "@/types/Post";
import type { Perfil } from "@/types/User";
import { getUser } from "@/api/getUser";
import { formatTimeAgo } from "../utils/formatTimeAgo";

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

export default CommentItem;
