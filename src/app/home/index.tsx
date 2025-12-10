import { useEffect } from "react";
import { Search, GraduationCap, Loader2 } from "lucide-react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { renderCategoryIcon } from "@/lib/iconMap";

const Home = () => {
  const { categories, isLoading, error, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar temas, tareas, preguntas..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#4F82C0] shadow-sm bg-white text-gray-700 placeholder-gray-400 transition-all text-lg"
          />
        </div>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1b4b] mb-8">Selecciona una categoría</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#4F82C0]" size={48} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20 text-red-500">
          <p>Error al cargar categorías: {error}</p>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`group relative overflow-hidden rounded-2xl h-40 lg:h-48 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Background Color & Gradient */}
              <div className={`absolute inset-0 ${category.color} opacity-90 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-white/10 to-black/5`}></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 p-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {renderCategoryIcon(category.icono, 40)}
                </div>
                <span className="font-bold text-lg lg:text-xl tracking-wide text-center drop-shadow-sm">{category.nombre}</span>
              </div>

              {/* Decoration Circle */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            </div>
          ))}
        </div>
      )}

      {/* Decorative Background Element */}
      <div className="fixed bottom-0 right-0 pointer-events-none opacity-5">
        <GraduationCap size={400} />
      </div>
    </div>
  );
};

export default Home;
