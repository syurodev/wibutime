"use client";

// Displacement map từ liquid-glass-example
const DISPLACEMENT_MAP_BASE64 = `data:image/png;base64,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`;

/**
 * LiquidGlassFilter - SVG filter provider cho hiệu ứng liquid glass
 *
 * Cần được mount một lần trong app (thường ở layout.tsx hoặc providers)
 * Sau đó các component có thể dùng `backdrop-filter: url(#liquid-glass-filter)` hoặc class `liquid-glass`
 */
export function LiquidGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Filter chính cho liquid glass effect */}
        <filter id="liquid-glass-filter" primitiveUnits="objectBoundingBox">
          <feImage
            href={DISPLACEMENT_MAP_BASE64}
            x="0"
            y="0"
            width="1"
            height="1"
            result="map"
          />
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.015"
            result="blur"
          />
          <feDisplacementMap
            id="liquid-glass-displacement"
            in="blur"
            in2="map"
            scale="0.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Filter với blur nhẹ hơn cho text rõ ràng hơn */}
        <filter
          id="liquid-glass-filter-light"
          primitiveUnits="objectBoundingBox"
        >
          <feImage
            href={DISPLACEMENT_MAP_BASE64}
            x="0"
            y="0"
            width="1"
            height="1"
            result="map"
          />
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.008"
            result="blur"
          />
          <feDisplacementMap
            in="blur"
            in2="map"
            scale="0.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default LiquidGlassFilter;
