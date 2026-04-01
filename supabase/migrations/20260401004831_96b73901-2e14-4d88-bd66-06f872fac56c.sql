CREATE TABLE public.training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_name TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT '',
  exercises_count INTEGER NOT NULL DEFAULT 0,
  exercises_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own training sessions"
  ON public.training_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own training sessions"
  ON public.training_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);