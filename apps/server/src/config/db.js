import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer = null;

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const mongoUri = env.mongoUri || (await getInMemoryUri());
  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

const getInMemoryUri = async () => {
  if (env.isProduction) {
    throw new Error("MONGODB_URI is required in production");
  }
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
    console.log("Using in-memory MongoDB for local development.");
  }
  return memoryServer.getUri();
};
