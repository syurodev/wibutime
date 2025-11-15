export function getImageUrlWithDefault(
  src: string | null | undefined,
  type?: "user-avatar" | "content-cover"
) {
  if (src) return src;
  if (type === "user-avatar") return "/images/default-avatar.png";
  if (type === "content-cover") return "/images/placeholder-cover.svg";
  return "/images/placeholder-cover.svg";
}
