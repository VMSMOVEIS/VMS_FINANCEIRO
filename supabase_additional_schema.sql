-- Additional Supabase Schema for Production, Inventory and Purchasing

-- 1. Inventory (Estoque)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('mp', 'pa', 'processo')),
  category TEXT, -- 'MDF', 'Ferragem', 'Armário', etc.
  stock_category TEXT NOT NULL DEFAULT 'pronta_entrega' CHECK (stock_category IN ('pronta_entrega', 'sob_medida')),
  brand TEXT,
  model TEXT,
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  location TEXT,
  value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  estimated_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(12, 2) DEFAULT 0,
  max_stock DECIMAL(12, 2) DEFAULT 0,
  margin DECIMAL(12, 2) DEFAULT 0,
  markup DECIMAL(12, 2) DEFAULT 0,
  commission DECIMAL(12, 2) DEFAULT 0,
  warranty TEXT,
  production_lead_time INTEGER DEFAULT 0,
  ncm TEXT,
  cfop TEXT,
  cst_csosn TEXT,
  entry_date DATE DEFAULT CURRENT_DATE,
  track_stock BOOLEAN DEFAULT TRUE,
  average_cost DECIMAL(12, 2) DEFAULT 0,
  last_purchase_cost DECIMAL(12, 2) DEFAULT 0,
  standard_cost DECIMAL(12, 2) DEFAULT 0,
  default_supplier_id UUID,
  purchase_lead_time INTEGER DEFAULT 0,
  min_purchase_quantity DECIMAL(12, 2) DEFAULT 0,
  purchase_unit TEXT,
  consumption_unit TEXT,
  conversion_factor DECIMAL(12, 2) DEFAULT 1,
  thickness DECIMAL(12, 2),
  color TEXT,
  length DECIMAL(12, 2),
  width DECIMAL(12, 2),
  base_material TEXT,
  product_origin TEXT,
  status TEXT DEFAULT 'active',
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

-- Policies for public access (Allow all)
DROP POLICY IF EXISTS "Allow public read inventory" ON inventory;
DROP POLICY IF EXISTS "Allow public write inventory" ON inventory;
CREATE POLICY "Allow all for inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read production_orders" ON production_orders;
DROP POLICY IF EXISTS "Allow public write production_orders" ON production_orders;
CREATE POLICY "Allow all for production_orders" ON production_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read purchase_orders" ON purchase_orders;
DROP POLICY IF EXISTS "Allow public write purchase_orders" ON purchase_orders;
CREATE POLICY "Allow all for purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read stock_aging_configs" ON stock_aging_configs;
DROP POLICY IF EXISTS "Allow public write stock_aging_configs" ON stock_aging_configs;
CREATE POLICY "Allow all for stock_aging_configs" ON stock_aging_configs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read taxes" ON taxes;
DROP POLICY IF EXISTS "Allow public write taxes" ON taxes;
CREATE POLICY "Allow all for taxes" ON taxes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public write profiles" ON profiles;
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read company_profile" ON company_profile;
DROP POLICY IF EXISTS "Allow public write company_profile" ON company_profile;
CREATE POLICY "Allow all for company_profile" ON company_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read notification_settings" ON notification_settings;
DROP POLICY IF EXISTS "Allow public write notification_settings" ON notification_settings;
CREATE POLICY "Allow all for notification_settings" ON notification_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "Allow public write payment_methods" ON payment_methods;
CREATE POLICY "Allow all for payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read customers" ON customers;
DROP POLICY IF EXISTS "Allow public write customers" ON customers;
CREATE POLICY "Allow all for customers" ON customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read quotes" ON quotes;
DROP POLICY IF EXISTS "Allow public write quotes" ON quotes;
CREATE POLICY "Allow all for quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read accounts" ON accounts;
DROP POLICY IF EXISTS "Allow public write accounts" ON accounts;
CREATE POLICY "Allow all for accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public write transactions" ON transactions;
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read payments" ON payments;
DROP POLICY IF EXISTS "Allow public write payments" ON payments;
CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read account_plans" ON account_plans;
DROP POLICY IF EXISTS "Allow public write account_plans" ON account_plans;
CREATE POLICY "Allow all for account_plans" ON account_plans FOR ALL USING (true) WITH CHECK (true);
