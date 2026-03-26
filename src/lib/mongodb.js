import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
};

if (!uri) {
  throw new Error("❌ .env.local файлдаа MONGODB_URI тохируул!");
}

// global cache (TypeScript биш тул safe байдлаар)
let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

export async function getDatabase() {
  if (!cached.promise) {
    const client = new MongoClient(uri, options);
    cached.promise = client.connect();
  }

  cached.client = await cached.promise;

  return cached.client.db(); // default DB
}

export default getDatabase;
