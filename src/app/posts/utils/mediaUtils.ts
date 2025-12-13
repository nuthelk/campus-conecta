/**
 * Extrae el ID de YouTube de una URL
 */
export const getYouTubeId = (url: string): string | null => {
  // Buscar el parámetro 'v' en cualquier parte de la URL
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");

  // Si no hay parámetro v, intentar extraer de otros formatos
  if (!videoId) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7] && match[7].length === 11 ? match[7] : null;
  }

  return videoId && videoId.length === 11 ? videoId : null;
};

/**
 * Verifica si una URL es de YouTube
 */
export const isYouTubeUrl = (url: string): boolean => {
  const urlLower = url.toLowerCase();
  return urlLower.includes("youtube.com") || urlLower.includes("youtu.be");
};

/**
 * Verifica si un archivo es una imagen por extensión
 */
export const isImageFile = (url: string, extension?: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const urlLower = url.toLowerCase();

  if (extension) {
    return imageExtensions.includes(extension.toLowerCase());
  }

  return imageExtensions.some((ext) => urlLower.includes(`.${ext}`));
};
