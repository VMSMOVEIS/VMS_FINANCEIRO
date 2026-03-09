import { LucideIcon } from 'lucide-react';

export enum SectorId {
  FINANCEIRO = 'financeiro',
  RH = 'rh',
  PRODUCAO = 'producao',
  VENDAS = 'vendas'
}

export enum ModuleId {
  DASHBOARD = 'dashboard',
  LANCAMENTOS = 'lancamentos',
  PLANO_CONTAS = 'plano_contas',
  HISTORICO_OPERACIONAL = 'historico_operacional',
  FLUXO_CAIXA = 'fluxo_caixa',
  CONTAS_PAGAR = 'contas_pagar',
  CONTAS_RECEBER = 'contas_receber',
  CONTABILIDADE = 'contabilidade',
  TESOURARIA = 'tesouraria',
  CONTROLADORIA = 'controladoria',
  FISCAL = 'fiscal',
  RELATORIOS = 'relatorios',
  CONFIGURACOES = 'configuracoes',
  
  // RH Modules
  RH_DASHBOARD = 'rh_dashboard',
  RH_FUNCIONARIOS = 'rh_funcionarios',
  RH_FOLHA = 'rh_folha',
  RH_RECRUTAMENTO = 'rh_recrutamento',
  RH_TREINAMENTO = 'rh_treinamento',
  RH_BENEFICIOS = 'rh_beneficios',
  RH_PONTO = 'rh_ponto',
  RH_CONFIG = 'rh_config',
  
  // Produção Modules
  PRODUCAO_DASHBOARD = 'producao_dashboard',
  PRODUCAO_ORDENS = 'producao_ordens',
  PRODUCAO_ESTOQUE = 'producao_estoque',
  PRODUCAO_MAQUINAS = 'producao_maquinas',
  PRODUCAO_QUALIDADE = 'producao_qualidade',
  PRODUCAO_MANUTENCAO = 'producao_manutencao',
  PRODUCAO_CONFIG = 'producao_config',
  
  // Vendas Modules
  VENDAS_DASHBOARD = 'vendas_dashboard',
  VENDAS_PDV = 'vendas_pdv',
  VENDAS_CRM = 'vendas_crm',
  VENDAS_PEDIDOS = 'vendas_pedidos',
  VENDAS_ORCAMENTOS = 'vendas_orçamentos',
  VENDAS_PROPOSTAS = 'vendas_propostas',
  VENDAS_CLIENTES = 'vendas_clientes',
  VENDAS_CATALOGO = 'vendas_catalogo',
  VENDAS_METAS = 'vendas_metas',
  VENDAS_CONFIG = 'vendas_config'
}

export interface SubMenuItem {
  id: string;
  label: string;
}

export interface MenuItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  subItems?: SubMenuItem[];
}

export interface Account {
  id: string;
  name: string;
  bank?: string;
  accountNumber?: string;
  type: 'bank' | 'cash' | 'investment' | 'other';
  balance: number;
  color?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'pix' | 'cash' | 'debit_card' | 'credit_card' | 'boleto' | 'transfer' | 'other' | 'advance';
  defaultAccountId?: string; // The account this method is linked to
}

export interface Payment {
  id: string;
  method: string; // Changed from literal union to string to support custom methods
  value: number;
  dueDate: string;
  bankId?: string; // Linked Bank Account ID
  destination: string; // Account ID or Name
  source?: string; // Account ID or Name (for transfers)
  status: 'completed' | 'pending';
  reconciled?: boolean;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string | null;
  value: number; // Total Value
  type: 'income' | 'expense' | 'transfer';
  transactionTypeId: string;
  documentType: string;
  orderNumber?: string;
  customerName?: string; // Added customer/supplier name
  payments: Payment[];
  status: 'completed' | 'pending' | 'partial';
  linkedTransactionId?: number;
  linkedPaymentId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
}

export interface CompanyProfile {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

export interface NotificationSettings {
  dueDateAlert: boolean;
  alertDaysBefore: number;
  emailAlerts: boolean;
}

export interface Tax {
  id: string;
  name: string;
  type: 'das' | 'iss' | 'icms' | 'pis' | 'cofins' | 'inss' | 'fgts' | 'other';
  competence: string; // MM/YYYY
  dueDate: string;
  value: number;
  status: 'paid' | 'pending' | 'overdue';
  description?: string;
  year?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  entry1: string;
  exit1: string;
  entry2: string;
  exit2: string;
  totalHours: number;
  status: 'normal' | 'extra' | 'missing';
  observations?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface EmployeeBenefit {
  id: string;
  name: string;
  value: number;
  type: 'fixed' | 'percentage';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  workSchedule: string; // This can be the shift name/id
  shiftId?: string;
  email: string;
  phone: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'Other';
  maritalStatus?: string;
  admissionDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    type: 'corrente' | 'poupanca';
    pixKey?: string;
  };
  education?: string;
  benefits: EmployeeBenefit[];
  documents: EmployeeDocument[];
}

export interface JobRole {
  id: string;
  name: string;
  description?: string;
  department?: string;
  baseSalary?: number;
}

export enum LeadStatus {
  NEW = 'new',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost'
}

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  lastContact: string;
  source: string;
  probability: number; // 0-100
  notes?: string;
  expectedCloseDate?: string;
}
