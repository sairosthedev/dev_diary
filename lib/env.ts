import { loadEnvConfig } from "@next/env"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

type EnvMap = Record<string, string>

function parseEnvLocal(): EnvMap {
  const envPath = join(process.cwd(), ".env.local")
  if (!existsSync(envPath)) return {}

  const contents = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "")
  const lines = contents.split(/\r?\n/)
  const map: EnvMap = {}

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const sanitized = line.replace(/^[^A-Za-z0-9_#]+/, "")
    if (!sanitized || sanitized.startsWith("#")) continue

    const [rawKey, ...rest] = sanitized.split("=")
    const key = (rawKey || "").trim()
    if (!key) continue

    const value = rest.join("=").trim()
    map[key] = value
  }

  return map
}

export function ensureEnv(keys: string[]) {
  loadEnvConfig(process.cwd())

  const envLocal = parseEnvLocal()
  for (const key of keys) {
    if (envLocal[key]) {
      process.env[key] = envLocal[key]
    }
  }

  return envLocal
}
