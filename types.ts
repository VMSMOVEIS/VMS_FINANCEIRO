import { LucideIcon } from 'lucide-react';

export enum SectorId {
  FINANCEIRO = 'financeiro',
  RH = 'rh',
  PRODUCAO = 'producao',
  VENDAS = 'vendas',
  COMPRAS = 'compras',
  PROJETOS = 'projetos'
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
  FINANCEIRO_ADIANTAMENTOS = 'financeiro_adiantamentos',
  GESTAO_CUSTOS = 'gestao_custos',
  PROVISOES = 'provisoes',
  
  // RH Modules
  RH_DASHBOARD = 'rh_dashboard',
  RH_FUNCIONARIOS = 'rh_funcionarios',
  RH_FOLHA = 'rh_folha',
  RH_RECRUTAMENTO = 'rh_recrutamento',
  RH_TREINAMENTO = 'rh_treinamento',
  RH_BENEFICIOS = 'rh_beneficios',
  RH_DESEMPENHO = 'rh_desempenho',
  RH_CLIMA = 'rh_clima',
  RH_OFFBOARDING = 'rh_offboarding',
  RH_ORGANOGRAMA = 'rh_organograma',
  RH_DOCUMENTOS = 'rh_documentos',
  RH_PORTAL = 'rh_portal',
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
  VENDAS_LEADS = 'vendas_leads',
  VENDAS_PEDIDOS = 'vendas_pedidos',
  VENDAS_ORCAMENTOS = 'vendas_orçamentos',
  VENDAS_PROPOSTAS = 'vendas_propostas',
  VENDAS_CLIENTES = 'vendas_clientes',
  VENDAS_CATALOGO = 'vendas_catalogo',
  VENDAS_METAS = 'vendas_metas',
  VENDAS_CONFIG = 'vendas_config',

  // Compras Modules
  COMPRAS_DASHBOARD = 'compras_dashboard',
  COMPRAS_PEDIDOS = 'compras_pedidos',
  COMPRAS_FORNECEDORES = 'compras_fornecedores',
  COMPRAS_COTACAO = 'compras_cotacao',
  COMPRAS_CONFIG = 'compras_config',

  // Projetos Modules
  PROJETOS_DASHBOARD = 'projetos_dashboard',
  PROJETOS_QUADROS = 'projetos_quadros',
  PROJETOS_TAREFAS = 'projetos_tarefas',
  PROJETOS_CALENDARIO = 'projetos_calendario',
  PROJETOS_TIMELINE = 'projetos_timeline',
  PROJETOS_TREINAMENTOS = 'projetos_treinamentos',
  PROJETOS_DOCS = 'projetos_docs',
  PROJETOS_CONFIG = 'projetos_config',

  // Planejamento Modules
  PLAN_FINANCEIRO = 'plan_financeiro',
  PLAN_RH = 'plan_rh',
  PLAN_PRODUCAO = 'plan_producao',
  PLAN_VENDAS = 'plan_vendas',
  PLAN_COMPRAS = 'plan_compras',
  PLAN_PROJETOS = 'plan_projetos'
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
  accountPlanId?: string;
  accountPlanName?: string;
  accountPlanCode?: string;
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
  discount?: number;
  surcharge?: number;
  dueDate: string;
  bankId?: string; // Linked Bank Account ID
  destination: string; // Account ID or Name
  source?: string; // Account ID or Name (for transfers)
  status: 'completed' | 'pending';
  reconciled?: boolean;
  type?: 'payment' | 'discount' | 'surcharge';
}

export interface TransactionSplit {
  accountPlanId: string;
  accountPlanName?: string;
  accountPlanCode?: string;
  value: number;
  description?: string;
  type: 'debit' | 'credit';
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string | null;
  categoryCode?: string;
  value: number; // Total Value
  type: 'income' | 'expense' | 'transfer';
  transactionTypeId: string;
  documentType: string;
  orderNumber?: string;
  customerName?: string; // Added customer/supplier name
  payments: Payment[];
  status: 'completed' | 'pending' | 'partial' | 'a_compensar';
  linkedTransactionId?: number;
  linkedPaymentId?: string;
  multiAccounts?: TransactionSplit[];
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
  QUOTE = 'quote',
  NEGOTIATION = 'negotiation',
  ORDER_CONFIRMED = 'order_confirmed',
  PRODUCTION = 'production',
  DELIVERY = 'delivery',
  WON = 'won',
  POST_SALE = 'post_sale',
  LOST = 'lost'
}

export interface BOMItem {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  cost: number;
  productionTime?: number; // in minutes
}

export interface Quote {
  id: string;
  client: string;
  contactName?: string;
  email?: string;
  phone?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  productName?: string;
  operator?: string;
  store?: string;
  date: string;
  expiryDate: string;
  items?: SaleItem[];
  itemCount?: number;
  totalQuantity?: number;
  totalDiscount?: number;
  deliveryTime?: string;
  otherExpenses?: number;
  commission?: number;
  shipping?: number;
  laborMinutes?: number;
  laborCost?: number;
  indirectCosts?: number;
  value: number; // Final Price
  status: 'draft' | 'waiting_approval' | 'sent' | 'approved' | 'rejected' | 'expired';
  paymentStatus?: 'paid' | 'pending' | 'partial';
  bomItems: BOMItem[];
  profitMargin: number; // Percentage
  discount: number; // Percentage
  notes?: string;
  saleType?: 'pronta_entrega' | 'encomenda' | 'prazo';
}

export interface ProductionOrder {
  id: string;
  productName: string;
  client: string;
  quantity: number;
  deadline: string; // Data prevista
  status: 'waiting' | 'in_production' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  quoteId?: string;
  orderNumber?: string; // nº Pedido de venda
  startDate?: string; // Data início
  responsible?: string; // Responsável
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'mp' | 'pa' | 'processo';
  category: string; // MDF, Ferragem, Armário, etc.
  stockCategory: 'pronta_entrega' | 'sob_medida';
  brand?: string;
  model?: string;
  quantity: number;
  unit: string;
  location: string;
  value: number; // Preço de venda para PA, Valor unitário para MP
  estimatedCost: number; // Custo de produção para PA, Custo unitário para MP
  minStock?: number;
  maxStock?: number;
  margin?: number;
  markup?: number;
  commission?: number;
  warranty?: string;
  productionLeadTime?: number;
  ncm?: string;
  cfop?: string;
  cst_csosn?: string;
  entryDate: string;
  
  // Novos campos MP
  trackStock?: boolean;
  averageCost?: number;
  lastPurchaseCost?: number;
  standardCost?: number;
  defaultSupplierId?: string;
  purchaseLeadTime?: number;
  minPurchaseQuantity?: number;
  purchaseUnit?: string;
  consumptionUnit?: string;
  conversionFactor?: number;
  thickness?: number;
  color?: string;
  length?: number;
  width?: number;
  baseMaterial?: string;
  productOrigin?: string;
  productionTimePerUnit?: number; // Tempo de produção por unidade (ex: min/m2)
  status?: 'active' | 'inactive';
  updatedAt?: string;
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
  date: string;
  source: string;
  probability: number; // 0-100
  notes?: string;
  orderDescription?: string;
  expectedCloseDate?: string;
  address?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface Customer {
  id: string;
  type: 'individual' | 'company';
  documentType: 'CPF' | 'CNPJ';
  name: string;
  businessName?: string;
  document: string;
  contactName?: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'finalizar_cadastro';
  address?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  lead_id?: string;
}

export interface SaleItem {
  productId: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  listPrice: number;
  discount: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Sale {
  id: string;
  customer: string;
  operator: string;
  store?: string;
  date: string;
  effectiveDate?: string;
  dueDate?: string;
  items: SaleItem[];
  itemCount: number;
  totalQuantity: number;
  totalDiscount: number;
  deliveryTime?: string;
  otherExpenses: number;
  commission: number;
  value: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'waiting_production';
  paymentStatus: 'paid' | 'pending' | 'partial';
  origin: 'pdv' | 'order' | 'catalog';
  saleType?: 'pronta_entrega' | 'encomenda' | 'prazo';
  paymentMethod?: string;
  accountPlanId?: string;
  notes?: string;
  estimatedCost?: number;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  dueDate?: string;
  effectiveDate?: string;
  value: number;
  status: 'pending' | 'processing' | 'received' | 'completed' | 'cancelled';
  items: number | any[];
  buyer: string;
  paymentStatus: 'paid' | 'pending';
  purchaseType?: 'mercadoria' | 'materia_prima' | 'insumos' | 'escritorio' | string;
  paymentMethod?: string;
  accountPlanId?: string;
}

export interface SalesPaymentMethod {
  id: string;
  name: string;
  discount: number; // Percentage
  active: boolean;
}

export interface StockAgingConfig {
  id: string;
  days: number;
  discount: number; // Percentage
  active: boolean;
}

export interface StockConfigItem {
  id: string;
  name: string;
  type: 'mp_category' | 'location' | 'uom' | 'purchase_unit' | 'consumption_unit' | 'pa_category';
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  clientId?: string;
  startDate?: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
  ownerId: string;
  members: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  name: string;
  url: string;
  type: string; // image, pdf, etc.
  size: number;
  createdAt: string;
}

export interface ProjectLog {
  id: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'overdue' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assigneeName?: string;
  reporterId?: string;
  projectId: string;
  workspaceId: string;
  boardId?: string;
  columnId?: string;
  startDate?: string;
  deadline?: string;
  estimatedHours?: number;
  actualHours?: number;
  isTimerRunning?: boolean;
  timerStartedAt?: string;
  productionStage?: 'corte' | 'montagem' | 'acabamento' | 'entrega';
  checklist: { id: string; text: string; completed: boolean }[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  order: number;
  color?: string;
}

export interface Board {
  id: string;
  title: string;
  name?: string; // For compatibility
  description?: string;
  projectId: string;
  columns: BoardColumn[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectDoc {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  authorId: string;
  boardId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  content?: string;
  contentUrl?: string;
  videoUrl?: string;
  duration?: number | string; // in minutes
  category: string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
}
