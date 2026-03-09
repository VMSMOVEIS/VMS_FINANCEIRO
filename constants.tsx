import { 
  Zap,
  FileSpreadsheet,
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
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Clock,
  UserPlus,
  Settings2,
  Factory,
  Package,
  CheckCircle2,
  Wrench,
  ClipboardList,
  ShoppingCart,
  UserCheck,
  FileText,
  Target,
  BarChart3
} from 'lucide-react';
import { MenuItem, ModuleId } from './types';

export const MENU_ITEMS: MenuItem[] = [
// ... (rest of MENU_ITEMS)
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
      { id: 'contab_dfc', label: 'DFC' },
      { id: 'contab_dmpl', label: 'DMPL' },
      { id: 'contab_dva', label: 'DVA' },
      { id: 'contab_notas', label: 'Notas Explicativas' },
      { id: 'contab_dlpa', label: 'DLPA' },
      { id: 'contab_dra', label: 'DRA' },
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

export const RH_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.RH_DASHBOARD,
    label: 'Dashboard RH',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.RH_FUNCIONARIOS,
    label: 'Funcionários',
    icon: Users,
    subItems: [
      { id: 'func_lista', label: 'Lista de Colaboradores' },
      { id: 'func_doc', label: 'Documentação' },
    ]
  },
  {
    id: ModuleId.RH_FOLHA,
    label: 'Folha de Pagamento',
    icon: Briefcase,
    subItems: [
      { id: 'folha_geral', label: 'Processamento' },
      { id: 'folha_holerite', label: 'Holerites' },
      { id: 'folha_encargos', label: 'Encargos Sociais' },
    ]
  },
  {
    id: ModuleId.RH_PONTO,
    label: 'Ponto Eletrônico',
    icon: Clock,
  },
  {
    id: ModuleId.RH_RECRUTAMENTO,
    label: 'Recrutamento & Seleção',
    icon: UserPlus,
  },
  {
    id: ModuleId.RH_TREINAMENTO,
    label: 'Treinamentos',
    icon: GraduationCap,
  },
  {
    id: ModuleId.RH_BENEFICIOS,
    label: 'Benefícios',
    icon: Heart,
  },
  {
    id: ModuleId.RH_CONFIG,
    label: 'Configurações RH',
    icon: Settings2,
  }
];

export const PRODUCAO_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.PRODUCAO_DASHBOARD,
    label: 'Dashboard Produção',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.PRODUCAO_ORDENS,
    label: 'Ordens de Produção',
    icon: ClipboardList,
    subItems: [
      { id: 'op_lista', label: 'Lista de OPs' },
      { id: 'op_nova', label: 'Nova Ordem' },
      { id: 'op_planejamento', label: 'Planejamento' },
    ]
  },
  {
    id: ModuleId.PRODUCAO_ESTOQUE,
    label: 'Estoque MP',
    icon: Package,
  },
  {
    id: ModuleId.PRODUCAO_MAQUINAS,
    label: 'Máquinas & Equipamentos',
    icon: Factory,
  },
  {
    id: ModuleId.PRODUCAO_QUALIDADE,
    label: 'Controle de Qualidade',
    icon: CheckCircle2,
  },
  {
    id: ModuleId.PRODUCAO_MANUTENCAO,
    label: 'Manutenção',
    icon: Wrench,
  },
  {
    id: ModuleId.PRODUCAO_CONFIG,
    label: 'Configurações Produção',
    icon: Settings2,
  }
];

export const VENDAS_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.VENDAS_DASHBOARD,
    label: 'Dashboard Vendas',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.VENDAS_PDV,
    label: 'PDV (Balcão)',
    icon: Zap,
  },
  {
    id: ModuleId.VENDAS_CRM,
    label: 'CRM / Funil',
    icon: Target,
  },
  {
    id: ModuleId.VENDAS_PEDIDOS,
    label: 'Pedidos de Venda',
    icon: ShoppingCart,
  },
  {
    id: ModuleId.VENDAS_ORCAMENTOS,
    label: 'Orçamentos',
    icon: FileSpreadsheet,
  },
  {
    id: ModuleId.VENDAS_PROPOSTAS,
    label: 'Propostas Comerciais',
    icon: FileText,
  },
  {
    id: ModuleId.VENDAS_CLIENTES,
    label: 'Gestão de Clientes',
    icon: UserCheck,
  },
  {
    id: ModuleId.VENDAS_CATALOGO,
    label: 'Catálogo & Preços',
    icon: BookOpen,
  },
  {
    id: ModuleId.VENDAS_METAS,
    label: 'Metas & Performance',
    icon: BarChart3,
  },
  {
    id: ModuleId.VENDAS_CONFIG,
    label: 'Configurações Vendas',
    icon: Settings2,
  }
];
