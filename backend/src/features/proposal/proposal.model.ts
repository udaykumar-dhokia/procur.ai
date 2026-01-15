import mongoose from "mongoose";

const ProposalItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    specifications: {
      type: Map,
      of: String,
    },
    remarks: {
      type: String,
    },
  },
  { _id: false }
);

const ProposalSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFP",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    items: {
      type: [ProposalItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      required: true,
    },
    deliveryTimelineDays: {
      type: Number,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    validityDate: {
      type: Date,
    },
    additionalNotes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "rejected", "accepted"],
      default: "submitted",
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProposalSchema.index({ rfpId: 1, vendorId: 1 }, { unique: true });

const Proposal = mongoose.model("Proposal", ProposalSchema);
export default Proposal;
