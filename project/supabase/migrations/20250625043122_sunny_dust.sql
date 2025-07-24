/*
  # Create candidate documents table

  1. New Tables
    - `candidate_documents`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `file_url` (text)
      - `file_name` (text)
      - `file_type` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `candidate_documents` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS candidate_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all candidate documents"
  ON candidate_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert candidate documents"
  ON candidate_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete candidate documents"
  ON candidate_documents
  FOR DELETE
  TO authenticated
  USING (true);