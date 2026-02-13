import { MongoClient } from "mongodb"
import { ensureEnv } from "@/lib/env"

type MongoClientPromise = Promise<MongoClient>

const envLocal = ensureEnv([
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
])

const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  console.warn(
    "MONGODB_URI missing. process.env:",
    Boolean(process.env.MONGODB_URI),
    "env file:",
    Boolean(envLocal.MONGODB_URI)
  )
  throw new Error(
    "MONGODB_URI is required. Ensure .env.local is in the project root and restart the dev server."
  )
}

let clientPromise: MongoClientPromise

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: MongoClientPromise | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(mongoUri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(mongoUri)
  clientPromise = client.connect()
}

export async function getDb() {
  const client = await clientPromise
  const dbName = process.env.MONGODB_DB_NAME || "dev_diary"
  return client.db(dbName)
}
