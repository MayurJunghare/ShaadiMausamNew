/*
  # Create wedding_searches table (3 searches per user per day)

  1. New Tables
    - `wedding_searches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text, not null)
      - `wedding_date_start` (date, not null)
      - `wedding_date_end` (date, nullable)
      - `location` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Index for fast daily count per user
  3. Security: RLS so users can insert/select only their own rows
*/

CREATE TABLE IF NOT EXISTS public.wedding_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  wedding_date_start date NOT NULL,
  wedding_date_end date,
  location text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wedding_searches_user_date
  ON public.wedding_searches (user_id, (created_at::date));

ALTER TABLE public.wedding_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own wedding_searches"
  ON public.wedding_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own wedding_searches"
  ON public.wedding_searches FOR SELECT
  USING (auth.uid() = user_id);
