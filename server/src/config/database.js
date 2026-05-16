import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB connected");
}
