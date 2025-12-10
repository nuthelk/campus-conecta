export interface CreatePostData {
  usuario_id: string;
  categoria_id: string;
  subcategoria_id: string;
  titulo: string;
  contenido: string;
  url_archivo?: string | null;
  nombre_archivo?: string | null;
  extension_archivo?: string | null;
}

export interface Post {
  id: string;
  usuario_id: string;
  categoria_id: string;
  subcategoria_id: string;
  titulo: string;
  contenido: string;
  url_archivo: string | null;
  nombre_archivo: string | null;
  extension_archivo: string | null;
  creado_en: string;
  actualizado_en: string;
}
