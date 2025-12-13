import { renderHook, act } from "@testing-library/react";
import { usePostsStore } from "../usePostsStore";
import { supabase } from "@/lib/supabase";
import { getPosts } from "@/api/getPosts";
import type { Post } from "@/types/Post";

// Mock de la API getPosts
jest.mock("@/api/getPosts");

// Mock de Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockGetPosts = getPosts as jest.MockedFunction<typeof getPosts>;

describe("usePostsStore", () => {
  beforeEach(() => {
    // Resetear el estado del store antes de cada test
    usePostsStore.setState({
      posts: [],
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe("fetchPosts", () => {
    it("debería inicializar con estado vacío", () => {
      const { result } = renderHook(() => usePostsStore());

      expect(result.current.posts).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("debería manejar fetchPosts exitoso", async () => {
      const mockPosts = [
        { id: 1, titulo: "Post 1" },
        { id: 2, titulo: "Post 2" },
      ];

      mockGetPosts.mockResolvedValue(mockPosts);

      const { result } = renderHook(() => usePostsStore());

      await act(async () => {
        await result.current.fetchPosts();
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("debería manejar error en fetchPosts", async () => {
      const errorMessage = "Error al cargar posts";

      // Limpiar mocks anteriores
      jest.clearAllMocks();
      mockGetPosts.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => usePostsStore());

      await act(async () => {
        await result.current.fetchPosts();
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it("debería establecer isLoading durante fetchPosts", async () => {
      let resolvePromise: (value: Post[]) => void;

      mockGetPosts.mockImplementation(() => {
        return new Promise((resolve) => {
          resolvePromise = resolve;
        });
      });

      const { result } = renderHook(() => usePostsStore());

      act(() => {
        result.current.fetchPosts();
      });

      expect(result.current.isLoading).toBe(true);

      // Resolver la promesa para completar el test
      act(() => {
        resolvePromise!([]);
      });
    });
  });

  describe("createPost", () => {
    const mockPostData = {
      titulo: "Nuevo Post",
      contenido: "Contenido del post",
      categoria_id: "1",
      subcategoria_id: "1",
      usuario_id: "user123",
    };

    it("debería crear post exitosamente sin archivo", async () => {
      const mockNewPost = {
        id: 3,
        ...mockPostData,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockNewPost,
            error: null,
          }),
        }),
      });

      mockSupabase.from = jest.fn().mockReturnValue({
        insert: mockInsert,
      });

      const { result } = renderHook(() => usePostsStore());

      const response = await act(async () => {
        return await result.current.createPost(mockPostData);
      });

      expect(response).toEqual({
        success: true,
        post: mockNewPost,
      });
      expect(result.current.posts).toContainEqual(mockNewPost);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("debería manejar error al crear post", async () => {
      const errorMessage = "Error al crear publicación";

      // Limpiar mocks anteriores
      jest.clearAllMocks();
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: errorMessage },
          }),
        }),
      });

      mockSupabase.from = jest.fn().mockReturnValue({
        insert: mockInsert,
      });

      const { result } = renderHook(() => usePostsStore());

      const response = await act(async () => {
        return await result.current.createPost(mockPostData);
      });

      expect(response).toEqual({
        success: false,
        error: `Error al crear publicación: ${errorMessage}`,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(
        `Error al crear publicación: ${errorMessage}`
      );
    });

    it("debería rechazar archivos que exceden el tamaño máximo", async () => {
      const largeFile = new File(["content"], "large.jpg", {
        type: "image/jpeg",
      });

      // Mock del archivo grande
      Object.defineProperty(largeFile, "size", {
        value: 6 * 1024 * 1024, // 6MB
        writable: false,
      });

      const { result } = renderHook(() => usePostsStore());

      const response = await act(async () => {
        return await result.current.createPost(mockPostData, largeFile);
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain("excede el límite de 5MB");
      expect(result.current.isLoading).toBe(false);
    });

    it("debería subir archivo correctamente", async () => {
      const mockFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      Object.defineProperty(mockFile, "size", {
        value: 1024 * 1024, // 1MB
        writable: false,
      });

      const mockNewPost = {
        id: 3,
        ...mockPostData,
        url_archivo: "mock-url",
        nombre_archivo: "test.jpg",
        extension_archivo: "jpg",
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      // Mock de storage upload
      const mockUpload = jest.fn().mockResolvedValue({
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: "mock-url" },
      });

      // Mock de insert
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockNewPost,
            error: null,
          }),
        }),
      });

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        }),
      } as unknown as jest.Mocked<typeof supabase.storage>;

      mockSupabase.from = jest.fn().mockReturnValue({
        insert: mockInsert,
      });

      const { result } = renderHook(() => usePostsStore());

      const response = await act(async () => {
        return await result.current.createPost(mockPostData, mockFile);
      });

      expect(response.success).toBe(true);
      expect(response.post).toEqual(mockNewPost);
      expect(mockUpload).toHaveBeenCalled();
      expect(mockGetPublicUrl).toHaveBeenCalled();
    });

    it("debería manejar error en upload de archivo", async () => {
      const mockFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      Object.defineProperty(mockFile, "size", {
        value: 1024 * 1024, // 1MB
        writable: false,
      });

      const uploadError = "Error al subir archivo";

      // Mock de storage upload con error
      const mockUpload = jest.fn().mockResolvedValue({
        error: { message: uploadError },
      });

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue({
          upload: mockUpload,
        }),
      } as unknown as jest.Mocked<typeof supabase.storage>;

      const { result } = renderHook(() => usePostsStore());

      const response = await act(async () => {
        return await result.current.createPost(mockPostData, mockFile);
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe(`Error al subir archivo: ${uploadError}`);
    });

    it("debería establecer isLoading durante createPost", async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  data: null,
                  error: null,
                });
              }, 100);
            });
          }),
        }),
      });

      mockSupabase.from = jest.fn().mockReturnValue({
        insert: mockInsert,
      });

      const { result } = renderHook(() => usePostsStore());

      act(() => {
        result.current.createPost(mockPostData);
      });

      expect(result.current.isLoading).toBe(true);
    });
  });
});
