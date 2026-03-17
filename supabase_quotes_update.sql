-- Atualização da tabela de Orçamentos (Quotes) com novos campos
-- Execute este script no SQL Editor do Supabase

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS number TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS salesperson TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS store TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS commission DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS other_expenses DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS shipping DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS labor_minutes INTEGER DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS labor_cost DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS indirect_costs DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sale_type TEXT;

-- Garantir que campos existentes tenham os nomes corretos esperados pelo código
-- (Caso a tabela tenha sido criada com nomes diferentes em versões anteriores)
ALTER TABLE quotes RENAME COLUMN IF EXISTS client TO client_name;
ALTER TABLE quotes RENAME COLUMN IF EXISTS product TO product_name;
ALTER TABLE quotes RENAME COLUMN IF EXISTS expiry_date TO expiry_date; -- Apenas para garantir
ALTER TABLE quotes RENAME COLUMN IF EXISTS profit_margin TO profit_margin; -- Apenas para garantir
