"use client";

import { useUiPreference } from "@/hooks/use-user-settings";
import { useEffect } from "react";

/**
 * GlassEffectApplier
 * Lắng nghe thay đổi của setting 'glass_effect' và cập nhật attribute data-glass-effect
 * trên thẻ html. Điều này cho phép sử dụng CSS selectors để style các component
 * (kể cả Server Components) dựa trên setting này.
 */
export function GlassEffectApplier() {
  const [glassEffect] = useUiPreference("glass_effect");

  useEffect(() => {
    // Cập nhật attribute trên thẻ html
    // Giá trị có thể là: "normal", "reduce", "liquid"
    document.documentElement.dataset.glassEffect = glassEffect;
  }, [glassEffect]);

  // Component này không render gì cả
  return null;
}
