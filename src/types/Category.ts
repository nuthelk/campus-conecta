// Raw category from Supabase
export interface CategoryDB {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  creado_en: string;
}

// Category with resolved icon for UI
export interface Category {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

// Raw subcategory from Supabase
export interface SubcategoryDB {
  id: string;
  nombre: string;
  icono: string;
  creado_en: string;
}

// Subcategory for UI
export interface Subcategory {
  id: string;
  nombre: string;
  icono: string;
}
