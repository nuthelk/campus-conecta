import { getYouTubeId, isYouTubeUrl, isImageFile } from "../mediaUtils";

describe("mediaUtils", () => {
  describe("getYouTubeId", () => {
    it("debería extraer el ID de una URL estándar de YouTube", () => {
      const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      expect(getYouTubeId(url)).toBe("dQw4w9WgXcQ");
    });

    it("debería extraer el ID de una URL corta de YouTube", () => {
      const url = "https://youtu.be/dQw4w9WgXcQ";
      expect(getYouTubeId(url)).toBe("dQw4w9WgXcQ");
    });

    it("debería extraer el ID de una URL de embed de YouTube", () => {
      const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
      expect(getYouTubeId(url)).toBe("dQw4w9WgXcQ");
    });

    it("debería extraer el ID de una URL con parámetros adicionales", () => {
      const url =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";
      expect(getYouTubeId(url)).toBe("dQw4w9WgXcQ");
    });

    it("debería retornar null para URLs inválidas de YouTube", () => {
      const urlInvalida = "https://www.youtube.com/watch?v=123";
      expect(getYouTubeId(urlInvalida)).toBeNull();
    });

    it("debería retornar null para URLs que no son de YouTube", () => {
      const urlNoYouTube = "https://www.vimeo.com/123456";
      expect(getYouTubeId(urlNoYouTube)).toBeNull();
    });

    it("debería manejar URLs con parámetros en diferente orden", () => {
      const url =
        "https://www.youtube.com/watch?ab_channel=RickAstley&v=dQw4w9WgXcQ";
      expect(getYouTubeId(url)).toBe("dQw4w9WgXcQ");
    });

    it("debería manejar URLs sin el parámetro v", () => {
      const url = "https://www.youtube.com/watch?ab_channel=RickAstley";
      expect(getYouTubeId(url)).toBeNull();
    });
  });

  describe("isYouTubeUrl", () => {
    it("debería identificar URLs de youtube.com", () => {
      const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      expect(isYouTubeUrl(url)).toBe(true);
    });

    it("debería identificar URLs de youtu.be", () => {
      const url = "https://youtu.be/dQw4w9WgXcQ";
      expect(isYouTubeUrl(url)).toBe(true);
    });

    it("debería retornar false para URLs de otros dominios", () => {
      const url = "https://www.vimeo.com/123456";
      expect(isYouTubeUrl(url)).toBe(false);
    });

    it("debería retornar false para URLs vacías", () => {
      expect(isYouTubeUrl("")).toBe(false);
    });

    it("debería ser case insensitive", () => {
      const url = "https://YOUTUBE.COM/watch?v=dQw4w9WgXcQ";
      expect(isYouTubeUrl(url)).toBe(true);
    });
  });

  describe("isImageFile", () => {
    it("debería identificar archivos JPG", () => {
      expect(isImageFile("imagen.jpg")).toBe(true);
      expect(isImageFile("foto.JPG")).toBe(true);
    });

    it("debería identificar archivos JPEG", () => {
      expect(isImageFile("imagen.jpeg")).toBe(true);
      expect(isImageFile("foto.JPEG")).toBe(true);
    });

    it("debería identificar archivos PNG", () => {
      expect(isImageFile("imagen.png")).toBe(true);
      expect(isImageFile("foto.PNG")).toBe(true);
    });

    it("debería identificar archivos GIF", () => {
      expect(isImageFile("imagen.gif")).toBe(true);
      expect(isImageFile("foto.GIF")).toBe(true);
    });

    it("debería identificar archivos WebP", () => {
      expect(isImageFile("imagen.webp")).toBe(true);
      expect(isImageFile("foto.WEBP")).toBe(true);
    });

    it("debería identificar archivos SVG", () => {
      expect(isImageFile("imagen.svg")).toBe(true);
      expect(isImageFile("foto.SVG")).toBe(true);
    });

    it("debería retornar false para archivos no imagen", () => {
      expect(isImageFile("video.mp4")).toBe(false);
      expect(isImageFile("documento.pdf")).toBe(false);
      expect(isImageFile("audio.mp3")).toBe(false);
    });

    it("debería manejar URLs completas", () => {
      const url = "https://ejemplo.com/ruta/imagen.jpg?param=valor";
      expect(isImageFile(url)).toBe(true);
    });

    it("debería manejar extensiones explícitas", () => {
      expect(isImageFile("archivo", "jpg")).toBe(true);
      expect(isImageFile("archivo", "mp4")).toBe(false);
    });

    it("debería priorizar la extensión explícita sobre la URL", () => {
      const url = "https://ejemplo.com/video.mp4";
      expect(isImageFile(url, "jpg")).toBe(true);
    });

    it("debería ser case insensitive", () => {
      expect(isImageFile("IMAGEN.JPG")).toBe(true);
      expect(isImageFile("archivo", "PNG")).toBe(true);
    });

    it("debería manejar archivos con múltiples puntos", () => {
      expect(isImageFile("mi.imagen.especial.jpg")).toBe(true);
      expect(isImageFile("mi.video.especial.mp4")).toBe(false);
    });
  });
});
