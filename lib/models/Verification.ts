import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const VerificationSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    uniqueCode: { type: String, index: true },
    ip: String,
    userAgent: String,
    result: {
      type: String,
      enum: ["genuine", "used", "invalid"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type VerificationDoc = InferSchemaType<typeof VerificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Verification: Model<VerificationDoc> =
  (mongoose.models.Verification as Model<VerificationDoc>) ||
  mongoose.model<VerificationDoc>("Verification", VerificationSchema);
