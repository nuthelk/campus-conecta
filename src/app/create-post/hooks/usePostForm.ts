import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { usePostsStore, MAX_FILE_SIZE_MB } from "@/stores/usePostsStore";
import { initialFormData } from "../types";
import type { PostFormData, MediaType } from "../types";

export const usePostForm = () => {
    const { createPost, isLoading: isSubmitting } = usePostsStore();

    const [formData, setFormData] = useState<PostFormData>(initialFormData);
    const [dragging, setDragging] = useState(false);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);

    const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    const updateForm = <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateFileSize = (file: File): boolean => {
        if (file.size > maxFileSizeBytes) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            setFileSizeError(`El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB. Tamaño actual: ${sizeMB}MB`);
            return false;
        }
        setFileSizeError(null);
        return true;
    };

    const handleFileSelect = (file: File | undefined, type: MediaType) => {
        if (!file) return;

        if (validateFileSize(file)) {
            setFormData(prev => ({
                ...prev,
                file,
                mediaType: type,
                videoUrl: '',
            }));
        }
    };

    const handleVideoUrlChange = (url: string) => {
        setFormData(prev => ({
            ...prev,
            videoUrl: url,
            file: null,
        }));
    };

    const handleClearFile = () => {
        setFormData(prev => ({ ...prev, file: null, mediaType: null }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            handleFileSelect(file, isImage ? 'image' : 'file');
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setFileSizeError(null);
    };

    const handleSubmit = async () => {
        // Validations
        if (!formData.titulo.trim()) {
            toast.error("El título es requerido");
            return;
        }
        if (!formData.categoria_id) {
            toast.error("Selecciona una categoría");
            return;
        }
        if (!formData.subcategoria_id) {
            toast.error("Selecciona una subcategoría");
            return;
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Debes iniciar sesión para publicar");
            return;
        }

        // Determine URL (video or file)
        const urlArchivo = formData.mediaType !== 'video' ? formData.file?.name : null;
        const urlVideo = formData.mediaType === 'video' && formData.videoUrl ? formData.videoUrl : null;

        const result = await createPost(
            {
                usuario_id: user.id,
                categoria_id: formData.categoria_id,
                subcategoria_id: formData.subcategoria_id,
                titulo: formData.titulo.trim(),
                contenido: formData.contenido.trim(),
                url_archivo: urlArchivo,
                url_video: urlVideo,
            },
            formData.mediaType !== 'video' ? formData.file : null
        );

        if (result.success) {
            toast.success("¡Publicación creada exitosamente!");
            resetForm();
        } else {
            toast.error(result.error || "Error al crear la publicación");
        }
    };

    return {
        formData,
        updateForm,
        isSubmitting,
        dragging,
        fileSizeError,
        setFileSizeError,
        handleFileSelect,
        handleVideoUrlChange,
        handleClearFile,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleSubmit,
    };
};
