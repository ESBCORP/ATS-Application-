/*
  # Resources and Permissions Schema

  1. New Tables
    - `resources` - Stores application resources that can have permissions
    - `permissions` - Stores role-based permissions for each resource
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - SuperAdmin has full access to both tables
  
  3. Default Data
    - Creates default resources (jobs, candidates, submissions, users)
    - Sets up default permissions for SuperAdmin, Admin, and Employee roles
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'Users can read all resources'
  ) THEN
    CREATE POLICY "Users can read all resources"
      ON resources
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'SuperAdmin can insert resources'
  ) THEN
    CREATE POLICY "SuperAdmin can insert resources"
      ON resources
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.jwt() ->> 'role' = 'SuperAdmin');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'SuperAdmin can update resources'
  ) THEN
    CREATE POLICY "SuperAdmin can update resources"
      ON resources
      FOR UPDATE
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'SuperAdmin');
  END IF;
END $$;

-- Policies for permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'permissions' AND policyname = 'Users can read all permissions'
  ) THEN
    CREATE POLICY "Users can read all permissions"
      ON permissions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'permissions' AND policyname = 'SuperAdmin can insert permissions'
  ) THEN
    CREATE POLICY "SuperAdmin can insert permissions"
      ON permissions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.jwt() ->> 'role' = 'SuperAdmin');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'permissions' AND policyname = 'SuperAdmin can update permissions'
  ) THEN
    CREATE POLICY "SuperAdmin can update permissions"
      ON permissions
      FOR UPDATE
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'SuperAdmin');
  END IF;
END $$;

-- Insert default resources
INSERT INTO resources (name, description) VALUES
  ('jobs', 'Job management'),
  ('candidates', 'Candidate management'),
  ('submissions', 'Submission management'),
  ('users', 'User management')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions for roles
DO $$
DECLARE
  res_id uuid;
BEGIN
  FOR res_id IN SELECT id FROM resources LOOP
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (res_id, 'SuperAdmin', true, true, true, true)
    ON CONFLICT (resource_id, role) DO NOTHING;
    
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (res_id, 'Admin', true, true, true, false)
    ON CONFLICT (resource_id, role) DO NOTHING;
    
    INSERT INTO permissions (resource_id, role, can_read, can_create, can_update, can_delete)
    VALUES (res_id, 'Employee', true, true, false, false)
    ON CONFLICT (resource_id, role) DO NOTHING;
  END LOOP;
END $$;