import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    requestedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export const Exchange = mongoose.model("Exchange", exchangeSchema);
