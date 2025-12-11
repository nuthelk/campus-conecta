import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string | number | null;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    disabled = false
}: CustomSelectProps) => {
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
