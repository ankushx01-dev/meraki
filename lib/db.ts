import mongoose from "mongoose";

const rawMongoUri = process.env.MONGO_URI ?? "";
const MONGO_URI = rawMongoUri.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = globalThis._mongoose ?? { conn: null, promise: null };
globalThis._mongoose = cached;

export async function connectDB() {
  if (!MONGO_URI) throw new Error("Missing MONGO_URI in environment variables.");
  if (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://")) {
    throw new Error('Invalid MONGO_URI. It must start with "mongodb://" or "mongodb+srv://".');
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((m) => m)
      .catch((err: unknown) => {
        // Allow retries after a failed initial connection attempt.
        cached.promise = null;

        const message = err instanceof Error ? err.message : String(err);
        if (message.toLowerCase().includes("bad auth") || message.toLowerCase().includes("authentication failed")) {
          throw new Error(
            "MongoDB authentication failed. Check the username/password in MONGO_URI (and URL-encode special characters)."
          );
        }
        if (message.toLowerCase().includes("ip") && message.toLowerCase().includes("not allowed")) {
          throw new Error(
            "MongoDB network access blocked. In Atlas, add your IP to Network Access (or allow 0.0.0.0/0 for dev)."
          );
        }

        throw err instanceof Error ? err : new Error(message);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

