import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, EmployeeDocument, JobRole } from '../../types';
import { supabase } from '../lib/supabase';

interface EmployeeContextType {
  employees: Employee[];
  jobRoles: JobRole[];
  addEmployee: (employee: Omit<Employee, 'id' | 'documents'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDocument: (employeeId: string, document: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  removeDocument: (employeeId: string, documentId: string) => void;
  addJobRole: (role: Omit<JobRole, 'id'>) => void;
  updateJobRole: (id: string, role: Partial<JobRole>) => void;
  deleteJobRole: (id: string) => void;
  fetchEmployeesByRole: (role: string) => Employee[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const INITIAL_ROLES: JobRole[] = [
  { id: 'r1', name: 'Desenvolvedor Senior', department: 'TI' },
  { id: 'r2', name: 'Analista de RH', department: 'RH' },
  { id: 'r3', name: 'Gerente Comercial', department: 'Vendas' },
  { id: 'r4', name: 'Vendedor', department: 'Vendas' },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    role: 'Desenvolvedor Senior', 
    department: 'TI', 
    workSchedule: '08:00 - 12:00, 13:00 - 17:00',
    email: 'joao.silva@empresa.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    birthDate: '1990-05-15',
    gender: 'M',
    maritalStatus: 'Casado',
    admissionDate: '2023-01-15',
    salary: 8500,
    status: 'active',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    bankInfo: {
      bank: 'Itaú',
      agency: '0001',
      account: '12345-6',
      type: 'corrente'
    },
    benefits: [
      { id: 'b1', name: 'Vale Refeição', value: 600, type: 'fixed' },
      { id: 'b2', name: 'Plano de Saúde', value: 0, type: 'fixed' }
    ],
    documents: [
      { id: 'd1', name: 'Contrato de Trabalho', type: 'PDF', uploadDate: '2023-01-15', url: '#' },
      { id: 'd2', name: 'RG', type: 'JPG', uploadDate: '2023-01-15', url: '#' }
    ]
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    role: 'Analista de RH', 
    department: 'RH', 
    workSchedule: '09:00 - 13:00, 14:00 - 18:00',
    email: 'maria.oliveira@empresa.com',
    phone: '(11) 91234-5678',
    cpf: '987.654.321-11',
    rg: '98.765.432-1',
    birthDate: '1992-08-20',
    gender: 'F',
    maritalStatus: 'Solteira',
    admissionDate: '2022-06-10',
    salary: 5200,
    status: 'active',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    bankInfo: {
      bank: 'Bradesco',
      agency: '1234',
      account: '98765-4',
      type: 'corrente'
    },
    benefits: [
      { id: 'b1', name: 'Vale Refeição', value: 600, type: 'fixed' }
    ],
    documents: [
      { id: 'd3', name: 'Diploma', type: 'PDF', uploadDate: '2022-06-10', url: '#' }
    ]
  },
  { 
    id: '3', 
    name: 'Pedro Santos', 
    role: 'Gerente Comercial', 
    department: 'Vendas', 
    workSchedule: '08:30 - 12:30, 13:30 - 17:30',
    email: 'pedro.santos@empresa.com',
    phone: '(11) 99887-7665',
    cpf: '456.789.123-22',
    admissionDate: '2021-03-20',
    salary: 12000,
    status: 'on_leave',
    benefits: [],
    documents: []
  }
];

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Job Roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('shifts') // Using shifts table for roles/schedules for now or create a job_roles table
        .select('*');
      
      // If shifts table is used for roles, map it
      if (rolesData) {
        setJobRoles(rolesData.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description
        })));
      }

      // Fetch Employees
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select(`
          *,
          employee_documents (*)
        `)
        .order('name', { ascending: true });
      
      if (empError) throw empError;
      
      setEmployees(empData.map(e => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        workSchedule: e.work_schedule,
        shiftId: e.shift_id,
        email: e.email,
        phone: e.phone,
        cpf: e.cpf,
        rg: e.rg,
        birthDate: e.birth_date,
        gender: e.gender,
        maritalStatus: e.marital_status,
        admissionDate: e.admission_date,
        salary: Number(e.salary),
        status: e.status,
        address: {
          street: e.address_street,
          number: e.address_number,
          complement: e.address_complement,
          neighborhood: e.address_neighborhood,
          city: e.address_city,
          state: e.address_state,
          zipCode: e.address_zip_code
        },
        bankInfo: {
          bank: e.bank_name,
          agency: e.bank_agency,
          account: e.bank_account,
          type: e.bank_account_type,
          pixKey: e.bank_pix_key
        },
        education: e.education,
        benefits: [], // Benefits would need another join or separate fetch
        documents: e.employee_documents.map((d: any) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          uploadDate: d.upload_date,
          url: d.url
        }))
      })));

    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'documents'>) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          name: employeeData.name,
          role: employeeData.role,
          department: employeeData.department,
          work_schedule: employeeData.workSchedule,
          shift_id: employeeData.shiftId,
          email: employeeData.email,
          phone: employeeData.phone,
          cpf: employeeData.cpf,
          rg: employeeData.rg,
          birth_date: employeeData.birthDate,
          gender: employeeData.gender,
          marital_status: employeeData.maritalStatus,
          admission_date: employeeData.admissionDate,
          salary: employeeData.salary,
          status: employeeData.status,
          address_street: employeeData.address?.street,
          address_number: employeeData.address?.number,
          address_complement: employeeData.address?.complement,
          address_neighborhood: employeeData.address?.neighborhood,
          address_city: employeeData.address?.city,
          address_state: employeeData.address?.state,
          address_zip_code: employeeData.address?.zipCode,
          bank_name: employeeData.bankInfo?.bank,
          bank_agency: employeeData.bankInfo?.agency,
          bank_account: employeeData.bankInfo?.account,
          bank_account_type: employeeData.bankInfo?.type,
          bank_pix_key: employeeData.bankInfo?.pixKey,
          education: employeeData.education
        }])
        .select()
        .single();
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    if (!supabase) return;
    try {
      const updateObj: any = {};
      if (employeeData.name) updateObj.name = employeeData.name;
      if (employeeData.role) updateObj.role = employeeData.role;
      if (employeeData.department) updateObj.department = employeeData.department;
      if (employeeData.workSchedule) updateObj.work_schedule = employeeData.workSchedule;
      if (employeeData.shiftId) updateObj.shift_id = employeeData.shiftId;
      if (employeeData.email) updateObj.email = employeeData.email;
      if (employeeData.phone) updateObj.phone = employeeData.phone;
      if (employeeData.cpf) updateObj.cpf = employeeData.cpf;
      if (employeeData.rg) updateObj.rg = employeeData.rg;
      if (employeeData.birthDate) updateObj.birth_date = employeeData.birthDate;
      if (employeeData.gender) updateObj.gender = employeeData.gender;
      if (employeeData.maritalStatus) updateObj.marital_status = employeeData.maritalStatus;
      if (employeeData.admissionDate) updateObj.admission_date = employeeData.admissionDate;
      if (employeeData.salary) updateObj.salary = employeeData.salary;
      if (employeeData.status) updateObj.status = employeeData.status;
      if (employeeData.education) updateObj.education = employeeData.education;

      if (employeeData.address) {
        updateObj.address_street = employeeData.address.street;
        updateObj.address_number = employeeData.address.number;
        updateObj.address_complement = employeeData.address.complement;
        updateObj.address_neighborhood = employeeData.address.neighborhood;
        updateObj.address_city = employeeData.address.city;
        updateObj.address_state = employeeData.address.state;
        updateObj.address_zip_code = employeeData.address.zipCode;
      }

      if (employeeData.bankInfo) {
        updateObj.bank_name = employeeData.bankInfo.bank;
        updateObj.bank_agency = employeeData.bankInfo.agency;
        updateObj.bank_account = employeeData.bankInfo.account;
        updateObj.bank_account_type = employeeData.bankInfo.type;
        updateObj.bank_pix_key = employeeData.bankInfo.pixKey;
      }

      const { error } = await supabase
        .from('employees')
        .update(updateObj)
        .eq('id', id);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const addDocument = async (employeeId: string, documentData: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('employee_documents')
        .insert([{
          employee_id: employeeId,
          name: documentData.name,
          type: documentData.type,
          url: documentData.url
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const removeDocument = async (employeeId: string, documentId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  const addJobRole = async (roleData: Omit<JobRole, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('shifts') // Using shifts for roles for now
        .insert([{
          name: roleData.name,
          description: roleData.description,
          start_time: '08:00',
          end_time: '17:00'
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding job role:', error);
    }
  };

  const updateJobRole = async (id: string, roleData: Partial<JobRole>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('shifts')
        .update({
          name: roleData.name,
          description: roleData.description
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating job role:', error);
    }
  };

  const deleteJobRole = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting job role:', error);
    }
  };

  const fetchEmployeesByRole = (role: string) => {
    return employees.filter(e => e.role.toLowerCase() === role.toLowerCase() && e.status === 'active');
  };

  return (
    <EmployeeContext.Provider value={{ 
      employees, 
      jobRoles,
      addEmployee, 
      updateEmployee, 
      deleteEmployee, 
      addDocument, 
      removeDocument,
      addJobRole,
      updateJobRole,
      deleteJobRole,
      fetchEmployeesByRole
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
