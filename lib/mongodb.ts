import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== "test") {
  // Allow build without URI; connection will fail at runtime instead.
  console.warn("[mongodb] MONGODB_URI is not set");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => {
        const { host, port, name } = m.connection;
        // eslint-disable-next-line no-console
        console.log(
          `\x1b[32m✓ DB Connected\x1b[0m → mongodb://${host}:${port}/${name}`
        );
        m.connection.on("disconnected", () => {
          // eslint-disable-next-line no-console
          console.warn("\x1b[33m✗ DB Disconnected\x1b[0m");
        });
        m.connection.on("reconnected", () => {
          // eslint-disable-next-line no-console
          console.log("\x1b[32m✓ DB Reconnected\x1b[0m");
        });
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        // eslint-disable-next-line no-console
        console.error("\x1b[31m✗ DB Connection Failed\x1b[0m", err.message);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
