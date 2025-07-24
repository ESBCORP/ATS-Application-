/*
  # Create candidate resumes table

  1. New Tables
    - `candidate_resumes`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `file_url` (text)
      - `file_name` (text)
      - `is_primary` (boolean)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `candidate_resumes` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS candidate_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  is_primary boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidate_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all candidate resumes"
  ON candidate_resumes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert candidate resumes"
  ON candidate_resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete candidate resumes"
  ON candidate_resumes
  FOR DELETE
  TO authenticated
  USING (true);