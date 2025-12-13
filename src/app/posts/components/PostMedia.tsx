import { useState } from "react";
import { getYouTubeId, isYouTubeUrl, isImageFile } from "../utils/mediaUtils";
import Archive from "./Archive";

interface PostMediaProps {
  url_archivo: string | null;
  nombre_archivo: string | null;
  extension_archivo: string | null;
  url_video: string | null;
}

const PostMedia = ({
  url_archivo,
  nombre_archivo,
  extension_archivo,
  url_video,
}: PostMediaProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <>
      {/* Preview de YouTube */}
      {url_video && isYouTubeUrl(url_video) && (
        <div className="rounded-[10px] overflow-hidden mb-6">
          <div className="relative pt-[56.25%] bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(url_video)}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              onLoad={() => setIsVideoLoaded(true)}
            />
            {!isVideoLoaded && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6400A9]"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Imagen adjunta */}
      {url_archivo &&
        isImageFile(url_archivo, extension_archivo || undefined) && (
          <div className="rounded-[10px] overflow-hidden mb-6">
            <img
              src={url_archivo}
              alt={nombre_archivo || "Imagen adjunta"}
              className="w-full h-auto object-contain max-h-[600px] mx-auto"
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="flex items-center justify-center bg-gray-100 h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6400A9]"></div>
              </div>
            )}
          </div>
        )}

      {/* Archivo no imagen */}
      {url_archivo &&
        !isImageFile(url_archivo, extension_archivo || undefined) && (
          <Archive
            name={nombre_archivo || "Archivo adjunto"}
            url={url_archivo}
            extension={extension_archivo!}
          />
        )}
    </>
  );
};

export default PostMedia;
