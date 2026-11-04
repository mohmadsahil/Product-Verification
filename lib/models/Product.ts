import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    batchNo: { type: String, required: true },
    mfgDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    uniqueCode: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["unused", "verified", "blocked"],
      default: "unused",
    },
    verifyCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) ||
  mongoose.model<ProductDoc>("Product", ProductSchema);
