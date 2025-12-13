import { useState, useEffect, useMemo } from "react";
import { usePostsStore } from "@/stores/usePostsStore";
import type { Post } from "@/types/Post";
import type { Category } from "@/types/Category";

export const useCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { posts, fetchPosts } = usePostsStore();

  // Cargar posts cuando se selecciona una categoría por primera vez
  useEffect(() => {
    if (posts.length === 0 && selectedCategory) {
      fetchPosts();
    }
  }, [selectedCategory, posts.length, fetchPosts]);

  // Filtrar posts basado en la categoría seleccionada
  const { filteredPosts, isFiltering } = useMemo(() => {
    if (selectedCategory) {
      const filtered = posts.filter(
        (post) => post.categoria_id === selectedCategory.id
      );
      return {
        filteredPosts: filtered,
        isFiltering: true,
      };
    } else {
      return {
        filteredPosts: [],
        isFiltering: false,
      };
    }
  }, [selectedCategory, posts]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  return {
    selectedCategory,
    filteredPosts,
    isFiltering,
    handleCategoryClick,
    clearCategoryFilter,
  };
};
