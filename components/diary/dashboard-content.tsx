"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  FolderKanban,
  BookOpen,
  Plus,
  Pin,
  ArrowRight,
  Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  tech_stack: string[]
  created_at: string
  updated_at: string
}

interface Entry {
  id: string
  title: string
  content: string
  entry_type: string
  mood: string | null
  tags: string[]
  pinned: boolean
  created_at: string
  project_id: string | null
  projects: { name: string } | null
}

const statusColors: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/20",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "on-hold": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  archived: "bg-muted text-muted-foreground border-border",
}

const typeIcons: Record<string, string> = {
  note: "N",
  plan: "P",
  log: "L",
  idea: "I",
  bug: "B",
  milestone: "M",
}

const typeColors: Record<string, string> = {
  note: "bg-secondary text-secondary-foreground",
  plan: "bg-primary/15 text-primary",
  log: "bg-muted text-muted-foreground",
  idea: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  bug: "bg-destructive/15 text-destructive",
  milestone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

export function DashboardContent({
  projects,
  entries,
  userEmail,
}: {
  projects: Project[]
  entries: Entry[]
  userEmail: string
}) {
  const activeProjects = projects.filter((p) => p.status === "active")
  const pinnedEntries = entries.filter((e) => e.pinned)
  const recentEntries = entries.slice(0, 5)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, <span className="text-primary">{userEmail.split("@")[0]}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {"Here's what's happening in your engineering world."}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{projects.length}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <FolderKanban className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{activeProjects.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Pin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{pinnedEntries.length}</p>
              <p className="text-xs text-muted-foreground">Pinned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" className="gap-2">
          <Link href="/diary/entries/new">
            <Plus className="h-3.5 w-3.5" />
            New Entry
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/diary/projects/new">
            <Plus className="h-3.5 w-3.5" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent entries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Entries</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 text-xs text-muted-foreground"
            >
              <Link href="/diary/entries">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No entries yet</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/diary/entries/new">Write your first entry</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/diary/entries/${entry.id}`}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${typeColors[entry.entry_type] || typeColors.note}`}
                    >
                      {typeIcons[entry.entry_type] || "N"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-card-foreground group-hover:text-primary">
                          {entry.title}
                        </p>
                        {entry.pinned && (
                          <Pin className="h-3 w-3 shrink-0 text-primary" />
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(entry.created_at), {
                          addSuffix: true,
                        })}
                        {entry.projects?.name && (
                          <>
                            <span className="text-border">{"/"}</span>
                            <span>{entry.projects.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 text-xs text-muted-foreground"
            >
              <Link href="/diary/projects">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <FolderKanban className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No projects yet</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/diary/projects/new">Add your first project</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/diary/projects/${project.id}`}
                    className="group flex items-start justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground group-hover:text-primary">
                        {project.name}
                      </p>
                      {project.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                      {project.tech_stack.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {project.tech_stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] ${statusColors[project.status] || ""}`}
                    >
                      {project.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
