"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Pin,
  Clock,
  FolderKanban,
} from "lucide-react"
import { format } from "date-fns"
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
import { EntryForm } from "./entry-form"

interface Entry {
  id: string
  title: string
  content: string
  entry_type: string
  mood: string | null
  tags: string[]
  pinned: boolean
  created_at: string
  updated_at: string
  project_id: string | null
  projects: { id: string; name: string } | null
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

export function EntryDetail({
  entry,
  projects,
}: {
  entry: Entry
  projects: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    const response = await fetch(`/api/entries/${entry.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      toast.error("Failed to delete entry")
      return
    }

    toast.success("Entry deleted")
    router.push("/diary/entries")
    router.refresh()
  }

  const togglePin = async () => {
    const response = await fetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !entry.pinned }),
    })

    if (!response.ok) {
      toast.error("Failed to update pin")
      return
    }

    toast.success(entry.pinned ? "Unpinned" : "Pinned")
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
          <h1 className="text-2xl font-bold text-foreground">Edit Entry</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your diary entry.
          </p>
        </div>
        <EntryForm projects={projects} entry={entry} />
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
        <Link href="/diary/entries">
          <ArrowLeft className="h-4 w-4" /> Entries
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold ${typeColors[entry.entry_type] || typeColors.note}`}
            >
              {entry.entry_type[0].toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {entry.title}
            </h1>
            {entry.pinned && <Pin className="h-4 w-4 text-primary" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={togglePin}
          >
            <Pin className="h-3.5 w-3.5" />
            {entry.pinned ? "Unpin" : "Pin"}
          </Button>
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
                <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this diary entry.
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

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")}
        </span>
        <Badge variant="outline" className="capitalize">
          {entry.entry_type}
        </Badge>
        {entry.mood && (
          <span className="text-sm">
            {moodLabels[entry.mood] || entry.mood}
          </span>
        )}
        {entry.projects && (
          <Link
            href={`/diary/projects/${entry.projects.id}`}
            className="flex items-center gap-1.5 text-primary hover:underline"
          >
            <FolderKanban className="h-3.5 w-3.5" />
            {entry.projects.name}
          </Link>
        )}
      </div>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Separator />

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <div className="whitespace-pre-wrap font-mono text-sm text-card-foreground leading-relaxed">
            {entry.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
