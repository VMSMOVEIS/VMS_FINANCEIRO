-- 1. Add multi_accounts column to transactions table for accounting splits
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS multi_accounts JSONB;

-- 2. Add "A Definir" to payment_methods if it doesn't exist
INSERT INTO payment_methods (name, type)
SELECT 'A Definir', 'other'
WHERE NOT EXISTS (
    SELECT 1 FROM payment_methods WHERE name = 'A Definir'
);

-- 3. Ensure critical account plans are present for auto-fill logic
-- Ativo Circulante -> Disponibilidades
INSERT INTO account_plans (code, name, type, level)
SELECT '1.1.01.01', 'Caixa', 'ativo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '1.1.01.01');

INSERT INTO account_plans (code, name, type, level)
SELECT '1.1.01.02', 'Banco Conta Corrente', 'ativo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '1.1.01.02');

-- Contas a Receber / Pagar
INSERT INTO account_plans (code, name, type, level)
SELECT '1.1.02.01', 'Clientes', 'ativo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '1.1.02.01');

INSERT INTO account_plans (code, name, type, level)
SELECT '2.1.01.01', 'Fornecedores', 'passivo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '2.1.01.01');

-- Adiantamentos
INSERT INTO account_plans (code, name, type, level)
SELECT '2.1.05.01', 'Adiantamento de Clientes', 'passivo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '2.1.05.01');

INSERT INTO account_plans (code, name, type, level)
SELECT '1.1.04.02', 'Adiantamento a Fornecedores', 'ativo', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '1.1.04.02');

-- Receitas e Despesas Genéricas (para fallback)
INSERT INTO account_plans (code, name, type, level)
SELECT '4.1.01', 'Receita de Vendas', 'receita', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '4.1.01');

INSERT INTO account_plans (code, name, type, level)
SELECT '6.1.01', 'Despesas Administrativas', 'despesa', 4
WHERE NOT EXISTS (SELECT 1 FROM account_plans WHERE code = '6.1.01');
