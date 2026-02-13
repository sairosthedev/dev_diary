import { redirect, notFound } from "next/navigation"
import { getServerAuthSession } from "@/auth"
import { getEntryById } from "@/lib/data/entries"
import { getProjectsForSelect } from "@/lib/data/projects"
import { EntryDetail } from "@/components/diary/entry-detail"

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerAuthSession()

  if (!session?.user?.id) redirect("/auth/login")

  const [entry, projects] = await Promise.all([
    getEntryById(session.user.id, id),
    getProjectsForSelect(session.user.id),
  ])

  if (!entry) notFound()

  const projectMatch = entry.project_id
    ? projects.find((project) => project.id === entry.project_id)
    : null

  const entryWithProject = {
    ...entry,
    projects: projectMatch ? { id: projectMatch.id, name: projectMatch.name } : null,
  }

  return <EntryDetail entry={entryWithProject} projects={projects} />
}
