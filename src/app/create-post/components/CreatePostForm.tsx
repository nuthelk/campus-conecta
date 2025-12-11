import { useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useSubcategoriesStore } from "@/stores/useSubcategoriesStore";
import { usePostForm } from "../hooks/usePostForm";
import { MediaUpload } from "./MediaUpload";

export const CreatePostForm = () => {
    const { categories, fetchCategories } = useCategoriesStore();
    const { subcategories, isLoading: loadingSubcategories, fetchSubcategories } = useSubcategoriesStore();

    const {
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
    } = usePostForm();

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories.length, fetchCategories]);

    useEffect(() => {
        if (subcategories.length === 0) fetchSubcategories();
    }, [subcategories.length, fetchSubcategories]);

    const categoryOptions = categories.map(cat => ({ label: cat.nombre, value: cat.id }));
    const subcategoryOptions = subcategories.map(sub => ({ label: sub.nombre, value: sub.id }));

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            {/* Header Section */}
            <FormHeader />

            {/* Form Section */}
            <div className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Title Input */}
                <div className="space-y-3">
                    <label className="text-lg font-bold text-[#1a1b4b] flex items-center gap-2">
                        Título de la publicación
                        <span className="text-red-400 text-sm">*</span>
                    </label>
                    <Input
                        placeholder="Ej: Introducción al Cálculo Integral"
                        value={formData.titulo}
                        onChange={(e) => updateForm('titulo', e.target.value)}
                        className="p-6 text-lg border-gray-200 focus-visible:ring-purple-500 bg-gray-50/50"
                    />
                </div>

                {/* Selectors Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 relative z-20">
                        <label className="text-lg font-bold text-[#1a1b4b]">Categoría</label>
                        <CustomSelect
                            options={categoryOptions}
                            value={formData.categoria_id}
                            onChange={(val) => updateForm('categoria_id', val as string)}
                            placeholder="Selecciona una categoría"
                        />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="text-lg font-bold text-[#1a1b4b]">Subcategoría</label>
                        <CustomSelect
                            options={subcategoryOptions}
                            value={formData.subcategoria_id}
                            onChange={(val) => updateForm('subcategoria_id', val as string)}
                            placeholder={loadingSubcategories ? "Cargando..." : "Selecciona una subcategoría"}
                            disabled={loadingSubcategories}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                    {/* Description */}
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="text-lg font-bold text-[#1a1b4b] mb-3">Descripción</label>
                        <div className="flex-1 relative">
                            <textarea
                                value={formData.contenido}
                                onChange={(e) => updateForm('contenido', e.target.value)}
                                className="w-full h-full p-6 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 text-gray-700 placeholder-gray-400 font-medium text-base transition-all"
                                placeholder="Describe detalladamente tu publicación..."
                            />
                        </div>
                    </div>

                    {/* Media Upload */}
                    <MediaUpload
                        mediaType={formData.mediaType}
                        file={formData.file}
                        videoUrl={formData.videoUrl}
                        fileSizeError={fileSizeError}
                        dragging={dragging}
                        onMediaTypeChange={(type) => updateForm('mediaType', type)}
                        onFileSelect={handleFileSelect}
                        onVideoUrlChange={handleVideoUrlChange}
                        onClearFile={handleClearFile}
                        onClearError={() => setFileSizeError(null)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#1a1b4b] hover:bg-[#2d2e6a] text-white px-10 py-7 rounded-xl text-xl font-bold flex items-center gap-4 shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            Publicando...
                        </>
                    ) : (
                        <>
                            <div className="rounded-full border-2 border-white/30 p-1">
                                <ArrowUp size={24} className="text-white" />
                            </div>
                            Publicar ahora
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

const FormHeader = () => (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-8">
        <div className="flex-1 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1b4b] mb-2 leading-tight">
                Realiza una nueva <span className="text-purple-600">publicación</span>
            </h1>
            <div className="h-1.5 w-24 bg-purple-500 mb-6 rounded-full" />
            <p className="text-xl text-gray-500 font-medium">
                Comparte tus conocimientos con la comunidad
            </p>
        </div>

        {/* Illustration */}
        <div className="hidden md:block w-48 h-48 relative opacity-80">
            <div className="w-full h-full text-indigo-100">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                    <circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.3" />
                    <path d="M60,140 L140,140 L140,80 L100,50 L60,80 Z" fill="#6366f1" />
                    <rect x="70" y="90" width="60" height="40" fill="white" rx="5" />
                </svg>
            </div>
        </div>
    </div>
);
