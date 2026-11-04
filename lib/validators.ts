import { z } from "zod";

export const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name is too short")
  .max(80, "Name is too long")
  .regex(/^[\p{L} .'-]+$/u, "Use letters only");

export const BOUGHT_AT_OPTIONS = [
  "Website-Crystalglow.in",
  "Amaan",
  "Aditi",
  "Irfan",
] as const;

export const boughtAtSchema = z.enum(BOUGHT_AT_OPTIONS);

import { PRODUCT_NAMES } from "./products";

export const PRODUCT_OPTIONS = PRODUCT_NAMES;

export const productSchema = z.enum(
  PRODUCT_NAMES as unknown as readonly [string, ...string[]]
);

export const submitSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  boughtAt: boughtAtSchema,
});

export const completeSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id"),
  product: productSchema,
});
