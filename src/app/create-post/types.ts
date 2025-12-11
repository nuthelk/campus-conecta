export type MediaType = 'file' | 'image' | 'video' | null;

export interface PostFormData {
    titulo: string;
    contenido: string;
    categoria_id: string | null;
    subcategoria_id: string | null;
    videoUrl: string;
    mediaType: MediaType;
    file: File | null;
}

export const initialFormData: PostFormData = {
    titulo: '',
    contenido: '',
    categoria_id: null,
    subcategoria_id: null,
    videoUrl: '',
    mediaType: null,
    file: null,
};
