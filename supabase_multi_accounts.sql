-- Add multi_accounts column to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS multi_accounts JSONB;

-- Update RLS policies if necessary (already handled by "Allow all" policy in consolidated schema)
