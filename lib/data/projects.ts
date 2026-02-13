import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongo/db"

export interface ProjectRecord {
  id: string
  name: string
  description: string | null
  status: string
  tech_stack: string[]
  repo_url: string | null
  created_at: string
  updated_at: string
}

function serializeProject(project: {
  _id: ObjectId
  name: string
  description: string | null
  status: string
  tech_stack: string[]
  repo_url: string | null
  created_at: Date
  updated_at: Date
}): ProjectRecord {
  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description ?? null,
    status: project.status,
    tech_stack: project.tech_stack ?? [],
    repo_url: project.repo_url ?? null,
    created_at: project.created_at.toISOString(),
    updated_at: project.updated_at.toISOString(),
  }
}

function toObjectId(id: string) {
  try {
    return new ObjectId(id)
  } catch {
    return null
  }
}

export async function getProjectsByUser(userId: string) {
  const db = await getDb()
  const projects = await db
    .collection("projects")
    .find({ user_id: userId })
    .sort({ updated_at: -1 })
    .toArray()

  return projects.map((project) =>
    serializeProject(project as Parameters<typeof serializeProject>[0])
  )
}

export async function getProjectById(userId: string, id: string) {
  const db = await getDb()
  const objectId = toObjectId(id)

  if (!objectId) return null

  const project = await db.collection("projects").findOne({
    _id: objectId,
    user_id: userId,
  })

  if (!project) return null

  return serializeProject(project as Parameters<typeof serializeProject>[0])
}

export async function getProjectsForSelect(userId: string) {
  const db = await getDb()
  const projects = await db
    .collection("projects")
    .find({ user_id: userId })
    .project({ name: 1 })
    .sort({ name: 1 })
    .toArray()

  return projects.map((project) => ({
    id: project._id.toString(),
    name: project.name,
  }))
}
