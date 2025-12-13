import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { getPosts } from "@/api/getPosts";
import type { CreatePostData, Post } from "@/types/Post";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (
    data: CreatePostData,
    file?: File | null
  ) => Promise<{ success: boolean; error?: string; post?: Post }>;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await getPosts();
      set({ posts, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createPost: async (data: CreatePostData, file?: File | null) => {
    set({ isLoading: true, error: null });

    try {
      let url_archivo: string | null = null;
      let nombre_archivo: string | null = null;
      let extension_archivo: string | null = null;

      // Upload file if provided
      if (file) {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          set({ isLoading: false });
          return {
            success: false,
            error: `El archivo excede el límite de 5MB. Tamaño actual: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB`,
          };
        }

        const fileExt = file.name.split(".").pop() || "";
        const fileName = `${data.usuario_id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(fileName, file);

        if (uploadError) {
          set({ isLoading: false });
          return {
            success: false,
            error: `Error al subir archivo: ${uploadError.message}`,
          };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("files")
          .getPublicUrl(fileName);

        url_archivo = urlData.publicUrl;
        nombre_archivo = file.name;
        extension_archivo = fileExt;
      }

      // Create post in database
      const { data: post, error: insertError } = await supabase
        .from("publicaciones")
        .insert({
          ...data,
          url_archivo,
          nombre_archivo,
          extension_archivo,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        set({
          isLoading: false,
          error: `Error al crear publicación: ${insertError.message}`,
        });
        return {
          success: false,
          error: `Error al crear publicación: ${insertError.message}`,
        };
      }

      set((state) => ({
        posts: [post, ...state.posts],
        isLoading: false,
      }));

      return { success: true, post };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
}));

export const MAX_FILE_SIZE_MB = 5;
