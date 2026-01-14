import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
