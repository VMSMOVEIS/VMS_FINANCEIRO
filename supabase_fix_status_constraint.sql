-- SQL Migration to fix status constraint in transactions table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Drop the existing constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;
EXCEPTION
    WHEN others THEN null;
END $$;

-- 2. Add the updated constraint with all allowed values
ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'partial', 'a_compensar'));

-- 3. Also check payments table status constraint just in case
DO $$ 
BEGIN
    ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
EXCEPTION
    WHEN others THEN null;
END $$;

ALTER TABLE payments 
ADD CONSTRAINT payments_status_check 
CHECK (status IN ('pending', 'completed'));
