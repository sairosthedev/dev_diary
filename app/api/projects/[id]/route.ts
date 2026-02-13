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
  const projectId = toObjectId(id)

  if (!projectId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const payload = await request.json()
  const db = await getDb()

  const result = await db.collection("projects").updateOne(
    { _id: projectId, user_id: session.user.id },
    {
      $set: {
        name: payload.name,
        description: payload.description ?? null,
        status: payload.status ?? "active",
        tech_stack: Array.isArray(payload.tech_stack) ? payload.tech_stack : [],
        repo_url: payload.repo_url ?? null,
        updated_at: new Date(),
      },
    }
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
  const projectId = toObjectId(id)

  if (!projectId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const result = await db.collection("projects").deleteOne({
    _id: projectId,
    user_id: session.user.id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.collection("entries").updateMany(
    { user_id: session.user.id, project_id: projectId },
    { $set: { project_id: null, updated_at: new Date() } }
  )

  return NextResponse.json({ ok: true })
}
