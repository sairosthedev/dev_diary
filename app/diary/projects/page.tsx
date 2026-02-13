import { redirect } from "next/navigation"
import { ProjectsList } from "@/components/diary/projects-list"
import { getServerAuthSession } from "@/auth"
import { getProjectsByUser } from "@/lib/data/projects"

export default async function ProjectsPage() {
  const session = await getServerAuthSession()

  if (!session?.user?.id) redirect("/auth/login")

  const projects = await getProjectsByUser(session.user.id)

  return <ProjectsList projects={projects} />
}
