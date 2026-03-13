-- SQL Schema for Leads and Customers (Gestão de Clientes)
-- This script creates the tables and sets up public access policies for Supabase.

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    value NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'new',
    last_contact TIMESTAMP WITH TIME ZONE,
    date DATE DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'Site',
    probability INTEGER DEFAULT 10,
    notes TEXT,
    order_description TEXT,
    expected_close_date DATE,
    address TEXT,
    street TEXT,
    number TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT DEFAULT 'company',
    document_type TEXT DEFAULT 'CNPJ',
    name TEXT NOT NULL,
    business_name TEXT,
    document TEXT,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    address TEXT,
    street TEXT,
    number TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    lead_id UUID REFERENCES leads(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Policies (Anyone can SELECT, INSERT, UPDATE, DELETE)
-- Note: In a production environment, you should restrict these policies.

-- Policies for Leads
CREATE POLICY "Public Access Leads Select" ON leads FOR SELECT USING (true);
CREATE POLICY "Public Access Leads Insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Access Leads Update" ON leads FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Leads Delete" ON leads FOR DELETE USING (true);

-- Policies for Customers
CREATE POLICY "Public Access Customers Select" ON customers FOR SELECT USING (true);
CREATE POLICY "Public Access Customers Insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Access Customers Update" ON customers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Customers Delete" ON customers FOR DELETE USING (true);
