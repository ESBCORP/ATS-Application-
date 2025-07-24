/*
  # Create video interview sessions table

  1. New Tables
    - `video_interview_sessions`
      - `id` (uuid, primary key)
      - `template_id` (uuid, references video_interview_templates)
      - `candidate_id` (uuid, references candidates)
      - `job_id` (uuid, references jobs)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration` (integer)
      - `status` (text)
      - `responses` (jsonb)
      - `recording_url` (text)
      - `transcript_url` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `video_interview_sessions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS video_interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES video_interview_templates(id) ON DELETE SET NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration integer,
  status text NOT NULL DEFAULT 'scheduled',
  responses jsonb NOT NULL DEFAULT '[]'::jsonb,
  recording_url text,
  transcript_url text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all video interview sessions"
  ON video_interview_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert video interview sessions"
  ON video_interview_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update video interview sessions"
  ON video_interview_sessions
  FOR UPDATE
  TO authenticated
  USING (true);