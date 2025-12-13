export interface CreatePostData {
  usuario_id: string;
  categoria_id: string;
  subcategoria_id: string;
  titulo: string;
  contenido: string;
  url_archivo?: string | null;
  nombre_archivo?: string | null;
  extension_archivo?: string | null;
  url_video?: string | null;
}

export interface Like {
  id: string;
  publicacion_id: string;
  usuario_id: string;
  creado_en: string;
}

export interface Comentario {
  id: string;
  publicacion_id: string;
  usuario_id: string;
  contenido: string;
  creado_en: string;
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
  url_video: string | null;
  likes?: Like[];
  comentarios?: Comentario[];
}
