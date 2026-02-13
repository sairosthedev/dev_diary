import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Terminal, BookOpen, FolderKanban, Lightbulb } from "lucide-react"
import Link from "next/link"
import { getServerAuthSession } from "@/auth"

export default async function HomePage() {
  const session = await getServerAuthSession()

  if (session?.user) {
    redirect("/diary")
  }

  return (
    <main className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            DevDiary
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Built for developers
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your engineering journal,
            <br />
            <span className="text-primary">organized.</span>
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Track projects, log daily progress, capture ideas, and plan your
            next move. A focused workspace for the developer mind.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Start your diary</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">Projects</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organize your work by project with status tracking and tech stack
              tags.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">Entries</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Daily logs, plans, bug reports, ideas, and milestones in one
              place.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">Insights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              See your activity, mood patterns, and productivity at a glance.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
        DevDiary - Built for developers who ship.
      </footer>
    </main>
  )
}
