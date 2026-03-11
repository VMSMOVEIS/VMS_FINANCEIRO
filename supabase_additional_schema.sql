-- Additional Supabase Schema for Production, Inventory and Purchasing

-- 1. Inventory (Estoque)
CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pronta_entrega', 'sob_medida')),
  type TEXT NOT NULL CHECK (type IN ('mp', 'pa', 'processo')),
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE,
  location TEXT,
  value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  estimated_cost DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Production Orders (Ordens de Produção)
CREATE TABLE production_orders (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 1,
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_production', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  quote_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Purchase Orders (Pedidos de Compra)
CREATE TABLE purchase_orders (
  id TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  effective_date DATE,
  value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'received', 'completed', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  buyer_name TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
  purchase_type TEXT,
  payment_method TEXT,
  account_plan_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Stock Aging Config (Configuração de Envelhecimento de Estoque)
CREATE TABLE stock_aging_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  days INTEGER NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Taxes (Impostos)
CREATE TABLE taxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('das', 'iss', 'icms', 'pis', 'cofins', 'inss', 'fgts', 'other')),
  competence TEXT NOT NULL, -- MM/YYYY
  due_date DATE NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  description TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Profiles and Settings (Perfis e Configurações)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  avatar TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  due_date_alert BOOLEAN NOT NULL DEFAULT true,
  alert_days_before INTEGER NOT NULL DEFAULT 3,
  email_alerts BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Payment Methods (Formas de Pagamento)
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  type TEXT,
  default_account_id UUID,
  discount DECIMAL(12, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Customers (Clientes)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Quotes (Orçamentos)
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

-- 10. Accounts (Contas Bancárias/Caixa)
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

-- 11. Transactions (Lançamentos Financeiros)
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

-- 12. Payments (Pagamentos vinculados a transações)
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

-- 13. Account Plans (Plano de Contas)
CREATE TABLE IF NOT EXISTS account_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_aging_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_plans ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Allow auth read inventory" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write inventory" ON inventory FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read production_orders" ON production_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write production_orders" ON production_orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read purchase_orders" ON purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write purchase_orders" ON purchase_orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read stock_aging_configs" ON stock_aging_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write stock_aging_configs" ON stock_aging_configs FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read taxes" ON taxes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write taxes" ON taxes FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write profiles" ON profiles FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read company_profile" ON company_profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write company_profile" ON company_profile FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read notification_settings" ON notification_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write notification_settings" ON notification_settings FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read payment_methods" ON payment_methods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write payment_methods" ON payment_methods FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write customers" ON customers FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read quotes" ON quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write quotes" ON quotes FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read accounts" ON accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write accounts" ON accounts FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read transactions" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write transactions" ON transactions FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write payments" ON payments FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow auth read account_plans" ON account_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth write account_plans" ON account_plans FOR ALL TO authenticated USING (true);
