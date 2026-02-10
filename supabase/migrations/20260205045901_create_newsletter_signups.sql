/*
  # Create newsletter signups table

  1. New Tables
    - `newsletter_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamptz, default now())
      - `subscribed` (boolean, default true)

  2. Security
    - Enable RLS on `newsletter_signups` table
    - Add policy for public inserts (anyone can subscribe)
    - Add policy for authenticated users to read their own subscription
*/

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscription"
  ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');