-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: ProdBod Prototype Redesign Schema Upgrade
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Product Themes table
CREATE TABLE IF NOT EXISTS public.product_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.product_themes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "pt_select" ON public.product_themes FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "pt_insert" ON public.product_themes FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "pt_update" ON public.product_themes FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "pt_delete" ON public.product_themes FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Update workspace_features table columns
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'idea';
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS pstatus TEXT DEFAULT 'todo';
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'none';
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'none';
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.product_themes(id) ON DELETE SET NULL;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS time_estimate TEXT;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS sprint_points INTEGER DEFAULT 0;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS is_starred BOOLEAN DEFAULT FALSE;
ALTER TABLE public.workspace_features ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- 3. Workspace Tasks table (2nd level hierarchy under features)
CREATE TABLE IF NOT EXISTS public.workspace_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL REFERENCES public.workspace_features(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'UI',
  phase TEXT DEFAULT 'idea',
  pstatus TEXT DEFAULT 'todo',
  urgency TEXT DEFAULT 'none',
  priority TEXT DEFAULT 'none',
  start_date DATE,
  end_date DATE,
  time_estimate TEXT,
  sprint TEXT,
  sprint_points INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "wt_select" ON public.workspace_tasks FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "wt_insert" ON public.workspace_tasks FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "wt_update" ON public.workspace_tasks FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "wt_delete" ON public.workspace_tasks FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Workspace Task Assignees junction
CREATE TABLE IF NOT EXISTS public.workspace_task_assignees (
  task_id UUID REFERENCES public.workspace_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
ALTER TABLE public.workspace_task_assignees ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "wta_select" ON public.workspace_task_assignees FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "wta_insert" ON public.workspace_task_assignees FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "wta_delete" ON public.workspace_task_assignees FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Test Cases table
CREATE TABLE IF NOT EXISTS public.workspace_feature_test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES public.workspace_features(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.workspace_tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pass', 'fail', 'pending'
  bug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workspace_feature_test_cases ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "tc_select" ON public.workspace_feature_test_cases FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tc_insert" ON public.workspace_feature_test_cases FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tc_update" ON public.workspace_feature_test_cases FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tc_delete" ON public.workspace_feature_test_cases FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. Support Tickets table
CREATE TABLE IF NOT EXISTS public.workspace_feature_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES public.workspace_features(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.workspace_tasks(id) ON DELETE CASCADE,
  ticket_id_code TEXT NOT NULL,
  title TEXT NOT NULL,
  customer TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workspace_feature_tickets ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "tck_select" ON public.workspace_feature_tickets FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tck_insert" ON public.workspace_feature_tickets FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tck_update" ON public.workspace_feature_tickets FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "tck_delete" ON public.workspace_feature_tickets FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. Attachments table
CREATE TABLE IF NOT EXISTS public.workspace_feature_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES public.workspace_features(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.workspace_tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'doc', -- 'doc', 'image', 'link'
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workspace_feature_attachments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "att_select" ON public.workspace_feature_attachments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "att_insert" ON public.workspace_feature_attachments FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "att_delete" ON public.workspace_feature_attachments FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. Related Items table
CREATE TABLE IF NOT EXISTS public.workspace_feature_related_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES public.workspace_features(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.workspace_tasks(id) ON DELETE CASCADE,
  related_type TEXT NOT NULL DEFAULT 'feature', -- 'feature', 'task', 'doc'
  related_id UUID,
  related_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workspace_feature_related_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "rel_select" ON public.workspace_feature_related_items FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "rel_insert" ON public.workspace_feature_related_items FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "rel_delete" ON public.workspace_feature_related_items FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
