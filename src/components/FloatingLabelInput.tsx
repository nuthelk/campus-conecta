import React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ label, icon, className, id, ...props }, ref) => {
  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="absolute -top-3 z-10 left-3 bg-white px-1 text-sm text-gray-400 font-normal transition-all group-focus-within:text-[#6400A9]"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          className={cn(
            "rounded-[4px] h-[45px] border-[#C9C1D3] focus-visible:ring-0 focus-visible:border-[#6400A9] focus-visible:border-2 focus:border-[#6400A9] focus:border-2 shadow-none",
            icon ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;
