import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { getDb } from "@/lib/mongo/db"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase()
  const rawPassword = String(password || "")

  if (!normalizedEmail || rawPassword.length < 8) {
    return NextResponse.json(
      { error: "Email and password (8+ chars) are required." },
      { status: 400 }
    )
  }

  const db = await getDb()
  const existing = await db
    .collection("users")
    .findOne({ email: normalizedEmail })

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    )
  }

  const passwordHash = await hash(rawPassword, 12)
  const now = new Date()

  const result = await db.collection("users").insertOne({
    email: normalizedEmail,
    password_hash: passwordHash,
    created_at: now,
    updated_at: now,
  })

  return NextResponse.json({ id: result.insertedId.toString() })
}
