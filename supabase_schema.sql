-- Supabase Schema for Employee Management System

-- 1. Shifts (Turnos)
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Benefits Configuration (Configuração de Benefícios)
CREATE TABLE benefits_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage')),
  value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Employees (Colaboradores)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  birth_date DATE,
  gender TEXT,
  marital_status TEXT,
  education TEXT,
  admission_date DATE NOT NULL,
  salary DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
  work_schedule TEXT, -- Display string for schedule
  shift_id UUID REFERENCES shifts(id),
  
  -- Address (JSONB for flexibility or separate columns)
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip_code TEXT,
  
  -- Bank Info
  bank_name TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  bank_account_type TEXT CHECK (bank_account_type IN ('corrente', 'poupanca')),
  bank_pix_key TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Employee Benefits (Relacionamento Colaborador x Benefícios)
CREATE TABLE employee_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  benefit_id UUID REFERENCES benefits_config(id) ON DELETE CASCADE,
  custom_value DECIMAL(10, 2), -- Optional override
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Employee Documents (Documentos)
CREATE TABLE employee_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- Create policies (Example: Allow authenticated users to read everything)
CREATE POLICY "Allow authenticated users to read employees" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert employees" ON employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update employees" ON employees FOR UPDATE TO authenticated USING (true);
