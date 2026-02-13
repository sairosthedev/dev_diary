import { DiaryShell } from "@/components/diary/diary-shell"

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DiaryShell>{children}</DiaryShell>
}
