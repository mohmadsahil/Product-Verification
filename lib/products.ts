export interface ProductItem {
  name: string;
  tagline: string;
  image: string;
}

// Local product images live in /public/products. Add a new product by
// dropping its image there and appending an entry below.
export const PRODUCTS: ProductItem[] = [
  {
    name: "Anti Pigment Radiance Cream",
    tagline: "Targets dark spots & pigmentation",
    image: "/products/anti-pigment-radiance-cream.jpg",
  },
  {
    name: "Advance Brightening Cream",
    tagline: "Daily brightening moisturiser",
    image: "/products/advance-brightening-cream.jpg",
  },
  {
    name: "Advance Brightening Soap",
    tagline: "Gentle brightening bar",
    image: "/products/advance-brightening-soap.jpg",
  },
  {
    name: "Glutathione Facewash",
    tagline: "Glow-boosting cleanser",
    image: "/products/glutathione-facewash.jpg",
  },
  {
    name: "Deep Cleanser Toner",
    tagline: "Pore-refining toner",
    image: "/products/deep-cleanser-toner.jpg",
  },
  {
    name: "GSH Kit",
    tagline: "Complete glutathione routine",
    image: "/products/gsh-kit.jpg",
  },
  {
    name: "Sunscreen",
    tagline: "Broad-spectrum SPF protection",
    image: "/products/sunscreen.webp",
  },
  {
    name: "Body Lotion",
    tagline: "Daily hydrating body lotion",
    image: "/products/body-lotion.webp",
  },
] as const;

export const PRODUCT_NAMES = PRODUCTS.map((p) => p.name) as [
  string,
  ...string[]
];
