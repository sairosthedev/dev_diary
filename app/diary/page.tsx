import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/diary/dashboard-content"
import { getServerAuthSession } from "@/auth"
import { getProjectsByUser } from "@/lib/data/projects"
import { getEntriesByUser } from "@/lib/data/entries"

export default async function DiaryDashboardPage() {
  const session = await getServerAuthSession()

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const [projects, entries] = await Promise.all([
    getProjectsByUser(session.user.id),
    getEntriesByUser(session.user.id),
  ])

  const projectMap = new Map(projects.map((project) => [project.id, project]))
  const entriesWithProjects = entries.slice(0, 10).map((entry) => ({
    ...entry,
    projects: entry.project_id
      ? { name: projectMap.get(entry.project_id)?.name || "" }
      : null,
  }))

  return (
    <DashboardContent
      projects={projects}
      entries={entriesWithProjects}
      userEmail={session.user.email ?? ""}
    />
  )
}
