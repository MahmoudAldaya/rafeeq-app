-- Create enum for admin roles
CREATE TYPE admin_role AS ENUM ('superadmin', 'content_manager', 'finance_manager', 'support_agent');

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'support_agent',
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to check user role without triggering RLS recursion
CREATE OR REPLACE FUNCTION get_my_admin_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM admin_profiles WHERE id = auth.uid();
$$;

-- Admins can read their own profile and superadmins can read all
CREATE POLICY "Admins can view profiles"
    ON admin_profiles FOR SELECT
    USING (
        auth.uid() = id OR 
        get_my_admin_role() = 'superadmin'
    );

-- Only superadmins can insert/update other admins
CREATE POLICY "Superadmins can manage admins"
    ON admin_profiles FOR ALL
    USING (
        get_my_admin_role() = 'superadmin'
    );

-- Create a hook to automatically set updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_profiles_updated_at
BEFORE UPDATE ON admin_profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Insert initial superadmin (replace email with the actual admin email)
-- This allows the first user to bootstrap the system.
INSERT INTO admin_profiles (id, email, role, permissions)
SELECT id, email, 'superadmin', '["all"]'::jsonb
FROM auth.users
WHERE email = 'admin@rafeeq.ps' -- CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL if different
ON CONFLICT (id) DO NOTHING;
