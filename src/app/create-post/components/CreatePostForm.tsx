import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, ChevronDown, Check, ImageUp, Video, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useSubcategoriesStore } from "@/stores/useSubcategoriesStore";
import { usePostsStore, MAX_FILE_SIZE_MB } from "@/stores/usePostsStore";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Componente CustomSelect para un diseño "premium"
interface Option {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number | null;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
}

const CustomSelect = ({ options, value, onChange, placeholder = "Seleccionar...", disabled = false }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div
                className={`w-full p-4 bg-white border rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 ${isOpen ? "border-purple-500 ring-2 ring-purple-100" : "border-gray-200 hover:border-purple-300"
                    } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                    size={20}
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`p-3 rounded-md cursor-pointer flex justify-between items-center transition-colors ${value === option.value
                                        ? "bg-purple-50 text-purple-700 font-bold"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={16} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

type MediaType = 'file' | 'image' | 'video' | null;

export const CreatePostForm = () => {
    const { categories, fetchCategories } = useCategoriesStore();
    const { subcategories, isLoading: loadingSubcategories, fetchSubcategories } = useSubcategoriesStore();
    const { createPost, isLoading: isSubmitting } = usePostsStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dragging, setDragging] = useState(false);
    const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, fetchCategories]);

    useEffect(() => {
        if (subcategories.length === 0) {
            fetchSubcategories();
        }
    }, [subcategories.length, fetchSubcategories]);

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
            setSelectedFile(file);
            setSelectedMediaType(type);
            setVideoUrl("");
        }
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
        setTitle("");
        setDescription("");
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedFile(null);
        setVideoUrl("");
        setSelectedMediaType(null);
        setFileSizeError(null);
    };

    const handleSubmit = async () => {
        // Validations
        if (!title.trim()) {
            toast.error("El título es requerido");
            return;
        }
        if (!selectedCategory) {
            toast.error("Selecciona una categoría");
            return;
        }
        if (!selectedSubcategory) {
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
        const urlArchivo = selectedMediaType === 'video' && videoUrl ? videoUrl : undefined;

        const result = await createPost(
            {
                usuario_id: user.id,
                categoria_id: selectedCategory,
                subcategoria_id: selectedSubcategory,
                titulo: title.trim(),
                contenido: description.trim(),
                url_archivo: urlArchivo,
            },
            selectedMediaType !== 'video' ? selectedFile : null
        );

        if (result.success) {
            toast.success("¡Publicación creada exitosamente!");
            resetForm();
        } else {
            toast.error(result.error || "Error al crear la publicación");
        }
    };

    // Transform categories to options format
    const categoryOptions = categories.map(cat => ({ label: cat.nombre, value: cat.id }));

    // Transform subcategories to options format
    const subcategoryOptions = subcategories.map(sub => ({ label: sub.nombre, value: sub.id }));

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            {/* Header Section */}
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

                {/* Illustration Placeholder */}
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-6 text-lg border-gray-200 focus-visible:ring-purple-500 bg-gray-50/50"
                    />
                </div>

                {/* Selectors Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 relative z-20">
                        <label className="text-lg font-bold text-[#1a1b4b]">Categoría</label>
                        <CustomSelect
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={(val) => setSelectedCategory(val as string)}
                            placeholder="Selecciona una categoría"
                        />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="text-lg font-bold text-[#1a1b4b]">Subcategoría</label>
                        <CustomSelect
                            options={subcategoryOptions}
                            value={selectedSubcategory}
                            onChange={(val) => setSelectedSubcategory(val as string)}
                            placeholder={loadingSubcategories ? "Cargando..." : "Selecciona una subcategoría"}
                            disabled={loadingSubcategories}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                    {/* Text Input */}
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="text-lg font-bold text-[#1a1b4b] mb-3">Descripción</label>
                        <div className="flex-1 relative">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-full p-6 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 text-gray-700 placeholder-gray-400 font-medium text-base transition-all"
                                placeholder="Describe detalladamente tu publicación..."
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="text-lg font-bold text-[#1a1b4b] mb-3">Archivos multimedia</label>
                        <div className="flex flex-row gap-4 h-full">
                            {/* Icons Column */}
                            <div className="flex flex-col gap-4 text-gray-400 pt-4">
                                <button
                                    className={`p-3 rounded-full transition-colors ${selectedMediaType === 'file' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
                                    title="Adjuntar archivo"
                                    onClick={() => {
                                        setSelectedMediaType('file');
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <Paperclip size={22} />
                                </button>
                                <button
                                    className={`p-3 rounded-full transition-colors ${selectedMediaType === 'image' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
                                    title="Adjuntar imagen"
                                    onClick={() => {
                                        setSelectedMediaType('image');
                                        imageInputRef.current?.click();
                                    }}
                                >
                                    <ImageUp size={22} />
                                </button>
                                <button
                                    className={`p-3 rounded-full transition-colors ${selectedMediaType === 'video' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
                                    title="Agregar video de YouTube"
                                    onClick={() => setSelectedMediaType(selectedMediaType === 'video' ? null : 'video')}
                                >
                                    <Video size={22} />
                                </button>
                            </div>

                            {/* Hidden file inputs */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files?.[0], 'file')}
                            />
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files?.[0], 'image')}
                            />

                            {/* Content Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Video URL Input */}
                                {selectedMediaType === 'video' && (
                                    <div className="p-4 border border-gray-200 rounded-xl bg-white">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Video size={20} className="text-red-500" />
                                            <span className="font-medium text-gray-700">URL de YouTube</span>
                                        </div>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={videoUrl}
                                            onChange={(e) => {
                                                setVideoUrl(e.target.value);
                                                setSelectedFile(null);
                                            }}
                                            className="border-gray-200 focus-visible:ring-purple-500"
                                        />
                                    </div>
                                )}

                                {/* File Size Error */}
                                {fileSizeError && (
                                    <div className="p-4 border border-red-200 rounded-xl bg-red-50 flex items-center gap-3">
                                        <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                                        <span className="text-red-600 font-medium text-sm">{fileSizeError}</span>
                                        <button
                                            onClick={() => setFileSizeError(null)}
                                            className="ml-auto p-1 hover:bg-red-100 rounded-full"
                                        >
                                            <X size={16} className="text-red-400" />
                                        </button>
                                    </div>
                                )}

                                {/* Selected File Display */}
                                {selectedFile && (
                                    <div className="p-4 border border-gray-200 rounded-xl bg-white flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {selectedMediaType === 'image' ? <ImageUp size={20} className="text-purple-500" /> : <Paperclip size={20} className="text-purple-500" />}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                                                <span className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setSelectedMediaType(null);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-full"
                                        >
                                            <X size={18} className="text-gray-400" />
                                        </button>
                                    </div>
                                )}

                                {/* Drop Zone */}
                                {!selectedFile && selectedMediaType !== 'video' && (
                                    <div
                                        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 cursor-pointer ${dragging
                                                ? "border-purple-500 bg-purple-50 scale-[1.02]"
                                                : "border-gray-300 bg-gray-50 hover:bg-white hover:border-purple-400 hover:shadow-md"
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                            <ImageUp size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-700 mb-2">Sube tus archivos</h3>
                                        <p className="text-gray-400 font-medium max-w-[200px]">
                                            Arrastra y suelta aquí o haz clic para explorar
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
