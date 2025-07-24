/*
  # Create job QA items table

  1. New Tables
    - `job_qa_items`
      - `id` (uuid, primary key)
      - `job_id` (uuid, references jobs)
      - `question` (text)
      - `answer` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `job_qa_items` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS job_qa_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_qa_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all job QA items"
  ON job_qa_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert job QA items"
  ON job_qa_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update job QA items"
  ON job_qa_items
  FOR UPDATE
  TO authenticated
  USING (true);