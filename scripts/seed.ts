import "dotenv/config";
import mongoose from "mongoose";
import { randomBytes } from "node:crypto";
import { Product } from "../lib/models/Product";

function genCode(): string {
  return randomBytes(6).toString("hex").toUpperCase();
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri);

  const count = 50;
  const docs = Array.from({ length: count }, (_, i) => ({
    productName: "Crystal Glow Radiance Serum 30ml",
    sku: "CG-RS-30",
    batchNo: `B${String(1000 + i)}`,
    mfgDate: new Date(2025, 0, 15),
    expiryDate: new Date(2027, 0, 15),
    uniqueCode: genCode(),
    status: "unused" as const,
    verifyCount: 0,
  }));

  await Product.deleteMany({ sku: "CG-RS-30" });
  const inserted = await Product.insertMany(docs);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${inserted.length} products. Sample codes:`);
  // eslint-disable-next-line no-console
  console.log(inserted.slice(0, 5).map((d) => d.uniqueCode).join("\n"));
  await mongoose.disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
