/*
  # Create permissions tables

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    - `permissions`
      - `id` (uuid, primary key)
      - `resource_id` (uuid, references resources)
      - `role` (text)
      - `can_read` (boolean)
      - `can_create` (boolean)
      - `can_update` (boolean)
      - `can_delete` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  role text NOT NULL,
  can_read boolean NOT NULL DEFAULT false,
  can_create boolean NOT NULL DEFAULT false,
  can_update boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, role)
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Policies for resources
CREATE POLICY "Users can read all resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "SuperAdmin can insert resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'SuperAdmin');

CREATE POLICY "SuperAdmin can update resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'SuperAdmin');

-- Policies for permissions
CREATE POLICY "Users can read all permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "SuperAdmin can insert permissions"
  ON permissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'SuperAdmin');

CREATE POLICY "SuperAdmin can update permissions"
  ON permissions
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'SuperAdmin');

-- Insert default resources
INSERT INTO resources (name, description) VALUES
  ('jobs', 'Job management'),
  ('candidates', 'Candidate management'),
  ('submissions', 'Submission management'),
  ('users', 'User management')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions for SuperAdmin
DO $$
DECLARE
  resource_id uuid;
BEGIN
  FOR resource_id IN SELECT id FROM resources LOOP
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (resource_id, 'SuperAdmin', true, true, true, true)
    ON CONFLICT (resource_id, role) DO NOTHING;
    
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (resource_id, 'Admin', true, true, true, false)
    ON CONFLICT (resource_id, role) DO NOTHING;
    
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (resource_id, 'Employee', true, true, false, false)
    ON CONFLICT (resource_id, role) DO NOTHING;
  END LOOP;
END $$;