/*
  # Create video interview templates table

  1. New Tables
    - `video_interview_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `job_id` (uuid, references jobs)
      - `ai_interviewer` (text)
      - `ai_voice` (text)
      - `duration` (integer)
      - `max_response_time` (integer)
      - `questions` (jsonb)
      - `intro_script` (text)
      - `outro_script` (text)
      - `active` (boolean)
      - `usage_count` (integer)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `video_interview_templates` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS video_interview_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  ai_interviewer text NOT NULL DEFAULT 'Jack',
  ai_voice text NOT NULL DEFAULT 'en-US-GuyNeural',
  duration integer NOT NULL DEFAULT 30,
  max_response_time integer NOT NULL DEFAULT 120,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  intro_script text,
  outro_script text,
  active boolean NOT NULL DEFAULT true,
  usage_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_interview_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all video interview templates"
  ON video_interview_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert video interview templates"
  ON video_interview_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update video interview templates"
  ON video_interview_templates
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete video interview templates"
  ON video_interview_templates
  FOR DELETE
  TO authenticated
  USING (true);