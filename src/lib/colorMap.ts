// Mapa de colores para categorías (clase Tailwind -> color hex/rgb)
export const colorMap: Record<string, string> = {
  'bg-teal-500': '#14b8a6',
  'bg-indigo-500': '#6366f1',
  'bg-indigo-600': '#4f46e5',
  'bg-emerald-600': '#059669',
  'bg-red-500': '#ef4444',
  'bg-cyan-600': '#0891b2',
  'bg-green-600': '#16a34a',
  'bg-pink-500': '#ec4899',
  'bg-blue-500': '#3b82f6',
  'bg-blue-600': '#2563eb',
  'bg-orange-500': '#f97316',
  'bg-gray-800': '#1f2937',
  'bg-slate-600': '#475569',
  'bg-rose-500': '#f43f5e',
  'bg-purple-500': '#a855f7',
  'bg-purple-700': '#7e22ce',
};

export const getColorValue = (colorClass: string): string => {
  return colorMap[colorClass] || '#6366f1'; // indigo-500 como fallback
};
