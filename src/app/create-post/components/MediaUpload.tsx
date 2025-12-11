import { useRef } from "react";
import { Paperclip, ImageUp, Video, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MAX_FILE_SIZE_MB } from "@/stores/usePostsStore";

type MediaType = 'file' | 'image' | 'video' | null;

interface MediaUploadProps {
    mediaType: MediaType;
    file: File | null;
    videoUrl: string;
    fileSizeError: string | null;
    dragging: boolean;
    onMediaTypeChange: (type: MediaType) => void;
    onFileSelect: (file: File | undefined, type: MediaType) => void;
    onVideoUrlChange: (url: string) => void;
    onClearFile: () => void;
    onClearError: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
}

export const MediaUpload = ({
    mediaType,
    file,
    videoUrl,
    fileSizeError,
    dragging,
    onMediaTypeChange,
    onFileSelect,
    onVideoUrlChange,
    onClearFile,
    onClearError,
    onDragOver,
    onDragLeave,
    onDrop,
}: MediaUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col h-full min-h-[300px]">
            <label className="text-lg font-bold text-[#1a1b4b] mb-3">Archivos multimedia</label>
            <div className="flex flex-row gap-4 h-full">
                {/* Media Type Buttons */}
                <MediaTypeButtons
                    mediaType={mediaType}
                    onFileClick={() => {
                        onMediaTypeChange('file');
                        fileInputRef.current?.click();
                    }}
                    onImageClick={() => {
                        onMediaTypeChange('image');
                        imageInputRef.current?.click();
                    }}
                    onVideoClick={() => onMediaTypeChange(mediaType === 'video' ? null : 'video')}
                />

                {/* Hidden file inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => onFileSelect(e.target.files?.[0], 'file')}
                />
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileSelect(e.target.files?.[0], 'image')}
                />

                {/* Content Area */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Video URL Input */}
                    {mediaType === 'video' && (
                        <VideoUrlInput value={videoUrl} onChange={onVideoUrlChange} />
                    )}

                    {/* File Size Error */}
                    {fileSizeError && (
                        <FileSizeError message={fileSizeError} onClose={onClearError} />
                    )}

                    {/* Selected File Display */}
                    {file && (
                        <SelectedFileDisplay
                            file={file}
                            mediaType={mediaType}
                            onClear={onClearFile}
                        />
                    )}

                    {/* Drop Zone */}
                    {!file && mediaType !== 'video' && (
                        <DropZone
                            dragging={dragging}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => imageInputRef.current?.click()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-components

interface MediaTypeButtonsProps {
    mediaType: MediaType;
    onFileClick: () => void;
    onImageClick: () => void;
    onVideoClick: () => void;
}

const MediaTypeButtons = ({ mediaType, onFileClick, onImageClick, onVideoClick }: MediaTypeButtonsProps) => (
    <div className="flex flex-col gap-4 text-gray-400 pt-4">
        <button
            type="button"
            className={`p-3 rounded-full transition-colors ${mediaType === 'file' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
            title="Adjuntar archivo"
            onClick={onFileClick}
        >
            <Paperclip size={22} />
        </button>
        <button
            type="button"
            className={`p-3 rounded-full transition-colors ${mediaType === 'image' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
            title="Adjuntar imagen"
            onClick={onImageClick}
        >
            <ImageUp size={22} />
        </button>
        <button
            type="button"
            className={`p-3 rounded-full transition-colors ${mediaType === 'video' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
            title="Agregar video de YouTube"
            onClick={onVideoClick}
        >
            <Video size={22} />
        </button>
    </div>
);

interface VideoUrlInputProps {
    value: string;
    onChange: (url: string) => void;
}

const VideoUrlInput = ({ value, onChange }: VideoUrlInputProps) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-white">
        <div className="flex items-center gap-2 mb-3">
            <Video size={20} className="text-red-500" />
            <span className="font-medium text-gray-700">URL de YouTube</span>
        </div>
        <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-gray-200 focus-visible:ring-purple-500"
        />
    </div>
);

interface FileSizeErrorProps {
    message: string;
    onClose: () => void;
}

const FileSizeError = ({ message, onClose }: FileSizeErrorProps) => (
    <div className="p-4 border border-red-200 rounded-xl bg-red-50 flex items-center gap-3">
        <AlertCircle size={20} className="text-red-500 shrink-0" />
        <span className="text-red-600 font-medium text-sm">{message}</span>
        <button
            type="button"
            onClick={onClose}
            className="ml-auto p-1 hover:bg-red-100 rounded-full"
        >
            <X size={16} className="text-red-400" />
        </button>
    </div>
);

interface SelectedFileDisplayProps {
    file: File;
    mediaType: MediaType;
    onClear: () => void;
}

const SelectedFileDisplay = ({ file, mediaType, onClear }: SelectedFileDisplayProps) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
            {mediaType === 'image' ? (
                <ImageUp size={20} className="text-purple-500" />
            ) : (
                <Paperclip size={20} className="text-purple-500" />
            )}
            <div className="flex flex-col">
                <span className="font-medium text-gray-700 truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB / {MAX_FILE_SIZE_MB} MB
                </span>
            </div>
        </div>
        <button
            type="button"
            onClick={onClear}
            className="p-1 hover:bg-gray-100 rounded-full"
        >
            <X size={18} className="text-gray-400" />
        </button>
    </div>
);

interface DropZoneProps {
    dragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
}

const DropZone = ({ dragging, onDragOver, onDragLeave, onDrop }: DropZoneProps) => (
    <div
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 cursor-pointer ${dragging
            ? "border-purple-500 bg-purple-50 scale-[1.02]"
            : "border-gray-300 bg-gray-50 hover:bg-white hover:border-purple-400 hover:shadow-md"
            }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <ImageUp size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Sube tus archivos</h3>
        <p className="text-gray-400 font-medium max-w-[200px]">
            Arrastra y suelta aquí
        </p>
    </div>
);
