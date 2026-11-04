import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_COLOR } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${BRAND_NAME} — ${BRAND_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          fontFamily: "sans-serif",
          color: BRAND_COLOR,
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          {BRAND_NAME}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 28,
            letterSpacing: 10,
            color: "#4CA3A3",
          }}
        >
          GLOW
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 42,
            color: "#1a2b2b",
            fontWeight: 500,
          }}
        >
          {BRAND_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
