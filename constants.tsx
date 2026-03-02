import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  TrendingUp,
  Landmark, 
  PieChart, 
  Scale, 
  FileBarChart, 
  Settings,
  PlusCircle,
  ListTree,
  History,
  BookOpen
} from 'lucide-react';
import { MenuItem, ModuleId } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.DASHBOARD,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.LANCAMENTOS,
    label: 'Lançamentos',
    icon: PlusCircle,
  },
  {
    id: ModuleId.FLUXO_CAIXA,
    label: 'Fluxo de Caixa',
    icon: TrendingUp,
  },
  {
    id: ModuleId.CONTAS_RECEBER,
    label: 'Contas a Receber',
    icon: ArrowUpCircle,
    subItems: [
      { id: 'cr_geral', label: 'Visão Geral' },
      { id: 'cr_adiantamentos', label: 'Adiant. de Clientes' },
    ]
  },
  {
    id: ModuleId.CONTAS_PAGAR,
    label: 'Contas a Pagar',
    icon: ArrowDownCircle,
    subItems: [
      { id: 'cp_geral', label: 'Visão Geral' },
      { id: 'cp_adiantamentos', label: 'Adiant. a Fornecedores' },
    ]
  },
  {
    id: ModuleId.HISTORICO_OPERACIONAL,
    label: 'Histórico Operacional',
    icon: History,
    subItems: [
      { id: 'historico_vendas', label: 'Histórico de Vendas' },
      { id: 'historico_compras', label: 'Histórico de Compras' },
    ]
  },
  {
    id: ModuleId.PLANO_CONTAS,
    label: 'Plano de Contas',
    icon: ListTree,
  },
  {
    id: ModuleId.TESOURARIA,
    label: 'Tesouraria',
    icon: Landmark,
  },
  {
    id: ModuleId.CONTABILIDADE,
    label: 'Contabilidade',
    icon: BookOpen,
    subItems: [
      { id: 'contab_dre', label: 'DRE' },
      { id: 'contab_balanco', label: 'Balanço Patrimonial' },
      { id: 'contab_balancete', label: 'Balancete' },
      { id: 'contab_diario', label: 'Livro Diário' },
      { id: 'contab_razao', label: 'Livro Razão' },
    ]
  },
  {
    id: ModuleId.FISCAL,
    label: 'Fiscal & Tributário',
    icon: Scale,
  },
  {
    id: ModuleId.CONTROLADORIA,
    label: 'Controladoria',
    icon: PieChart,
  },
  {
    id: ModuleId.RELATORIOS,
    label: 'Relatórios & BI',
    icon: FileBarChart,
  },
  {
    id: ModuleId.CONFIGURACOES,
    label: 'Configurações',
    icon: Settings,
  }
];