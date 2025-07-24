/*
  # Create workflows table

  1. New Tables
    - `workflows`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `nodes` (jsonb)
      - `connections` (jsonb)
      - `status` (text)
      - `last_run` (timestamp)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `workflows` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  connections jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'Draft',
  last_run timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all workflows"
  ON workflows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert workflows"
  ON workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workflows"
  ON workflows
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete workflows"
  ON workflows
  FOR DELETE
  TO authenticated
  USING (true);