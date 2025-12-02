/**
 * Extract plain text from PlateJS content
 */
function extractTextFromPlateContent(nodes: any[]): string {
  if (!Array.isArray(nodes)) return "";

  return nodes
    .map((node) => {
      if (typeof node === "string") return node;

      // If it's a text node
      if ("text" in node) {
        return node.text as string;
      }

      // If it has children, recursively extract text
      if ("children" in node && Array.isArray(node.children)) {
        return extractTextFromPlateContent(node.children);
      }

      return "";
    })
    .join(" ");
}

/**
 * Count words in a string (Vietnamese + English)
 * Supports both space-separated (English) and continuous (Vietnamese) text
 */
function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Remove extra whitespace and split by whitespace
  const words = text.trim().split(/\s+/);

  // Count words, including Vietnamese syllables
  return words.filter((word) => word.length > 0).length;
}

/**
 * Count characters in a string (excluding spaces)
 */
function countCharacters(text: string): number {
  if (!text) return 0;

  // Remove all whitespace and count characters
  return text.replaceAll(/\s/g, "").length;
}

/**
 * Calculate word count and character count from PlateJS content
 */
export function calculateContentStatistics(content: any): {
  wordCount: number;
  characterCount: number;
} {
  if (!content) {
    return { wordCount: 0, characterCount: 0 };
  }

  // Extract plain text from PlateJS nodes
  const plainText = extractTextFromPlateContent(
    Array.isArray(content) ? content : []
  );

  return {
    wordCount: countWords(plainText),
    characterCount: countCharacters(plainText),
  };
}
