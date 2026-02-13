import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/auth"
import { getProjectsForSelect } from "@/lib/data/projects"
import { EntryForm } from "@/components/diary/entry-form"

export default async function NewEntryPage() {
  const session = await getServerAuthSession()

  if (!session?.user?.id) redirect("/auth/login")

  const projects = await getProjectsForSelect(session.user.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Entry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log a note, plan, idea, bug, or milestone.
        </p>
      </div>
      <EntryForm projects={projects} />
    </div>
  )
}
