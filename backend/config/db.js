import mongoose from "mongoose";

export async function connectDb(connectionString) {
  if (!connectionString) {
    throw new Error("MONGO_URI is required.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(connectionString);
  return mongoose.connection;
}
