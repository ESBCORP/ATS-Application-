/*
  # Create candidate notes table

  1. New Tables
    - `candidate_notes`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `content` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_by` (uuid, references users)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `candidate_notes` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS candidate_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE candidate_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all candidate notes"
  ON candidate_notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert candidate notes"
  ON candidate_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update candidate notes"
  ON candidate_notes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete candidate notes"
  ON candidate_notes
  FOR DELETE
  TO authenticated
  USING (true);