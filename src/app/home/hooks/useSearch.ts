import { useState, useEffect, useMemo } from "react";
import { usePostsStore } from "@/stores/usePostsStore";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { posts, fetchPosts } = usePostsStore();

  // Cargar posts cuando se inicia la búsqueda por primera vez
  useEffect(() => {
    if (posts.length === 0 && searchTerm.length > 0) {
      fetchPosts();
    }
  }, [searchTerm, posts.length, fetchPosts]);

  // Filtrar posts basado en el término de búsqueda
  const { filteredPosts, isSearching } = useMemo(() => {
    if (searchTerm.trim() === "") {
      return {
        filteredPosts: [],
        isSearching: false,
      };
    }

    const filtered = posts.filter((post) =>
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      filteredPosts: filtered,
      isSearching: true,
    };
  }, [searchTerm, posts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    filteredPosts,
    isSearching,
    handleSearchChange,
    clearSearch,
  };
};
