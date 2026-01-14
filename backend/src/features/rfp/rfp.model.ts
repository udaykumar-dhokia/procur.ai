import mongoose from "mongoose";

const RFPItemSchema = new mongoose.Schema(
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

    specifications: {
      type: Map,
      of: String,
      // Example:
      // { ram: "16GB", storage: "512GB SSD", size: "27-inch" }
    },
  },
  { _id: false }
);

const RFPSchema = new mongoose.Schema(
  {
    rfpId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    rawInput: {
      type: String,
      required: true,
    },

    items: {
      type: [RFPItemSchema],
      required: true,
    },

    budget: {
      amount: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },

    deliveryDeadlineDays: {
      type: Number,
    },

    paymentTerms: {
      type: String,
    },

    warrantyRequirement: {
      type: String,
    },

    additionalNotes: {
      type: String,
    },

    selectedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "sent", "responses_received", "evaluated", "awarded"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const RFP = mongoose.model("RFP", RFPSchema);
export default RFP;
