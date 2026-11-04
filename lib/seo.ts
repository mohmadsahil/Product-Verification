import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "./brand";

export const KEYWORDS = {
  primary: [
    "Crystal Glow original product",
    "Crystal Glow product verification",
    "verify original Crystal Glow product",
    "Crystal Glow authenticity check",
    "how to verify Crystal Glow original product",
    "Crystal Glow QR code verification",
    "Crystal Glow genuine vs fake",
  ],
  secondary: [
    "Crystal Glow original products",
    "Crystalglow original cream",
    "Crystal Glow genuine products",
    "Crystal Glow authentic skincare products",
    "Crystal Glow original brightening cream",
    "Crystal Glow original face wash",
    "Crystal Glow original soap",
    "Crystal Glow original skincare range",
    "Crystal Glow official website",
    "Buy original Crystal Glow products online",
    "How to check Crystal Glow product authenticity",
    "Crystal Glow product authenticity check",
    "How to identify original Crystal Glow cream",
    "How to identify fake Crystal Glow products",
    "Crystal Glow batch number verification",
    "Crystal Glow original packaging check",
    "Crystal Glow barcode verification",
    "Crystal Glow fake product complaints",
    "Crystal Glow duplicate products",
    "Crystal Glow original or fake",
    "Where to buy genuine Crystal Glow products",
    "Crystal Glow authorized seller",
    "Crystal Glow original cream price",
    "Crystal Glow real customer reviews",
    "Is Crystal Glow cream original",
    "Crystal Glow fake cream identification",
    "Crystal Glow official product verification process",
  ],
};

export const SITE_TITLE = `Crystal Glow Original Product Verification | Authenticity Check`;

export function verifyPageMetadata(): Metadata {
  const title =
    "Crystal Glow Original Product Verification | Genuine Authenticity Check";
  const description =
    "Verify original Crystal Glow products instantly. Check authenticity of Crystal Glow cream, face wash, soap & skincare — spot fake products and shop genuine.";
  const url = SITE_URL;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [...KEYWORDS.primary, ...KEYWORDS.secondary],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: BRAND_NAME,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}
