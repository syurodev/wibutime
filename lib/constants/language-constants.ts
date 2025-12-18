export const LANGUAGE_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "zh", label: "中文 (Chinese)" },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

/**
 * Get language display name by code
 */
export function getLanguageName(code: string): string {
  const lang = LANGUAGE_OPTIONS.find((lang) => lang.value === code);
  return lang?.label || code.toUpperCase();
}

/**
 * Get full language option by code
 */
export function getLanguageOption(code: string): LanguageOption | undefined {
  return LANGUAGE_OPTIONS.find((lang) => lang.value === code);
}
