/**
 * Extrae el ID de YouTube de una URL
 */
export const getYouTubeId = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

/**
 * Verifica si una URL es de YouTube
 */
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
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
