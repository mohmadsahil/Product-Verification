import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyForm from "@/components/VerifyForm";
import DetailsSkeleton from "@/components/DetailsSkeleton";
import FaqSection from "@/components/FaqSection";
import {
  BreadcrumbLd,
  FaqLd,
  OrganizationLd,
  WebPageLd,
} from "@/components/JsonLd";
import { verifyPageMetadata } from "@/lib/seo";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";

export const metadata: Metadata = verifyPageMetadata();

export default function VerifyPage() {
  const url = `${SITE_URL}/verify`;
  const title = metadata.title as string;
  const desc = metadata.description as string;

  return (
    <>
      <OrganizationLd />
      <WebPageLd url={url} name={title} description={desc} />
      <FaqLd />
      <BreadcrumbLd />

      <main className="relative min-h-screen overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-brand-gradient" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-70" />
        <div
          aria-hidden
          className="absolute -top-24 -left-24 w-[280px] h-[280px] sm:-top-32 sm:-left-32 sm:w-[480px] sm:h-[480px] rounded-full bg-brand/20 blur-3xl -z-10"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-24 w-[300px] h-[300px] sm:-bottom-40 sm:-right-32 sm:w-[520px] sm:h-[520px] rounded-full bg-brand/15 blur-3xl -z-10"
        />

        <section className="px-3 sm:px-4 pt-4 sm:pt-6 pb-12 sm:pb-16">
          <Suspense fallback={<DetailsSkeleton />}>
            <VerifyForm />
          </Suspense>
        </section>

        <div className="relative bg-white">
          <section className="max-w-3xl mx-auto px-3 sm:px-4 pt-6 sm:pt-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
              <span className="h-5 sm:h-8 w-1 sm:w-1.5 rounded-full bg-brand-sheen" />
              <h2 className="text-base sm:text-2xl md:text-3xl font-semibold text-brand tracking-tight">
                How to verify your original {BRAND_NAME} product
              </h2>
            </div>
            <p className="text-[12px] sm:text-sm text-muted-foreground mb-4 leading-snug sm:leading-relaxed">
              Use the official {BRAND_NAME} product verification process to
              confirm that your {BRAND_NAME} cream, face wash, soap or any
              skincare item is genuine. A quick authenticity check — QR code
              or batch number — spots duplicate and fake products.
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {[
                `Scan the Crystal Glow QR code on your pack or open the official verification link.`,
                "Enter your name, email and mobile number to start the authenticity check.",
                "Pick your product — Anti Pigment Cream, Brightening Cream, Face Wash, Soap and more.",
                "Tap Continue — we verify the genuine Crystal Glow product instantly.",
              ].map((step, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-brandline bg-white p-3 sm:p-5 shadow-soft hover:shadow-card transition-shadow flex gap-2.5 sm:block"
                >
                  <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand text-white font-semibold text-[11px] sm:text-sm shrink-0 sm:mb-2">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Step {i + 1}
                    </span>
                    <p className="text-[12px] sm:text-sm text-foreground leading-snug sm:leading-relaxed">
                      {step}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="max-w-3xl mx-auto px-3 sm:px-4 mt-6 sm:mt-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <span className="h-5 sm:h-8 w-1 sm:w-1.5 rounded-full bg-brand-sheen" />
              <h2 className="text-base sm:text-2xl md:text-3xl font-semibold text-brand tracking-tight">
                Why authenticity matters for every {BRAND_NAME} product
              </h2>
            </div>
            <p className="text-[12px] sm:text-base text-muted-foreground leading-snug sm:leading-relaxed">
              Fake {BRAND_NAME} cream, duplicate face wash and counterfeit
              soap are flooding the market. Every genuine {BRAND_NAME}{" "}
              brightening cream, Anti Pigment radiance cream, Glutathione face
              wash and skincare product carries a unique verification code so
              you can check whether your {BRAND_NAME} product is original or
              fake. A Crystal Glow authenticity check protects your skin,
              confirms the correct batch and packaging, and helps our team
              block unauthorized sellers.
            </p>
          </section>

          {/* <section className="max-w-3xl mx-auto px-3 sm:px-4 mt-6 sm:mt-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <span className="h-5 sm:h-8 w-1 sm:w-1.5 rounded-full bg-brand-sheen" />
              <h2 className="text-base sm:text-2xl md:text-3xl font-semibold text-brand tracking-tight">
                Where to buy original {BRAND_NAME} products
              </h2>
            </div>
            <p className="text-[12px] sm:text-base text-muted-foreground leading-snug sm:leading-relaxed">
              Always buy genuine {BRAND_NAME} skincare from the{" "}
              <a
                href="https://crystalglow.in"
                className="text-brand underline-offset-2 hover:underline font-medium"
                rel="noopener"
              >
                Crystal Glow official website
              </a>{" "}
              or an authorized {BRAND_NAME} seller. Avoid unknown marketplaces
              offering heavy discounts on the original {BRAND_NAME} brightening
              cream, Anti Pigment radiance cream, soap or face wash — a lower
              price is the most common sign of a duplicate {BRAND_NAME}{" "}
              product.
            </p>
          </section> */}

          <FaqSection />

          <footer className="max-w-5xl mx-auto px-4 py-6 sm:py-10 mt-6 sm:mt-14 border-t border-brandline text-[11px] sm:text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </footer>
        </div>
      </main>
    </>
  );
}
