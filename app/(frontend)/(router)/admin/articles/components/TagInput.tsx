import React, { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const TagInput = ({
  value = [],
  onChange,
  placeholder,
  error,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi nhấn phím
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 1. Thêm Tag: Khi nhấn Enter hoặc dấu phẩy
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    // 2. Xóa Tag cuối: Khi nhấn Backspace và ô input đang rỗng
    else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = () => {
    const trimmedInput = inputValue.trim().replace(/,/g, "");
    if (trimmedInput && !value.includes(trimmedInput)) {
      onChange([...value, trimmedInput]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  // Focus vào input khi click vào vùng container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleContainerClick}
        className={`
          flex flex-wrap items-center gap-2 px-3 py-2 border rounded-xl bg-white transition-all cursor-text min-h-[46px] border-gray-300 focus-within:ring-2 focus-within:ring-ft-primary-yellow focus-within:border-transparent
         
        `}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-ft-background text-ft-primary-blue text-sm font-semibold px-2.5 py-1 rounded-lg border border-gray-200 animate-in fade-in zoom-in duration-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn kích hoạt focus container
                removeTag(index);
              }}
              className="text-gray-400 hover:text-ft-danger transition-colors rounded-full p-0.5 hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-1 outline-none bg-transparent min-w-[120px] text-sm text-gray-700 placeholder:text-gray-400"
          placeholder={value.length === 0 ? placeholder : ""}
        />
      </div>

      {error && (
        <span className="text-ft-danger text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};
