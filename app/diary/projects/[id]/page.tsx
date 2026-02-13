import { redirect, notFound } from "next/navigation"
import { getServerAuthSession } from "@/auth"
import { getProjectById } from "@/lib/data/projects"
import { getEntriesByProject } from "@/lib/data/entries"
import { ProjectDetail } from "@/components/diary/project-detail"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerAuthSession()

  if (!session?.user?.id) redirect("/auth/login")

  const [project, entries] = await Promise.all([
    getProjectById(session.user.id, id),
    getEntriesByProject(session.user.id, id),
  ])

  if (!project) notFound()

  return <ProjectDetail project={project} entries={entries} />
}
