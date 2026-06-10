import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    condition: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "sold", "archived"],
      default: "active"
    }
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
