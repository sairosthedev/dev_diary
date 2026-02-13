-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'archived')),
  tech_stack TEXT[] DEFAULT '{}',
  repo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own_projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_delete_own_projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Diary entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  entry_type TEXT NOT NULL DEFAULT 'note' CHECK (entry_type IN ('note', 'plan', 'log', 'idea', 'bug', 'milestone')),
  mood TEXT CHECK (mood IN ('productive', 'neutral', 'frustrated', 'excited', 'tired')),
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own_entries" ON entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_entries" ON entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_entries" ON entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_delete_own_entries" ON entries FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
