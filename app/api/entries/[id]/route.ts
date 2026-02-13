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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const entryId = toObjectId(id)

  if (!entryId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const payload = await request.json()

  const updates: Record<string, unknown> = {
    updated_at: new Date(),
  }

  if (payload.title !== undefined) updates.title = payload.title
  if (payload.content !== undefined) updates.content = payload.content
  if (payload.entry_type !== undefined) updates.entry_type = payload.entry_type
  if (payload.mood !== undefined) updates.mood = payload.mood ?? null
  if (payload.tags !== undefined) {
    updates.tags = Array.isArray(payload.tags) ? payload.tags : []
  }
  if (payload.pinned !== undefined) updates.pinned = Boolean(payload.pinned)
  if (payload.project_id !== undefined) {
    const projectId = payload.project_id
      ? toObjectId(payload.project_id)
      : null

    if (payload.project_id && !projectId) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 }
      )
    }

    updates.project_id = projectId
  }

  const db = await getDb()
  const result = await db.collection("entries").updateOne(
    { _id: entryId, user_id: session.user.id },
    { $set: updates }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const db = await getDb()
  const entryId = toObjectId(id)

  if (!entryId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const result = await db.collection("entries").deleteOne({
    _id: entryId,
    user_id: session.user.id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
