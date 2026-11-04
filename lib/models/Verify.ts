import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const VerifySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, index: true },
    boughtAt: { type: String, required: true },
    product: { type: String },
    ip: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: true }, collection: "verifyproducts" }
);

export type VerifyDoc = InferSchemaType<typeof VerifySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Verify: Model<VerifyDoc> =
  (mongoose.models.Verify as Model<VerifyDoc>) ||
  mongoose.model<VerifyDoc>("Verify", VerifySchema);
