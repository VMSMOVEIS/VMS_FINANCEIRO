-- SQL Migration to fix Finance module tables
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Add missing columns to 'payments' table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reconciled BOOLEAN DEFAULT FALSE;

-- 2. Ensure 'transactions' table has all required columns
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transaction_type_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_code TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS document_type TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS linked_transaction_id INTEGER;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS linked_payment_id UUID;

-- 3. Update 'type' constraint in 'transactions' if it exists
-- This ensures 'transfer' is a valid type
DO $$ 
BEGIN
    ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
EXCEPTION
    WHEN others THEN null;
END $$;

ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('income', 'expense', 'transfer'));

-- 4. Fix foreign key in 'payments' if there's a type mismatch
-- This ensures that both tables use the same ID type (either UUID or INTEGER)
DO $$
DECLARE
    trans_id_type text;
    pay_trans_id_type text;
BEGIN
    -- Get current types
    SELECT data_type INTO trans_id_type 
    FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'id';

    SELECT data_type INTO pay_trans_id_type 
    FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'transaction_id';

    -- If they don't match, try to align them
    IF trans_id_type != pay_trans_id_type THEN
        IF trans_id_type = 'uuid' THEN
            ALTER TABLE payments ALTER COLUMN transaction_id TYPE UUID USING transaction_id::uuid;
        ELSIF trans_id_type = 'integer' THEN
            ALTER TABLE payments ALTER COLUMN transaction_id TYPE INTEGER USING transaction_id::integer;
        END IF;
    END IF;
END $$;

-- 5. Update payment_methods table
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS default_account_id UUID;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 6. Ensure RLS is enabled and policies exist
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for transactions" ON transactions;
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for payments" ON payments;
CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true) WITH CHECK (true);
