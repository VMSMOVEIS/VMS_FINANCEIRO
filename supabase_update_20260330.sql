-- SQL Migration - 2026-03-30
-- Consolidação de todas as alterações recentes para o sistema financeiro e contábil.
-- Copie e cole este script no Editor SQL do seu painel Supabase.

-- 1. Atualização da tabela 'accounts' (Contas Bancárias/Caixa)
-- Adiciona campos para o número da conta e vínculo com o plano de contas
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_plan_id UUID;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_plan_name TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_plan_code TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS initial_balance DECIMAL(12, 2) DEFAULT 0;

-- 2. Atualização da tabela 'payments' (Parcelas/Pagamentos)
-- Adiciona campos para descontos, acréscimos e reconciliação
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS surcharge DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reconciled BOOLEAN DEFAULT FALSE;

-- 3. Atualização da tabela 'transactions' (Lançamentos)
-- Adiciona campo para partidas dobradas (contabilidade) e metadados
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS multi_accounts JSONB;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transaction_type_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_code TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS document_type TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS linked_transaction_id INTEGER;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS linked_payment_id UUID;

-- 4. Atualização da tabela 'payment_methods' (Formas de Pagamento)
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS default_account_id UUID;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- 5. Garantir que a tabela 'account_plans' (Plano de Contas) existe com a estrutura correta
CREATE TABLE IF NOT EXISTS account_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inserir Forma de Pagamento padrão se não existir
INSERT INTO payment_methods (name, type)
SELECT 'A Definir', 'other'
WHERE NOT EXISTS (
    SELECT 1 FROM payment_methods WHERE name = 'A Definir'
);

-- 7. Habilitar RLS (Row Level Security) e criar políticas de acesso
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Permitir tudo para usuários autenticados - Ajuste conforme sua necessidade de segurança)
DO $$ 
BEGIN
    -- Accounts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Allow all for accounts') THEN
        CREATE POLICY "Allow all for accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Transactions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Allow all for transactions') THEN
        CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Payments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Allow all for payments') THEN
        CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Account Plans
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'account_plans' AND policyname = 'Allow all for account_plans') THEN
        CREATE POLICY "Allow all for account_plans" ON account_plans FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Payment Methods
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Allow all for payment_methods') THEN
        CREATE POLICY "Allow all for payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Comentários para documentação
COMMENT ON COLUMN accounts.account_number IS 'Número da conta bancária';
COMMENT ON COLUMN payments.discount IS 'Desconto aplicado nesta parcela';
COMMENT ON COLUMN payments.surcharge IS 'Acréscimo aplicado nesta parcela';
COMMENT ON COLUMN transactions.multi_accounts IS 'Dados para lançamentos contábeis de partidas dobradas';
