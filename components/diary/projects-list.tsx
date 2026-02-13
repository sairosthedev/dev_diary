"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search, FolderKanban, ExternalLink } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

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

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("")

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/diary/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">
              {search ? "No matching projects" : "No projects yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try adjusting your search."
                : "Create your first project to get started."}
            </p>
          </div>
          {!search && (
            <Button asChild variant="outline" size="sm">
              <Link href="/diary/projects/new">Create project</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <Link key={project.id} href={`/diary/projects/${project.id}`}>
              <Card className="group h-full transition-colors hover:border-primary/30">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                      {project.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] ${statusColors[project.status] || ""}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Updated{" "}
                      {formatDistanceToNow(new Date(project.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {project.repo_url && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
