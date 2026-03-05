import { LucideIcon } from 'lucide-react';

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
  CONFIGURACOES = 'configuracoes'
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
  type: 'income' | 'expense';
  transactionTypeId: string;
  documentType: string;
  orderNumber?: string;
  customerName?: string; // Added customer/supplier name
  payments: Payment[];
  status: 'completed' | 'pending' | 'partial';
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}