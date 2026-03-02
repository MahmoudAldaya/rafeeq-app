-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('service_request', 'new_user', 'system')),
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    link TEXT,
    order_id UUID -- Optional reference to an order
);

-- Turn on Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admins to read notifications
CREATE POLICY "Admins can view all notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.id = auth.uid()
    )
);

-- Create policy to allow only admins to update read status
CREATE POLICY "Admins can update notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.id = auth.uid()
    )
);

-- Create policy for the service role (backend API) to insert notifications
CREATE POLICY "Service role can insert notifications" 
ON notifications FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Also allow service role to manage everything just in case
CREATE POLICY "Service role can do anything with notifications" 
ON notifications FOR ALL 
TO service_role 
USING (true) WITH CHECK (true);
