
-- Weekly rankings table
CREATE TABLE public.weekly_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  training_days INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_emoji TEXT NOT NULL DEFAULT '⚽',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view rankings (leaderboard is public to logged-in users)
CREATE POLICY "Authenticated users can view all rankings"
ON public.weekly_rankings
FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own rankings
CREATE POLICY "Users can insert their own rankings"
ON public.weekly_rankings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own rankings
CREATE POLICY "Users can update their own rankings"
ON public.weekly_rankings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_weekly_rankings_updated_at
BEFORE UPDATE ON public.weekly_rankings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
