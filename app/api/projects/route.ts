import { NextResponse } from "next/server"
import { getServerAuthSession } from "@/auth"
import { getDb } from "@/lib/mongo/db"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()

  if (!payload?.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const db = await getDb()
  const now = new Date()

  const result = await db.collection("projects").insertOne({
    user_id: session.user.id,
    name: payload.name,
    description: payload.description ?? null,
    status: payload.status ?? "active",
    tech_stack: Array.isArray(payload.tech_stack) ? payload.tech_stack : [],
    repo_url: payload.repo_url ?? null,
    created_at: now,
    updated_at: now,
  })

  return NextResponse.json({ id: result.insertedId.toString() })
}
