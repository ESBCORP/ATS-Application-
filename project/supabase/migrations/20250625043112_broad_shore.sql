/*
  # Create submissions table

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `job_id` (uuid, references jobs)
      - `status` (text)
      - `pay_type` (text)
      - `expected_pay` (numeric)
      - `city` (text)
      - `state` (text)
      - `job_hiring_type` (text)
      - `availability` (text)
      - `engagement` (text)
      - `location_preference` (text)
      - `bill_type` (text)
      - `bill_rate` (numeric)
      - `pay_rate` (numeric)
      - `email` (text)
      - `phone` (text)
      - `work_authorization` (text)
      - `linkedin_url` (text)
      - `rejection_reason` (text)
      - `rejection_comments` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `submissions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Submitted',
  pay_type text,
  expected_pay numeric DEFAULT 0,
  city text,
  state text,
  job_hiring_type text,
  availability text,
  engagement text,
  location_preference text,
  bill_type text,
  bill_rate numeric DEFAULT 0,
  pay_rate numeric DEFAULT 0,
  email text,
  phone text,
  work_authorization text,
  linkedin_url text,
  rejection_reason text,
  rejection_comments text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (true);