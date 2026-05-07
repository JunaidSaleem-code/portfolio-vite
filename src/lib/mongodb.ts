import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = (global.__mongoose ??= { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set. Add it to .env.local");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
