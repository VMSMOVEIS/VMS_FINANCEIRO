import { 
  Workflow,
  FileSpreadsheet,
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Activity,
  Building2, 
  Calendar,
  CalendarClock,
  DollarSign,
  PieChart, 
  Scale, 
  FileBarChart, 
  Sliders,
  PlusSquare,
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
  Goal,
  BarChart3,
  Truck,
  ShoppingBag,
  Box,
  Layers,
  RefreshCw,
  BookmarkCheck
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
    icon: PlusSquare,
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
    icon: Building2,
    subItems: [
      { id: 'adiant_clientes', label: 'Adiant. de Clientes' },
      { id: 'adiant_fornecedores', label: 'Adiant. de Fornecedores' },
    ]
  },
  {
    id: ModuleId.FLUXO_CAIXA,
    label: 'Fluxo de Caixa',
    icon: Activity,
  },
  {
    id: ModuleId.CONTAS_RECEBER,
    label: 'Contas a Receber',
    icon: ArrowUpRight,
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
    icon: ArrowDownLeft,
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
    icon: Building2,
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
    icon: Goal,
  },
  {
    id: ModuleId.CONFIGURACOES,
    label: 'Configurações',
    icon: Sliders,
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
    icon: Goal,
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
    label: '1. Dashboard Produção',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.PRODUCAO_PCP,
    label: '2. PCP',
    icon: ClipboardList,
  },
  {
    id: ModuleId.PRODUCAO_ORDENS,
    label: '3. Ordens Produção',
    icon: FileText,
  },
  {
    id: ModuleId.PRODUCAO_CRONOGRAMA,
    label: '4. Cronograma',
    icon: Calendar,
  },
  {
    id: ModuleId.PRODUCAO_CORTE,
    label: '5. Corte',
    icon: Scale,
  },
  {
    id: ModuleId.PRODUCAO_USINAGEM,
    label: '6. Usinagem',
    icon: Settings2,
  },
  {
    id: ModuleId.PRODUCAO_MONTAGEM,
    label: '7. Montagem',
    icon: Wrench,
  },
  {
    id: ModuleId.PRODUCAO_ACABAMENTO,
    label: '8. Acabamento',
    icon: Heart,
  },
  {
    id: ModuleId.PRODUCAO_INSTALACAO,
    label: '9. Instalação',
    icon: Truck,
  },
  {
    id: ModuleId.PRODUCAO_APONTAMENTOS,
    label: '10. Apontamentos',
    icon: Clock,
  },
  {
    id: ModuleId.PRODUCAO_QUALIDADE,
    label: '11. Controle Qualidade',
    icon: CheckCircle2,
  },
  {
    id: ModuleId.PRODUCAO_RETRABALHO,
    label: '12. Retrabalho',
    icon: History,
  },
  {
    id: ModuleId.PRODUCAO_MANUTENCAO,
    label: '13. Manutenção',
    icon: Wrench,
  },
  {
    id: ModuleId.PRODUCAO_KPI,
    label: '14. Indicadores/KPIs',
    icon: BarChart3,
  },
  {
    id: ModuleId.PRODUCAO_RELATORIOS,
    label: '15. Relatórios',
    icon: FileBarChart,
  },
  {
    id: ModuleId.PRODUCAO_CONFIG,
    label: 'Configurações Produção',
    icon: Sliders,
  }
];

export const VENDAS_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.VENDAS_DASHBOARD,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.VENDAS_LEADS,
    label: 'CRM / Oportunidades',
    icon: Goal,
  },
  {
    id: ModuleId.VENDAS_CLIENTES,
    label: 'Clientes',
    icon: Users,
  },
  {
    id: ModuleId.VENDAS_VISITAS,
    label: 'Visitas Técnicas',
    icon: Calendar,
  },
  {
    id: ModuleId.VENDAS_PROJETOS,
    label: 'Projetos',
    icon: ClipboardList,
  },
  {
    id: ModuleId.VENDAS_ORCAMENTOS,
    label: 'Propostas / Orçamentos',
    icon: FileSpreadsheet,
  },
  {
    id: ModuleId.VENDAS_NEGOCIACAO,
    label: 'Negociação',
    icon: BarChart3,
  },
  {
    id: ModuleId.VENDAS_CONTRATOS,
    label: 'Contratos',
    icon: FileText,
  },
  {
    id: ModuleId.VENDAS_APROVACOES,
    label: 'Aprovações',
    icon: CheckCircle2,
  },
  {
    id: ModuleId.VENDAS_FOLLOW_UP,
    label: 'Follow-up',
    icon: Clock,
  },
  {
    id: ModuleId.VENDAS_POS_VENDA,
    label: 'Pós-Venda',
    icon: Heart,
  },
  {
    id: ModuleId.VENDAS_CONFIG,
    label: 'Configurações',
    icon: Sliders,
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
    icon: Goal,
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
    icon: Goal,
  },
  {
    id: ModuleId.PROJETOS_CONFIG,
    label: 'Configurações',
    icon: Settings2,
  }
];

export const ESTOQUES_MENU_ITEMS: MenuItem[] = [
  {
    id: ModuleId.ESTOQUES_VISAO_GERAL,
    label: 'Visão Geral',
    icon: LayoutDashboard,
  },
  {
    id: ModuleId.ESTOQUES_MATERIA_PRIMA,
    label: 'Matéria-Prima',
    icon: Box,
  },
  {
    id: ModuleId.ESTOQUES_WIP,
    label: 'Em Processo (WIP)',
    icon: Factory,
  },
  {
    id: ModuleId.ESTOQUES_PRODUTOS_ACABADOS,
    label: 'Produtos Acabados',
    icon: Package,
  },
  {
    id: ModuleId.ESTOQUES_RETALHOS,
    label: 'Retalhos',
    icon: Layers,
  },
  {
    id: ModuleId.ESTOQUES_MOVIMENTACOES,
    label: 'Movimentações',
    icon: RefreshCw,
  },
  {
    id: ModuleId.ESTOQUES_RESERVAS,
    label: 'Reservas',
    icon: BookmarkCheck,
  },
  {
    id: ModuleId.ESTOQUES_INVENTARIO,
    label: 'Inventário',
    icon: ClipboardList,
  },
  {
    id: ModuleId.ESTOQUES_RELATORIOS,
    label: 'Relatórios',
    icon: BarChart3,
  },
  {
    id: ModuleId.ESTOQUES_CONFIG,
    label: 'Configurações',
    icon: Sliders,
  }
];
