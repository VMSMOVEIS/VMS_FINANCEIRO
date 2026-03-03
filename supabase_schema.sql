-- Supabase Schema for VMS Financeiro

-- 1. Profiles (User and Company)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT,
  phone TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Financial Structure
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bank TEXT,
  account_number TEXT,
  type TEXT CHECK (type IN ('bank', 'cash', 'investment', 'other')),
  balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS account_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('receita', 'despesa')),
  parent_id UUID REFERENCES account_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pix', 'cash', 'debit_card', 'credit_card', 'boleto', 'transfer', 'other', 'advance')),
  default_account_id UUID REFERENCES accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT, -- Can be linked to account_plans
  value DECIMAL(15, 2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  transaction_type_id TEXT, -- 'venda', 'compra', etc.
  document_type TEXT,
  order_number TEXT,
  customer_name TEXT,
  status TEXT CHECK (status IN ('completed', 'pending', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id BIGINT REFERENCES transactions(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  due_date DATE NOT NULL,
  bank_id UUID REFERENCES accounts(id),
  destination TEXT,
  source TEXT,
  status TEXT CHECK (status IN ('completed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Audit Log / Operational History (Optional but good for "Operational History")
-- Usually derived from transactions, but can be explicit
CREATE VIEW operational_history AS
SELECT 
  t.id,
  t.date,
  t.description,
  t.customer_name,
  t.value,
  t.type,
  t.transaction_type_id,
  t.status
FROM transactions t;

-- 5. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow anonymous access for prototype/demo)
-- WARNING: In production, you should use auth.uid() to restrict access.
CREATE POLICY "Allow all for accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for account_plans" ON account_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for companies" ON companies FOR ALL USING (true) WITH CHECK (true);
