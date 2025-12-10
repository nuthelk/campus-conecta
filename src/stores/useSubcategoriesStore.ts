import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Subcategory, SubcategoryDB } from '@/types/Category';

interface SubcategoriesState {
  subcategories: Subcategory[];
  isLoading: boolean;
  error: string | null;
  fetchSubcategories: () => Promise<void>;
  getSubcategoryById: (id: string) => Subcategory | undefined;
}

export const useSubcategoriesStore = create<SubcategoriesState>((set, get) => ({
  subcategories: [],
  isLoading: false,
  error: null,

  fetchSubcategories: async () => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('subcategorias')
      .select('id, nombre, icono')
      .order('nombre');

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    const subcategories: Subcategory[] = (data as SubcategoryDB[]).map((sub) => ({
      id: sub.id,
      nombre: sub.nombre,
      icono: sub.icono,
    }));

    set({ subcategories, isLoading: false });
  },

  getSubcategoryById: (id: string) => {
    return get().subcategories.find((sub) => sub.id === id);
  },
}));
