"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Plus, Search, BookOpen, Pin, Clock } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

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

const typeColors: Record<string, string> = {
  note: "bg-secondary text-secondary-foreground",
  plan: "bg-primary/15 text-primary",
  log: "bg-muted text-muted-foreground",
  idea: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  bug: "bg-destructive/15 text-destructive",
  milestone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

const moodLabels: Record<string, string> = {
  productive: "Productive",
  neutral: "Neutral",
  frustrated: "Frustrated",
  excited: "Excited",
  tired: "Tired",
}

const entryTypes = [
  { value: "all", label: "All Types" },
  { value: "note", label: "Notes" },
  { value: "plan", label: "Plans" },
  { value: "log", label: "Logs" },
  { value: "idea", label: "Ideas" },
  { value: "bug", label: "Bugs" },
  { value: "milestone", label: "Milestones" },
]

export function EntriesList({
  entries,
  projects,
}: {
  entries: Entry[]
  projects: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = typeFilter === "all" || e.entry_type === typeFilter
    return matchSearch && matchType
  })

  // Group pinned entries first
  const pinned = filtered.filter((e) => e.pinned)
  const unpinned = filtered.filter((e) => !e.pinned)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"} total
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/diary/entries/new">
            <Plus className="h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {entryTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">
              {search || typeFilter !== "all"
                ? "No matching entries"
                : "No entries yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || typeFilter !== "all"
                ? "Try adjusting your filters."
                : "Write your first diary entry to get started."}
            </p>
          </div>
          {!search && typeFilter === "all" && (
            <Button asChild variant="outline" size="sm">
              <Link href="/diary/entries/new">Write an entry</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pinned.length > 0 && (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Pinned
              </p>
              {pinned.map((entry) => (
                <EntryRow key={entry.id} entry={entry} />
              ))}
              {unpinned.length > 0 && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  All Entries
                </p>
              )}
            </>
          )}
          {unpinned.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/diary/entries/${entry.id}`}
      className="group flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
    >
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold ${typeColors[entry.entry_type] || typeColors.note}`}
      >
        {entry.entry_type[0].toUpperCase()}
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
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {entry.content}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(entry.created_at), {
              addSuffix: true,
            })}
          </span>
          {entry.projects?.name && (
            <Badge variant="outline" className="text-[10px]">
              {entry.projects.name}
            </Badge>
          )}
          {entry.mood && (
            <span className="text-xs text-muted-foreground">
              {moodLabels[entry.mood] || entry.mood}
            </span>
          )}
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
