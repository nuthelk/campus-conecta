import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../useSearch";
import { usePostsStore } from "@/stores/usePostsStore";

// Mock del store de posts
jest.mock("@/stores/usePostsStore", () => ({
  usePostsStore: jest.fn(),
}));

const mockUsePostsStore = usePostsStore as jest.MockedFunction<
  typeof usePostsStore
>;

describe("useSearch", () => {
  const mockFetchPosts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsStore.mockReturnValue({
      posts: [],
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);
  });

  it("debería inicializar con searchTerm vacío", () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredPosts).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("debería actualizar searchTerm cuando se llama handleSearchChange", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("test query");
    });

    expect(result.current.searchTerm).toBe("test query");
  });

  it("debería limpiar searchTerm cuando se llama clearSearch", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("test query");
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe("");
  });

  it("debería llamar a fetchPosts cuando hay término de búsqueda y no hay posts", () => {
    mockUsePostsStore.mockReturnValue({
      posts: [],
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("test");
    });

    expect(mockFetchPosts).toHaveBeenCalled();
  });

  it("no debería llamar a fetchPosts cuando ya hay posts", () => {
    const mockPosts = [
      { id: 1, titulo: "Post de prueba" },
      { id: 2, titulo: "Otro post" },
    ];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("test");
    });

    expect(mockFetchPosts).not.toHaveBeenCalled();
  });

  it("debería filtrar posts por título", () => {
    const mockPosts = [
      { id: 1, titulo: "React Tutorial" },
      { id: 2, titulo: "Vue Guide" },
      { id: 3, titulo: "React Hooks" },
    ];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("React");
    });

    expect(result.current.filteredPosts).toHaveLength(2);
    expect(result.current.filteredPosts[0].titulo).toBe("React Tutorial");
    expect(result.current.filteredPosts[1].titulo).toBe("React Hooks");
  });

  it("debería ser case insensitive en la búsqueda", () => {
    const mockPosts = [
      { id: 1, titulo: "React Tutorial" },
      { id: 2, titulo: "VUE GUIDE" },
    ];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("react");
    });

    expect(result.current.filteredPosts).toHaveLength(1);
    expect(result.current.filteredPosts[0].titulo).toBe("React Tutorial");

    act(() => {
      result.current.handleSearchChange("vue");
    });

    expect(result.current.filteredPosts).toHaveLength(1);
    expect(result.current.filteredPosts[0].titulo).toBe("VUE GUIDE");
  });

  it("debería retornar array vacío cuando searchTerm está vacío", () => {
    const mockPosts = [
      { id: 1, titulo: "React Tutorial" },
      { id: 2, titulo: "Vue Guide" },
    ];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("React");
    });

    expect(result.current.filteredPosts).toHaveLength(1);
    expect(result.current.isSearching).toBe(true);

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.filteredPosts).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("debería manejar espacios en blanco en searchTerm", () => {
    const mockPosts = [{ id: 1, titulo: "React Tutorial" }];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearchChange("   ");
    });

    expect(result.current.filteredPosts).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("debería actualizar isSearching correctamente", () => {
    const mockPosts = [{ id: 1, titulo: "React Tutorial" }];

    mockUsePostsStore.mockReturnValue({
      posts: mockPosts,
      fetchPosts: mockFetchPosts,
    } as ReturnType<typeof usePostsStore>);

    const { result } = renderHook(() => useSearch());

    // Inicialmente no está buscando
    expect(result.current.isSearching).toBe(false);

    // Al poner un término de búsqueda, está buscando
    act(() => {
      result.current.handleSearchChange("React");
    });

    expect(result.current.isSearching).toBe(true);

    // Al limpiar, deja de buscar
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.isSearching).toBe(false);
  });
});
