CREATE TABLE public.scheduled_trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scheduled_date DATE NOT NULL,
  training_title TEXT NOT NULL DEFAULT '',
  training_description TEXT NOT NULL DEFAULT '',
  exercises_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scheduled_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own scheduled trainings"
  ON public.scheduled_trainings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own scheduled trainings"
  ON public.scheduled_trainings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled trainings"
  ON public.scheduled_trainings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled trainings"
  ON public.scheduled_trainings FOR DELETE TO authenticated
  USING (auth.uid() = user_id);