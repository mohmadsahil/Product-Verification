"use client";

import Image from "next/image";
import { useState } from "react";
import { BRAND_NAME, LOGO_PATH, LOGO_REMOTE_FALLBACK } from "@/lib/brand";

interface BrandLogoProps {
  size?: number;
  priority?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = 96,
  priority = false,
  className,
}: BrandLogoProps) {
  const [src, setSrc] = useState<string>(LOGO_PATH);
  return (
    <Image
      src={src}
      alt={`${BRAND_NAME} logo`}
      width={size}
      height={size}
      priority={priority}
      className={className}
      style={{ width: size, height: size, maxWidth: "100%" }}
      onError={() => {
        if (src !== LOGO_REMOTE_FALLBACK) setSrc(LOGO_REMOTE_FALLBACK);
      }}
    />
  );
}
