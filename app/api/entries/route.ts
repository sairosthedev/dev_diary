import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getServerAuthSession } from "@/auth"
import { getDb } from "@/lib/mongo/db"

export const runtime = "nodejs"

function toObjectId(id: string) {
  try {
    return new ObjectId(id)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()

  if (!payload?.title || !payload?.content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    )
  }

  const db = await getDb()
  const now = new Date()
  const projectId = payload.project_id
    ? toObjectId(payload.project_id)
    : null

  if (payload.project_id && !projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 })
  }

  const result = await db.collection("entries").insertOne({
    user_id: session.user.id,
    title: payload.title,
    content: payload.content,
    entry_type: payload.entry_type ?? "note",
    mood: payload.mood ?? null,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    pinned: Boolean(payload.pinned),
    project_id: projectId,
    created_at: now,
    updated_at: now,
  })

  return NextResponse.json({ id: result.insertedId.toString() })
}
