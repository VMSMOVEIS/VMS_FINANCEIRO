-- Tabela de Pedidos de Venda
CREATE TABLE sales_orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  effective_date TIMESTAMP WITH TIME ZONE,
  value DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled', 'waiting_production')),
  items JSONB NOT NULL, -- Pode ser um número ou um array de itens
  salesperson TEXT NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending')),
  origin TEXT NOT NULL CHECK (origin IN ('pdv', 'order', 'catalog')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura para usuários autenticados" 
ON sales_orders FOR SELECT 
TO authenticated 
USING (true);

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" 
ON sales_orders FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Permitir atualização para usuários autenticados" 
ON sales_orders FOR UPDATE 
TO authenticated 
USING (true);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_orders_updated_at
BEFORE UPDATE ON sales_orders
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
