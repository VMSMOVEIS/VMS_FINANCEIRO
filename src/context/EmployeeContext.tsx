import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, EmployeeDocument } from '../../types';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'documents'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDocument: (employeeId: string, document: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  removeDocument: (employeeId: string, documentId: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

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
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('vms_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('vms_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'documents'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.random().toString(36).substr(2, 9),
      documents: []
    };
    setEmployees(prev => [newEmployee, ...prev]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addDocument = (employeeId: string, documentData: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const newDoc: EmployeeDocument = {
      ...documentData,
      id: Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, documents: [newDoc, ...emp.documents] } 
        : emp
    ));
  };

  const removeDocument = (employeeId: string, documentId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, documents: emp.documents.filter(d => d.id !== documentId) } 
        : emp
    ));
  };

  return (
    <EmployeeContext.Provider value={{ 
      employees, 
      addEmployee, 
      updateEmployee, 
      deleteEmployee, 
      addDocument, 
      removeDocument 
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
