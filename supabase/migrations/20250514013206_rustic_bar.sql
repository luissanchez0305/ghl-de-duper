/*
  # Create merge logs table

  1. New Tables
    - `merge_logs`
      - `id` (uuid, primary key)
      - `location_id` (text, required)
      - `group_id` (text, required)
      - `master_id` (text, required)
      - `duplicate_ids` (text[], required)
      - `merge_options` (jsonb, required)
      - `status` (text, required)
      - `error` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `merge_logs` table
    - Add policy for authenticated users to read their own logs
*/

CREATE TABLE IF NOT EXISTS merge_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id text NOT NULL,
  group_id text NOT NULL,
  master_id text NOT NULL,
  duplicate_ids text[] NOT NULL,
  merge_options jsonb NOT NULL,
  status text NOT NULL,
  error text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merge_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own logs"
  ON merge_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = location_id);