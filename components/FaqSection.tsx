import { ChevronDown } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

export const FAQS: { q: string; a: string }[] = [
  {
    q: `How do I verify an original ${BRAND_NAME} product?`,
    a: `Scan the Crystal Glow QR code printed on your ${BRAND_NAME} pack or open the official verification link, fill the short form, pick your product (Anti Pigment Radiance Cream, Advance Brightening Cream, Face Wash, Soap and more) and we instantly confirm whether your ${BRAND_NAME} skincare product is genuine or fake.`,
  },
  {
    q: `How to check Crystal Glow product authenticity online?`,
    a: `The official Crystal Glow product authenticity check is done here. Enter your details, choose the product, and the Crystal Glow authenticity check matches your pack against our database to confirm it is an authentic Crystal Glow skincare product.`,
  },
  {
    q: `Is my Crystal Glow cream original or fake?`,
    a: `If your Crystal Glow cream verifies successfully on this page you have a genuine Crystal Glow original cream. Anything that fails the verification, or a broken or missing QR is very likely a duplicate or fake Crystal Glow product.`,
  },
  {
    q: `How does Crystal Glow QR code verification work?`,
    a: `Every genuine Crystal Glow product carries a unique Crystal Glow QR code. Scanning it opens this official Crystal Glow product verification page, where our system cross-checks the code with the Crystal Glow batch number verification database and shows whether the product is authentic.`,
  },
  {
    q: `Is my mobile number safe when I verify online?`,
    a: `Yes. We use your mobile only to confirm the Crystal Glow product authenticity check. We never share it with third parties and we store data per our privacy policy.`,
  },
];

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mt-6 sm:mt-14 max-w-3xl mx-auto px-3 sm:px-4"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
        <span className="h-5 sm:h-8 w-1 sm:w-1.5 rounded-full bg-brand-sheen" />
        <h2
          id="faq-heading"
          className="text-base sm:text-2xl md:text-3xl font-semibold text-brand tracking-tight"
        >
          Crystal Glow Product Verification — FAQ
        </h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {FAQS.map((f, i) => (
          <details
            key={i}
            className="group rounded-xl border border-brandline bg-white p-3 sm:p-5 shadow-soft hover:shadow-card transition-shadow open:shadow-card"
          >
            <summary className="flex items-start gap-2 sm:gap-3 justify-between cursor-pointer list-none font-medium text-foreground text-[13px] sm:text-base leading-snug">
              <span className="flex-1 min-w-0">{f.q}</span>
              <ChevronDown
                className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="mt-2 sm:mt-3 text-[12px] sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
