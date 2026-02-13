import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongo/db"

export interface EntryRecord {
  id: string
  title: string
  content: string
  entry_type: string
  mood: string | null
  tags: string[]
  pinned: boolean
  created_at: string
  updated_at: string
  project_id: string | null
  projects?: { id: string; name: string } | null
}

function serializeEntry(entry: {
  _id: ObjectId
  title: string
  content: string
  entry_type: string
  mood: string | null
  tags: string[]
  pinned: boolean
  created_at: Date
  updated_at: Date
  project_id: ObjectId | null
}): EntryRecord {
  return {
    id: entry._id.toString(),
    title: entry.title,
    content: entry.content,
    entry_type: entry.entry_type,
    mood: entry.mood ?? null,
    tags: entry.tags ?? [],
    pinned: entry.pinned ?? false,
    created_at: entry.created_at.toISOString(),
    updated_at: entry.updated_at.toISOString(),
    project_id: entry.project_id ? entry.project_id.toString() : null,
  }
}

function toObjectId(id: string) {
  try {
    return new ObjectId(id)
  } catch {
    return null
  }
}

export async function getEntriesByUser(userId: string) {
  const db = await getDb()
  const entries = await db
    .collection("entries")
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray()

  return entries.map((entry) =>
    serializeEntry(entry as Parameters<typeof serializeEntry>[0])
  )
}

export async function getEntriesByProject(userId: string, projectId: string) {
  const db = await getDb()
  const objectId = toObjectId(projectId)

  if (!objectId) return []

  const entries = await db
    .collection("entries")
    .find({ user_id: userId, project_id: objectId })
    .sort({ created_at: -1 })
    .toArray()

  return entries.map((entry) =>
    serializeEntry(entry as Parameters<typeof serializeEntry>[0])
  )
}

export async function getEntryById(userId: string, id: string) {
  const db = await getDb()
  const objectId = toObjectId(id)

  if (!objectId) return null

  const entry = await db.collection("entries").findOne({
    _id: objectId,
    user_id: userId,
  })

  if (!entry) return null

  return serializeEntry(entry as Parameters<typeof serializeEntry>[0])
}
