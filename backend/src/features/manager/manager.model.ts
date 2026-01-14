import mongoose from "mongoose";

const managerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
