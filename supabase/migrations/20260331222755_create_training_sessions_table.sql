/*
  # Create training sessions table

  1. New Tables
    - `training_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `session_name` (text) - Nome da sessão de treino
      - `position` (text) - Posição do atleta durante o treino
      - `exercises_count` (integer) - Quantidade de exercícios completados
      - `exercises_data` (jsonb) - Dados completos dos exercícios
      - `completed_at` (timestamptz) - Data de conclusão
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `training_sessions` table
    - Add policy for users to read their own sessions
    - Add policy for users to insert their own sessions
*/

CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_name text NOT NULL DEFAULT 'Treino Diário',
  position text NOT NULL,
  exercises_count integer NOT NULL DEFAULT 0,
  exercises_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own training sessions"
  ON training_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions"
  ON training_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_completed_at ON training_sessions(completed_at DESC);