<<<<<<< HEAD
# Product-Verification
Product Verification
=======
# Crystal Glow — Product Authentication & Verification

Next.js 14 (App Router) + MongoDB (Mongoose) + Tailwind + Framer Motion.
Customers scan a QR / open `/verify?code=XYZ`, submit a short form, verify their
mobile via OTP, and we instantly confirm whether the product is genuine.

## Stack

- Next.js 14 App Router, TypeScript
- MongoDB + Mongoose
- Tailwind CSS (brand teal `#008080`)
- Framer Motion + canvas-confetti (lazy-loaded)
- zod validators
- In-memory rate limiting per IP

## Setup

```bash
cp .env.example .env.local
npm install
npm run download-logo        # fetches /public/logo.png
npm run seed                 # inserts 50 sample product codes (prints first 5)
npm run dev
```

Open http://localhost:3000/verify — or append `?code=XXXXXXXXXXXX` to test a
specific product code (use one printed by the seed script).

### Required env vars (`.env.local`)

```
MONGODB_URI=mongodb://127.0.0.1:27017/crystal_glow
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Flow

1. User fills the form (Bought At, Name, Email, Mobile).
2. Clicks **Verify** next to mobile → 1-second spinner → "Verified".
3. Clicks **Continue** → verifying animation → result (genuine / used /
   invalid) based on `?code=…` match in the DB.

### Seeding product codes

`npm run seed` wipes products with `sku=CG-RS-30` and inserts 50 fresh codes.
The first 5 are printed to the console — use any of them as `?code=…` on
`/verify` to see a genuine verification. Hitting the same code twice shows the
"already verified" path. An unknown code → invalid.

### Logo

- Primary source: `/public/logo.png` (fetched by `npm run download-logo`)
- Fallback at runtime: the remote Google thumbnail URL (configured in
  `next.config.js` `images.remotePatterns`)
- `lib/brand.ts` holds the brand constants
- Favicon + Apple icon + OG image are generated dynamically via
  `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`

Organization JSON-LD uses the local `NEXT_PUBLIC_SITE_URL + "/logo.png"` —
never the Google thumbnail — so SEO structured data stays stable.

### Routes

| Route | Purpose |
| --- | --- |
| `GET /verify` | Verification form (indexable, full SEO) |
| `POST /api/verify/submit` | Validates input + looks up product |
| `GET /verify/result` | Deep-link landing (noindex) |

### SEO

- One `<h1>` on `/verify`, section `<h2>` headings
- Organization / WebPage / FAQPage / BreadcrumbList JSON-LD
- `app/sitemap.ts`, `app/robots.ts`, `metadataBase`, canonical, OG + Twitter
- `/verify/result` is `noindex`; `/api/*` disallowed in robots
- Framer Motion + canvas-confetti code-split; `prefers-reduced-motion` honoured

### Deploy on Vercel

1. Push the repo to GitHub.
2. Import into Vercel, add env vars from `.env.example`.
3. Attach a MongoDB Atlas cluster — paste its connection string into
   `MONGODB_URI`.
4. Trigger a first deployment; run `npm run seed` locally against the Atlas DB
   once to populate codes. Future product codes can be inserted via a CMS or
   an authenticated admin page.

### Project layout

```
app/
  layout.tsx, page.tsx (redirects to /verify)
  verify/page.tsx, verify/result/page.tsx
  api/verify/submit/route.ts
  sitemap.ts, robots.ts
  icon.tsx, apple-icon.tsx, opengraph-image.tsx
components/
  BrandLogo.tsx, VerifyForm.tsx
  VerifyingAnimation.tsx, ResultCard.tsx
  FaqSection.tsx, JsonLd.tsx
lib/
  mongodb.ts, models/{Product,Customer,Verification}.ts
  rateLimit.ts, seo.ts, brand.ts, validators.ts
scripts/
  seed.ts, download-logo.ts
public/
  logo.png (generated)
```
>>>>>>> 65349b8 (feat: add logo download script, seed script for products, Tailwind CSS configuration, and TypeScript configuration)
