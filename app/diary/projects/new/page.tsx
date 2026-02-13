import dynamic from "next/dynamic"

const ProjectForm = dynamic(
  () =>
    import("@/components/diary/project-form").then((mod) => ({
      default: mod.ProjectForm,
    })),
  { ssr: false }
)

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new project to track in your diary.
        </p>
      </div>
      <ProjectForm />
    </div>
  )
}
