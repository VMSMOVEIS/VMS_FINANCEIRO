-- Supabase Schema for Employee Management System

-- 1. Shifts (Turnos)
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.1 Job Roles (Cargos)
CREATE TABLE IF NOT EXISTS job_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  department TEXT,
  base_salary DECIMAL(10,2),
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
ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for public access)
DROP POLICY IF EXISTS "Allow public read employees" ON employees;
DROP POLICY IF EXISTS "Allow public insert employees" ON employees;
DROP POLICY IF EXISTS "Allow public update employees" ON employees;
DROP POLICY IF EXISTS "Allow public delete employees" ON employees;
CREATE POLICY "Allow all for employees" ON employees FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read shifts" ON shifts;
DROP POLICY IF EXISTS "Allow public insert shifts" ON shifts;
DROP POLICY IF EXISTS "Allow public update shifts" ON shifts;
DROP POLICY IF EXISTS "Allow public delete shifts" ON shifts;
CREATE POLICY "Allow all for shifts" ON shifts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read job_roles" ON job_roles;
DROP POLICY IF EXISTS "Allow public insert job_roles" ON job_roles;
DROP POLICY IF EXISTS "Allow public update job_roles" ON job_roles;
DROP POLICY IF EXISTS "Allow public delete job_roles" ON job_roles;
CREATE POLICY "Allow all for job_roles" ON job_roles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read benefits_config" ON benefits_config;
DROP POLICY IF EXISTS "Allow public insert benefits_config" ON benefits_config;
DROP POLICY IF EXISTS "Allow public update benefits_config" ON benefits_config;
DROP POLICY IF EXISTS "Allow public delete benefits_config" ON benefits_config;
CREATE POLICY "Allow all for benefits_config" ON benefits_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read employee_benefits" ON employee_benefits;
DROP POLICY IF EXISTS "Allow public insert employee_benefits" ON employee_benefits;
DROP POLICY IF EXISTS "Allow public update employee_benefits" ON employee_benefits;
DROP POLICY IF EXISTS "Allow public delete employee_benefits" ON employee_benefits;
CREATE POLICY "Allow all for employee_benefits" ON employee_benefits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read employee_documents" ON employee_documents;
DROP POLICY IF EXISTS "Allow public insert employee_documents" ON employee_documents;
DROP POLICY IF EXISTS "Allow public update employee_documents" ON employee_documents;
DROP POLICY IF EXISTS "Allow public delete employee_documents" ON employee_documents;
CREATE POLICY "Allow all for employee_documents" ON employee_documents FOR ALL USING (true) WITH CHECK (true);
