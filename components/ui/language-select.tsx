"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/lib/constants/language-constants";

interface LanguageSelectProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly placeholder?: string;
  readonly excludeLanguages?: string[]; // Languages to exclude from options
  readonly className?: string;
  readonly disabled?: boolean;
  readonly showFlags?: boolean; // Whether to show flag emojis
}

export function LanguageSelect({
  value,
  onValueChange,
  placeholder = "Chọn ngôn ngữ",
  excludeLanguages = [],
  className,
  disabled = false,
  showFlags = true,
}: LanguageSelectProps) {
  const filteredOptions = LANGUAGE_OPTIONS.filter(
    (lang) => !excludeLanguages.includes(lang.value)
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredOptions.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {showFlags && <span className="mr-2">{lang.flag}</span>}
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
