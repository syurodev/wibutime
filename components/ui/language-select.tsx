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
}

export function LanguageSelect({
  value,
  onValueChange,
  placeholder = "Chọn ngôn ngữ",
  excludeLanguages = [],
  className,
  disabled = false,
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
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
