import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = uri ? new MongoClient(uri, options) : null;
const clientPromise = client ? (global.__mongoClientPromise ?? (global.__mongoClientPromise = client.connect())) : null;

export async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const mongoClient = await clientPromise;
  return mongoClient.db();
}
