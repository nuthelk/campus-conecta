import { supabase } from "@/lib/supabase";

export const createLike = async (
  publicacion_id: string,
  usuario_id: string
) => {
  const { data, error } = await supabase
    .from("likes")
    .insert({
      publicacion_id,
      usuario_id,
      creado_en: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating like:", error);
    return { success: false, error: error.message };
  }

  return { success: true, like: data };
};

export const deleteLike = async (
  publicacion_id: string,
  usuario_id: string
) => {
  const { error } = await supabase.from("likes").delete().match({
    publicacion_id,
    usuario_id,
  });

  if (error) {
    console.error("Error deleting like:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const createComment = async (
  publicacion_id: string,
  usuario_id: string,
  contenido: string
) => {
  const { data, error } = await supabase
    .from("comentarios")
    .insert({
      publicacion_id,
      usuario_id,
      contenido,
      creado_en: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: error.message };
  }

  return { success: true, comment: data };
};

export const getComments = async (publicacion_id: string) => {
  const { data, error } = await supabase
    .from("comentarios")
    .select("*")
    .eq("publicacion_id", publicacion_id)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data || [];
};

export const getPostLikes = async (publicacion_id: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("publicacion_id", publicacion_id);

  if (error) {
    console.error("Error fetching likes:", error);
    return [];
  }

  return data || [];
};
