/*
  # Create candidates table

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `middle_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `job_title` (text)
      - `linkedin_url` (text)
      - `status` (text)
      - `work_authorization` (text)
      - `years_of_experience` (integer)
      - `city` (text)
      - `state` (text)
      - `country` (text)
      - `skills` (text)
      - `rtr_status` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `candidates` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  job_title text,
  linkedin_url text,
  status text NOT NULL DEFAULT 'Active',
  work_authorization text,
  years_of_experience integer DEFAULT 0,
  city text,
  state text,
  country text,
  skills text,
  rtr_status text DEFAULT 'Not Received',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert candidates"
  ON candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update candidates"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (true);