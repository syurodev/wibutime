/**
 * Get initials from a string (first letter of each word)
 * If string has multiple words, only take first 2 initials
 *
 * @param name - The string to get initials from
 * @param maxInitials - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice Bob Charlie") // "AB"
 * getInitials("Alice") // "A"
 * getInitials("john doe") // "JD"
 * getInitials("") // ""
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  // Trim and check if empty
  const trimmed = name.trim();
  if (!trimmed) return "";

  // Split by spaces and filter out empty strings
  const words = trimmed.split(/\s+/).filter((word) => word.length > 0);

  // Get first letter of each word
  const initials = words
    .map((word) => word[0].toUpperCase())
    .slice(0, maxInitials)
    .join("");

  return initials;
}
