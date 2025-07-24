/*
  # Create jobs table

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `status` (text)
      - `pay_rate` (numeric)
      - `end_client` (text)
      - `city` (text)
      - `state` (text)
      - `country` (text)
      - `customer` (text)
      - `customer_type` (text)
      - `work_type` (text)
      - `experience_level` (text)
      - `positions` (integer)
      - `placement_type` (text)
      - `client_pay_type` (text)
      - `job_type` (text)
      - `pay_type` (text)
      - `description` (text)
      - `summary` (text)
      - `title_boolean` (text)
      - `skill_boolean` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `jobs` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  pay_rate numeric DEFAULT 0,
  end_client text,
  city text,
  state text,
  country text,
  customer text,
  customer_type text,
  work_type text,
  experience_level text,
  positions integer DEFAULT 1,
  placement_type text,
  client_pay_type text,
  job_type text,
  pay_type text,
  description text,
  summary text,
  title_boolean text,
  skill_boolean text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (true);