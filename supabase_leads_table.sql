-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  value DECIMAL(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT,
  probability INTEGER DEFAULT 10,
  expected_close_date DATE,
  order_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all access for authenticated users" ON leads
  FOR ALL USING (auth.role() = 'authenticated');
