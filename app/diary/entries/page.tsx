import { redirect } from "next/navigation"
import { EntriesList } from "@/components/diary/entries-list"
import { getServerAuthSession } from "@/auth"
import { getEntriesByUser } from "@/lib/data/entries"
import { getProjectsForSelect } from "@/lib/data/projects"

export default async function EntriesPage() {
  const session = await getServerAuthSession()

  if (!session?.user?.id) redirect("/auth/login")

  const [entries, projects] = await Promise.all([
    getEntriesByUser(session.user.id),
    getProjectsForSelect(session.user.id),
  ])

  const projectMap = new Map(projects.map((project) => [project.id, project]))
  const entriesWithProjects = entries.map((entry) => ({
    ...entry,
    projects: entry.project_id
      ? { name: projectMap.get(entry.project_id)?.name || "" }
      : null,
  }))

  return <EntriesList entries={entriesWithProjects} projects={projects} />
}
