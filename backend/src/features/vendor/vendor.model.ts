import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    categories: {
      type: [String], // ["IT Hardware", "Software", "Logistics"]
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
