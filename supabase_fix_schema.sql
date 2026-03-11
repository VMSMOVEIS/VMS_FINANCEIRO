-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Unified Payment Methods Table
-- This table is shared between Finance and Sales modules
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  type TEXT, -- Used by Finance
  default_account_id UUID, -- Used by Finance
  discount DECIMAL(12, 2) DEFAULT 0, -- Used by Sales
  active BOOLEAN DEFAULT true, -- Used by Sales
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to payment_methods if it already exists
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS default_account_id UUID;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 2. Customers (Clientes)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Quotes (Orçamentos)
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  product_name TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  items JSONB DEFAULT '[]',
  bom_items JSONB DEFAULT '[]',
  profit_margin DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Accounts (Contas Bancárias/Caixa)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bank TEXT,
  account_number TEXT,
  type TEXT NOT NULL,
  balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Transactions (Lançamentos Financeiros)
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT,
  category_code TEXT,
  value DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  transaction_type_id TEXT,
  document_type TEXT,
  order_number TEXT,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payments (Pagamentos vinculados a transações)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  bank_id UUID REFERENCES accounts(id),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Account Plans (Plano de Contas)
CREATE TABLE IF NOT EXISTS account_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
DO $$ 
BEGIN
  -- Payment Methods
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Allow auth all payment_methods') THEN
    CREATE POLICY "Allow auth all payment_methods" ON payment_methods FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Customers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Allow auth all customers') THEN
    CREATE POLICY "Allow auth all customers" ON customers FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Quotes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Allow auth all quotes') THEN
    CREATE POLICY "Allow auth all quotes" ON quotes FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Accounts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Allow auth all accounts') THEN
    CREATE POLICY "Allow auth all accounts" ON accounts FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Transactions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Allow auth all transactions') THEN
    CREATE POLICY "Allow auth all transactions" ON transactions FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Payments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Allow auth all payments') THEN
    CREATE POLICY "Allow auth all payments" ON payments FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Account Plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'account_plans' AND policyname = 'Allow auth all account_plans') THEN
    CREATE POLICY "Allow auth all account_plans" ON account_plans FOR ALL TO authenticated USING (true);
  END IF;
END $$;
