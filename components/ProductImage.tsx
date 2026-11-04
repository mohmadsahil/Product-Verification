"use client";

import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";
import { LOGO_PATH } from "@/lib/brand";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: Props) {
  const [current, setCurrent] = useState<string>(src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={
          "flex items-center justify-center bg-brand/10 text-brand " +
          (className ?? "")
        }
        aria-hidden
      >
        <Package className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      width={96}
      height={96}
      className={className}
      onError={() => {
        if (current !== LOGO_PATH) setCurrent(LOGO_PATH);
        else setFailed(true);
      }}
      unoptimized
    />
  );
}
