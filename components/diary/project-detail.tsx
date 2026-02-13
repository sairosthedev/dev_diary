"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  BookOpen,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ProjectForm } from "./project-form"

interface Entry {
  id: string
  title: string
  content: string
  entry_type: string
  mood: string | null
  created_at: string
  pinned: boolean
}

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  tech_stack: string[]
  repo_url: string | null
  created_at: string
  updated_at: string
}

const statusColors: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/20",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "on-hold": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  archived: "bg-muted text-muted-foreground border-border",
}

const typeColors: Record<string, string> = {
  note: "bg-secondary text-secondary-foreground",
  plan: "bg-primary/15 text-primary",
  log: "bg-muted text-muted-foreground",
  idea: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  bug: "bg-destructive/15 text-destructive",
  milestone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

export function ProjectDetail({
  project,
  entries,
}: {
  project: Project
  entries: Entry[]
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      toast.error("Failed to delete project")
      return
    }

    toast.success("Project deleted")
    router.push("/diary/projects")
    router.refresh()
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your project details.
          </p>
        </div>
        <ProjectForm project={project} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="w-fit gap-2 text-muted-foreground"
      >
        <Link href="/diary/projects">
          <ArrowLeft className="h-4 w-4" /> Projects
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {project.name}
            </h1>
            <Badge
              variant="outline"
              className={`${statusColors[project.status] || ""}`}
            >
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this project. Entries linked to it
                  will remain but be unlinked.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Created {format(new Date(project.created_at), "MMM d, yyyy")}
        </span>
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Repository
          </a>
        )}
      </div>

      {project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <Separator />

      {/* Entries for this project */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Entries ({entries.length})
        </h2>
        <Button asChild size="sm" className="gap-2">
          <Link href={`/diary/entries/new?project=${project.id}`}>
            <Plus className="h-3.5 w-3.5" /> New Entry
          </Link>
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No entries for this project yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/diary/entries/${entry.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold ${typeColors[entry.entry_type] || typeColors.note}`}
              >
                {entry.entry_type[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground group-hover:text-primary">
                  {entry.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {entry.entry_type}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
