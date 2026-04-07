import { 
  Zap,
  FileSpreadsheet,
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  TrendingUp,
  Landmark, 
  Calendar,
  CalendarClock,
  DollarSign,
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
    id: ModuleId.HISTORICO_OPERACIONAL,
    label: 'Histórico Operacional',
    icon: History,
    subItems: [
      { id: 'historico_vendas', label: 'Histórico de Vendas' },
      { id: 'historico_compras', label: 'Histórico de Compras' },
    ]
  },
  {
    id: ModuleId.FINANCEIRO_ADIANTAMENTOS,
    label: 'Adiantamentos',
    icon: Landmark,
    subItems: [
      { id: 'adiant_clientes', label: 'Adiant. de Clientes' },
      { id: 'adiant_fornecedores', label: 'Adiant. de Fornecedores' },
    ]
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
      { id: 'cr_boletos', label: 'Boletos & Cobrança' },
      { id: 'cr_cartoes', label: 'Cartões & Adquirência' },
      { id: 'cr_inadimplencia', label: 'Inadimplência' },
      { id: 'cr_antecipacao', label: 'Antecipação' },
    ]
  },
  {
    id: ModuleId.CONTAS_PAGAR,
    label: 'Contas a Pagar',
    icon: ArrowDownCircle,
    subItems: [
      { id: 'cp_geral', label: 'Visão Geral' },
      { id: 'cp_fornecedores', label: 'Fornecedores' },
      { id: 'cp_impostos', label: 'Impostos & Taxas' },
      { id: 'cp_folha', label: 'Folha de Pagamento' },
      { id: 'cp_reembolsos', label: 'Reembolsos' },
    ]
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
      { id: 'contab_plano', label: 'Plano de Contas' },
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
    id: ModuleId.GESTAO_CUSTOS,
    label: 'Gestão de Custos',
    icon: BarChart3,
  },
  {
    id: ModuleId.PROVISOES,
    label: 'Provisões',
    icon: CalendarClock,
  },
  {
    id: ModuleId.RELATORIOS,
    label: 'Relatórios & BI',
    icon: FileBarChart,
  },
  {
    id: ModuleId.PLAN_FINANCEIRO,
    label: 'Planejamento Financeiro',
    icon: Target,
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
      { id: 'func_ferias', label: 'Gestão de Férias' },
      { id: 'func_afastamentos', label: 'Afastamentos' },
      { id: 'func_desligamentos', label: 'Desligamentos' },
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
      { id: 'folha_provisoes', label: 'Provisões' },
      { id: 'folha_beneficios', label: 'Benefícios em Folha' },
    ]
  },
  {
    id: ModuleId.RH_PONTO,
    label: 'Ponto Eletrônico',
    icon: Clock,
    subItems: [
      { id: 'ponto_espelho', label: 'Espelho de Ponto' },
      { id: 'ponto_ajustes', label: 'Ajustes & Abonos' },
      { id: 'ponto_banco', label: 'Banco de Horas' },
    ]
  },
  {
    id: ModuleId.RH_RECRUTAMENTO,
    label: 'Recrutamento & Seleção',
    icon: UserPlus,
    subItems: [
      { id: 'recrut_vagas', label: 'Vagas Abertas' },
      { id: 'recrut_candidatos', label: 'Banco de Talentos' },
      { id: 'recrut_entrevistas', label: 'Agenda de Entrevistas' },
    ]
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
    id: ModuleId.PLAN_RH,
    label: 'Planejamento de RH',
    icon: Target,
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
    label: 'PCP - Planejamento e Controle',
    icon: ClipboardList,
    subItems: [
      { id: 'pcp_ordens', label: 'Ordens de Produção' },
      { id: 'pcp_ficha', label: 'Ficha Técnica' },
      { id: 'pcp_consumo', label: 'Consumo de MP' },
      { id: 'pcp_etapas', label: 'Etapas de Produção' },
      { id: 'pcp_custos', label: 'Custos de Fabricação' },
      { id: 'pcp_planejamento', label: 'Planejamento' },
    ]
  },
  {
    id: ModuleId.PRODUCAO_ESTOQUE,
    label: 'Estoques',
    icon: Package,
    subItems: [
      { id: 'estoque_mp', label: 'Matéria-Prima' },
      { id: 'estoque_pa', label: 'Produtos Acabados (PA)' },
      { id: 'estoque_processo', label: 'Produtos em Processo' },
    ]
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
    id: ModuleId.PLAN_PRODUCAO,
    label: 'Planejamento de Produção',
    icon: Target,
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
    subItems: [
      { id: 'crm_funil', label: 'Funil de Vendas' },
      { id: 'crm_oportunidades', label: 'Oportunidades' },
      { id: 'crm_atividades', label: 'Atividades & Tarefas' },
      { id: 'crm_dashboard', label: 'Dashboard CRM' },
    ]
  },
  {
    id: ModuleId.VENDAS_LEADS,
    label: 'Gestão de Leads',
    icon: Users,
    subItems: [
      { id: 'leads_novos', label: 'Novos Leads' },
      { id: 'leads_qualificados', label: 'Leads Qualificados' },
      { id: 'leads_importar', label: 'Importar Leads' },
    ]
  },
  {
    id: ModuleId.VENDAS_PEDIDOS,
    label: 'Pedidos de Venda',
    icon: ShoppingCart,
    subItems: [
      { id: 'pedidos_lista', label: 'Todos os Pedidos' },
      { id: 'pedidos_faturar', label: 'Aguardando Faturamento' },
      { id: 'pedidos_entregues', label: 'Entregues' },
    ]
  },
  {
    id: ModuleId.VENDAS_ORCAMENTOS,
    label: 'Orçamentos',
    icon: FileSpreadsheet,
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
    id: ModuleId.VENDAS_ESTOQUE,
    label: 'Estoques (Vendas)',
    icon: Package,
    subItems: [
      { id: 'vendas_estoque_pa', label: 'Produtos Acabados' },
      { id: 'vendas_estoque_kits', label: 'Kits de Venda' },
    ]
  },
  {
    id: ModuleId.VENDAS_METAS,
    label: 'Metas & Performance',
    icon: BarChart3,
  },
  {
    id: ModuleId.PLAN_VENDAS,
    label: 'Planejamento de Vendas',
    icon: Target,
  },
  {
    id: ModuleId.VENDAS_CONFIG,
    label: 'Configurações Vendas',
    icon: Settings2,
  }
];

export const COMPRAS_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.COMPRAS_DASHBOARD,
    label: 'Dashboard Compras',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.COMPRAS_PEDIDOS,
    label: 'Pedidos de Compra',
    icon: ShoppingCart,
    subItems: [
      { id: 'compras_pedidos_lista', label: 'Lista de Pedidos' },
      { id: 'compras_pedidos_novos', label: 'Novo Pedido' },
      { id: 'compras_pedidos_receber', label: 'Recebimento de Mercadoria' },
    ]
  },
  {
    id: ModuleId.COMPRAS_COTACAO,
    label: 'Cotações de Preço',
    icon: FileSpreadsheet,
    subItems: [
      { id: 'compras_cot_ativas', label: 'Cotações Ativas' },
      { id: 'compras_cot_historico', label: 'Histórico de Cotações' },
    ]
  },
  {
    id: ModuleId.COMPRAS_ESTOQUE,
    label: 'Estoques (Compras)',
    icon: Package,
    subItems: [
      { id: 'compras_estoque_mp', label: 'Matéria-Prima' },
      { id: 'compras_estoque_insumos', label: 'Insumos & Consumo' },
    ]
  },
  {
    id: ModuleId.COMPRAS_FORNECEDORES,
    label: 'Gestão de Fornecedores',
    icon: Users,
    subItems: [
      { id: 'compras_forn_lista', label: 'Lista de Fornecedores' },
      { id: 'compras_forn_aval', label: 'Avaliação de Desempenho' },
      { id: 'compras_forn_contratos', label: 'Contratos' },
    ]
  },
  {
    id: ModuleId.PLAN_COMPRAS,
    label: 'Planejamento de Compras',
    icon: Target,
  },
  {
    id: ModuleId.COMPRAS_CONFIG,
    label: 'Configurações Compras',
    icon: Settings2,
  }
];

export const PROJETOS_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.PROJETOS_DASHBOARD,
    label: 'Dashboard Projetos',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.PROJETOS_QUADROS,
    label: 'Quadros (Boards)',
    icon: ClipboardList,
  },
  {
    id: ModuleId.PROJETOS_CALENDARIO,
    label: 'Calendário',
    icon: Calendar,
  },
  {
    id: ModuleId.PROJETOS_TIMELINE,
    label: 'Timeline (Gantt)',
    icon: Clock,
  },
  {
    id: ModuleId.PROJETOS_TAREFAS,
    label: 'Minhas Tarefas',
    icon: CheckCircle2,
  },
  {
    id: ModuleId.PROJETOS_DOCS,
    label: 'Documentos & Docs',
    icon: FileText,
  },
  {
    id: ModuleId.PROJETOS_TREINAMENTOS,
    label: 'Treinamentos',
    icon: GraduationCap,
  },
  {
    id: ModuleId.PLAN_PROJETOS,
    label: 'Planejamento de Projetos',
    icon: Target,
  },
  {
    id: ModuleId.PROJETOS_CONFIG,
    label: 'Configurações',
    icon: Settings2,
  }
];
