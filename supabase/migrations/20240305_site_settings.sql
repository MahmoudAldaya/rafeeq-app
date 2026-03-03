-- Create site_settings table
CREATE TABLE site_settings (
    id INT PRIMARY KEY CHECK (id = 1), -- Ensures only one row exists
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    telegram_url TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Insert the single default row
INSERT INTO site_settings (id, facebook_url, instagram_url, linkedin_url, telegram_url) 
VALUES (1, 'https://facebook.com', 'https://instagram.com', 'https://linkedin.com', 'https://t.me')
ON CONFLICT (id) DO NOTHING;

-- Turn on Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow ANYONE to read settings (needed for the public Footer)
CREATE POLICY "Public can view settings" 
ON site_settings FOR SELECT 
TO public 
USING (true);

-- Create policy to allow ONLY admins to update
CREATE POLICY "Admins can update settings" 
ON site_settings FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.id = auth.uid()
    )
);

-- Allow service role full access
CREATE POLICY "Service role full access on settings" 
ON site_settings FOR ALL 
TO service_role 
USING (true) WITH CHECK (true);
