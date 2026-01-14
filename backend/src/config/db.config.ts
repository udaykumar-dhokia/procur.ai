import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("🟢 Database Initialised.");
    });
  } catch (error) {
    console.error(`🔴 ${error}`);
  }
};

export default connectDB;
