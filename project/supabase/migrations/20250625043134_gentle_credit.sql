/*
  # Create workflow executions table

  1. New Tables
    - `workflow_executions`
      - `id` (uuid, primary key)
      - `workflow_id` (uuid, references workflows)
      - `status` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration` (integer)
      - `triggered_by` (text)
      - `logs` (jsonb)
      - `waiting_for_webhook` (jsonb)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `workflow_executions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Running',
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration integer,
  triggered_by text NOT NULL DEFAULT 'Manual',
  logs jsonb NOT NULL DEFAULT '[]'::jsonb,
  waiting_for_webhook jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all workflow executions"
  ON workflow_executions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert workflow executions"
  ON workflow_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workflow executions"
  ON workflow_executions
  FOR UPDATE
  TO authenticated
  USING (true);