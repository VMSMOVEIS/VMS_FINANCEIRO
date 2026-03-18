-- SQL Migration to add discount and surcharge columns to 'payments' table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS surcharge DECIMAL(12, 2) DEFAULT 0;

COMMENT ON COLUMN payments.discount IS 'Discount applied to this payment installment';
COMMENT ON COLUMN payments.surcharge IS 'Surcharge (acréscimo) applied to this payment installment';
