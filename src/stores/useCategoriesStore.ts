import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Category, CategoryDB } from '@/types/Category';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('categorias')
      .select('id, nombre, icono, color')
      .order('nombre');

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    const categories: Category[] = (data as CategoryDB[]).map((cat) => ({
      id: cat.id,
      nombre: cat.nombre,
      icono: cat.icono,
      color: cat.color,
    }));

    set({ categories, isLoading: false });
  },

  getCategoryById: (id: string) => {
    return get().categories.find((cat) => cat.id === id);
  },
}));
