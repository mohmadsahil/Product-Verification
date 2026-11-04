import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} Original Product Verification | Authenticity Check`,
    template: `%s | ${BRAND_NAME} Original Product Verification`,
  },
  description: `Official ${BRAND_NAME} product verification — check authenticity of original Crystal Glow cream, face wash, soap and skincare. Spot fake products instantly.`,
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008080",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
