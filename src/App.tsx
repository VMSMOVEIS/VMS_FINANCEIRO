import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Menu, Bell, Search, UserCircle, ChevronDown, ChevronRight, Dot, Store, X, Calendar, ArrowRight, Users, Clock, UserPlus, FileSpreadsheet, Settings2, Compass } from 'lucide-react';
import { MENU_ITEMS, RH_MENU_ITEMS, PRODUCAO_MENU_ITEMS, VENDAS_MENU_ITEMS, COMPRAS_MENU_ITEMS, PROJETOS_MENU_ITEMS, ESTOQUES_MENU_ITEMS } from '../constants';
import { MenuItem, ModuleId, SectorId } from '../types';
import { FinancialDashboard } from '../components/FinancialDashboard';
import { AccountsPayable } from '../components/AccountsPayable';
import { AccountsReceivable } from '../components/AccountsReceivable';
import { CashFlow } from '../components/CashFlow';
import { Transactions } from '../components/Transactions';
import { Treasury } from '../components/Treasury';
import { Controllership } from '../components/Controllership';
import { TaxManagement } from '../components/TaxManagement';
import { FinancialReports } from '../components/FinancialReports';
import { Settings } from '../components/Settings';
import { OperationalHistory } from '../components/OperationalHistory';
import { ChartOfAccounts } from '../components/ChartOfAccounts';
import { Accounting } from '../components/Accounting';
import { LeadsManagement } from '../components/LeadsManagement';
import { FinancialAdvances } from '../components/FinancialAdvances';
import { CostManagement } from '../components/CostManagement';
import { Provisions } from '../components/Provisions';
import { PlanningView } from '../components/PlanningView';
import { TransactionModal } from '../components/TransactionModal';
import { TimeTracking } from '../components/TimeTracking';
import { EmployeeManagement } from '../components/EmployeeManagement';
import { PayrollManagement } from '../components/PayrollManagement';
import { RHConfig } from '../components/RHConfig';
import RHDashboard from '../components/RHDashboard';
import RHRecruitment from '../components/RHRecruitment';
import RHTraining from '../components/RHTraining';
import RHBenefits from '../components/RHBenefits';
import RHPerformance from '../components/RHPerformance';
import RHClimate from '../components/RHClimate';
import RHOffboarding from '../components/RHOffboarding';
import RHOrgChart from '../components/RHOrgChart';
import RHDocuments from '../components/RHDocuments';
import RHPortal from '../components/RHPortal';
import { ProductionOrders } from '../components/ProductionOrders';
import ProductionDashboard from '../components/ProductionDashboard';
import ProductionMachines from '../components/ProductionMachines';
import ProductionQuality from '../components/ProductionQuality';
import ProductionMaintenance from '../components/ProductionMaintenance';
import { ProductionPCP } from '../components/ProductionPCP';
import { 
  ProductionCutting, 
  ProductionMachining, 
  ProductionAssembly, 
  ProductionFinishing, 
  ProductionEdging,
  ProductionInstallation,
  ProductionSchedule 
} from '../components/ProductionSectors';
import { ProductionTimeTracking, ProductionRework } from '../components/ProductionOperations';
import { ProductionKPIs, ProductionReports } from '../components/ProductionAnalyticReports';
import { SalesCRM } from '../components/SalesCRM';
import SalesDashboard from '../components/SalesDashboard';
import SalesOrders from '../components/SalesOrders';
import PurchasingOrders from '../components/PurchasingOrders';
import PurchasingDashboard from '../components/PurchasingDashboard';
import PurchasingSuppliers from '../components/PurchasingSuppliers';
import PurchasingQuotes from '../components/PurchasingQuotes';
import SalesCustomers from '../components/SalesCustomers';
import { SalesPDV } from '../components/SalesPDV';
import { SalesCatalog } from '../components/SalesCatalog';
import { SalesQuotes } from '../components/SalesQuotes';
import { SalesSettings } from '../components/SalesSettings';
import { ProductionSettings } from '../components/ProductionSettings';
import { InventoryManagement } from '../components/InventoryManagement';
import { ProjectManagement } from '../components/ProjectManagement';
import ProjectDashboard from '../components/ProjectDashboard';
import ProjectBoards from '../components/ProjectBoards';
import ProjectTasks from '../components/ProjectTasks';
import ProjectCalendar from '../components/ProjectCalendar';
import ProjectTimeline from '../components/ProjectTimeline';
import ProjectDocs from '../components/ProjectDocs';
import ProjectTrainings from '../components/ProjectTrainings';
import ProjectSettings from '../components/ProjectSettings';
import { VendasVisitas } from '../components/VendasVisitas';
import { VendasProjetos } from '../components/VendasProjetos';
import { VendasContratos } from '../components/VendasContratos';
import { VendasAprovacoes } from '../components/VendasAprovacoes';
import { VendasFollowUp } from '../components/VendasFollowUp';
import { VendasPosVenda } from '../components/VendasPosVenda';
import { VendasNegociacao } from '../components/VendasNegociacao';
import { InventoryModule } from '../components/InventoryModule';
import { useTransactions } from './context/TransactionContext';
import { TaskProvider } from './context/TaskContext';
import { DollarSign, LayoutDashboard, Briefcase, Factory, Package, ClipboardList, Wrench, CheckCircle2, ShoppingCart, Target, FileText, UserCheck, BarChart3, GraduationCap, Truck } from 'lucide-react';

const App: React.FC = () => {
  const { userProfile, companyProfile, isLoading, refreshData, transactions, notificationSettings } = useTransactions();
  
  // Initialize state from localStorage
  const [activeSector, setActiveSector] = useState<SectorId>(() => {
    const saved = localStorage.getItem('vms_activeSector');
    return (saved as SectorId) || SectorId.FINANCEIRO;
  });
  
  const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    const saved = localStorage.getItem('vms_activeModule');
    return (saved as ModuleId) || ModuleId.DASHBOARD;
  });
  
  const [activeSubItem, setActiveSubItem] = useState<string | null>(() => {
    return localStorage.getItem('vms_activeSubItem');
  });

  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('vms_expandedModules');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [expandedSectors, setExpandedSectors] = useState<Set<SectorId>>(new Set([activeSector]));

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isPublicCatalog, setIsPublicCatalog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Resize listener to handle mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('vms_activeSector', activeSector);
  }, [activeSector]);

  useEffect(() => {
    localStorage.setItem('vms_activeModule', activeModule);
  }, [activeModule]);

  useEffect(() => {
    if (activeSubItem) {
      localStorage.setItem('vms_activeSubItem', activeSubItem);
    } else {
      localStorage.removeItem('vms_activeSubItem');
    }
  }, [activeSubItem]);

  useEffect(() => {
    localStorage.setItem('vms_expandedModules', JSON.stringify(Array.from(expandedModules)));
  }, [expandedModules]);

  useEffect(() => {
    if (window.location.pathname === '/catalogo-publico') {
      setIsPublicCatalog(true);
    }
  }, []);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Navigation Event Listener
  useEffect(() => {
    const handleNavigate = (event: any) => {
      const { sector, module, subItem } = event.detail;
      if (sector) setActiveSector(sector);
      if (module) setActiveModule(module);
      if (subItem !== undefined) setActiveSubItem(subItem);
      if (isMobile) setSidebarOpen(false);
    };
    window.addEventListener('vms-navigate', handleNavigate);
    return () => window.removeEventListener('vms-navigate', handleNavigate);
  }, [isMobile]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    if (!notificationSettings.dueDateAlert) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alerts: any[] = [];

    transactions.forEach(transaction => {
      if (transaction.status === 'completed') return;

      transaction.payments.forEach(payment => {
        if (payment.status === 'completed') return;

        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Show if within alert range OR overdue
        if (diffDays <= notificationSettings.alertDaysBefore) {
          alerts.push({
            id: `${transaction.id}-${payment.dueDate}`,
            transactionId: transaction.id,
            title: transaction.type === 'expense' ? 'Conta a Pagar' : 'Conta a Receber',
            description: transaction.description,
            value: payment.value,
            dueDate: payment.dueDate,
            daysUntil: diffDays,
            type: transaction.type
          });
        }
      });
    });

    return alerts.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [transactions, notificationSettings]);

  const handleNotificationClick = (notification: any) => {
    if (notification.type === 'expense') {
      setActiveModule(ModuleId.CONTAS_PAGAR);
      setActiveSubItem('cp_geral');
    } else {
      setActiveModule(ModuleId.CONTAS_RECEBER);
      setActiveSubItem('cr_geral');
    }
    setNotificationsOpen(false);
  };

  const toggleModule = (id: string) => {
    const newExpanded = new Set<string>();
    if (!expandedModules.has(id)) {
      newExpanded.add(id);
    }
    setExpandedModules(newExpanded);
  };

  const handleSubItemClick = (moduleId: ModuleId, subItemId: string) => {
    setActiveModule(moduleId);
    setActiveSubItem(subItemId);
  };

  const handleMainItemClick = (item: MenuItem) => {
    if (item.subItems && item.subItems.length > 0) {
      const newExpanded = new Set<string>();
      newExpanded.add(item.id);
      setExpandedModules(newExpanded);
      setActiveModule(item.id);
      setActiveSubItem(item.subItems[0].id);
    } else {
      setExpandedModules(new Set());
      setActiveModule(item.id);
      setActiveSubItem(null);
    }
  };

  const renderContent = () => {
    // Handle Sub-items for Operational History
    if (activeModule === ModuleId.HISTORICO_OPERACIONAL) {
      if (activeSubItem === 'historico_compras') {
        return <OperationalHistory type="purchases" />;
      }
      // Default to sales or check specific sub-item
      return <OperationalHistory type="sales" />;
    }

    // Handle Sub-items for Accounts Payable
    if (activeModule === ModuleId.CONTAS_PAGAR) {
      return <AccountsPayable />;
    }

    // Handle Sub-items for Accounts Receivable
    if (activeModule === ModuleId.CONTAS_RECEBER) {
      return <AccountsReceivable />;
    }

    switch (activeModule) {
      // RH Modules
      case ModuleId.RH_DASHBOARD:
        return <RHDashboard />;
      case ModuleId.RH_FUNCIONARIOS:
        return <EmployeeManagement activeSubItem={activeSubItem} />;
      case ModuleId.RH_FOLHA:
        return <PayrollManagement activeSubItem={activeSubItem} />;
      case ModuleId.RH_PONTO:
        return <TimeTracking />;
      case ModuleId.RH_RECRUTAMENTO:
        return <RHRecruitment />;
      case ModuleId.RH_TREINAMENTO:
        return <RHTraining />;
      case ModuleId.RH_BENEFICIOS:
        return <RHBenefits />;
      case ModuleId.RH_DESEMPENHO:
        return <RHPerformance />;
      case ModuleId.RH_CLIMA:
        return <RHClimate />;
      case ModuleId.RH_OFFBOARDING:
        return <RHOffboarding />;
      case ModuleId.RH_ORGANOGRAMA:
        return <RHOrgChart />;
      case ModuleId.RH_DOCUMENTOS:
        return <RHDocuments />;
      case ModuleId.RH_PORTAL:
        return <RHPortal />;
      case ModuleId.RH_CONFIG:
        return <RHConfig />;

      // Produção Modules
      case ModuleId.PRODUCAO_DASHBOARD:
        return <ProductionDashboard />;
      case ModuleId.PRODUCAO_PCP:
        return <ProductionPCP />;
      case ModuleId.PRODUCAO_ORDENS:
        return <ProductionOrders />;
      case ModuleId.PRODUCAO_CRONOGRAMA:
        return <ProductionSchedule />;
      case ModuleId.PRODUCAO_CORTE:
        return <ProductionCutting />;
      case ModuleId.PRODUCAO_BORDEAMENTO:
        return <ProductionEdging />;
      case ModuleId.PRODUCAO_USINAGEM:
        return <ProductionMachining />;
      case ModuleId.PRODUCAO_MONTAGEM:
        return <ProductionAssembly />;
      case ModuleId.PRODUCAO_ACABAMENTO:
        return <ProductionFinishing />;
      case ModuleId.PRODUCAO_INSTALACAO:
        return <ProductionInstallation />;
      case ModuleId.PRODUCAO_APONTAMENTOS:
        return <ProductionTimeTracking />;
      case ModuleId.PRODUCAO_QUALIDADE:
        return <ProductionQuality />;
      case ModuleId.PRODUCAO_RETRABALHO:
        return <ProductionRework />;
      case ModuleId.PRODUCAO_MANUTENCAO:
        return <ProductionMaintenance />;
      case ModuleId.PRODUCAO_KPI:
        return <ProductionKPIs />;
      case ModuleId.PRODUCAO_RELATORIOS:
        return <ProductionReports />;
        
      case ModuleId.ESTOQUES_VISAO_GERAL:
      case ModuleId.ESTOQUES_MATERIA_PRIMA:
      case ModuleId.ESTOQUES_WIP:
      case ModuleId.ESTOQUES_PRODUTOS_ACABADOS:
      case ModuleId.ESTOQUES_RETALHOS:
      case ModuleId.ESTOQUES_MOVIMENTACOES:
      case ModuleId.ESTOQUES_RESERVAS:
      case ModuleId.ESTOQUES_INVENTARIO:
      case ModuleId.ESTOQUES_RELATORIOS:
      case ModuleId.ESTOQUES_CONFIG:
        return <InventoryModule activeModule={activeModule} />;

      // Vendas Modules
      case ModuleId.VENDAS_DASHBOARD:
        return <SalesDashboard />;
      case ModuleId.VENDAS_PDV:
        return <SalesPDV />;
      case ModuleId.VENDAS_LEADS:
        return <LeadsManagement />;
      case ModuleId.VENDAS_PEDIDOS:
        return <SalesOrders />;
      case ModuleId.VENDAS_ORCAMENTOS:
        return <SalesQuotes />;
      case ModuleId.VENDAS_CLIENTES:
        return <SalesCustomers />;
      case ModuleId.VENDAS_VISITAS:
        return <VendasVisitas />;
      case ModuleId.VENDAS_PROJETOS:
        return <VendasProjetos />;
      case ModuleId.VENDAS_CONTRATOS:
        return <VendasContratos />;
      case ModuleId.VENDAS_APROVACOES:
        return <VendasAprovacoes />;
      case ModuleId.VENDAS_FOLLOW_UP:
        return <VendasFollowUp />;
      case ModuleId.VENDAS_POS_VENDA:
        return <VendasPosVenda />;
      case ModuleId.VENDAS_NEGOCIACAO:
        return <VendasNegociacao />;
      case ModuleId.VENDAS_CATALOGO:
        return <SalesCatalog />;
      case ModuleId.VENDAS_CONFIG:
        return <SalesSettings />;
      case ModuleId.PRODUCAO_CONFIG:
        return <ProductionSettings />;
      
      case ModuleId.ENTREGAS_INSTALACAO:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-100 p-8 rounded-full mb-6">
              <Truck size={64} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Entregas & Instalação</h2>
            <p className="text-gray-500 max-w-md">Gerenciamento de logística e montagem em campo.</p>
          </div>
        );
      
      // Compras Modules
      case ModuleId.COMPRAS_DASHBOARD:
        return <PurchasingDashboard />;
      case ModuleId.COMPRAS_PEDIDOS:
        return <PurchasingOrders />;
      case ModuleId.COMPRAS_FORNECEDORES:
        return <PurchasingSuppliers />;
      case ModuleId.COMPRAS_COTACAO:
        return <PurchasingQuotes />;
      case ModuleId.COMPRAS_CONFIG:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-indigo-100 p-8 rounded-full mb-6">
              <Settings2 size={64} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Configurações Compras</h2>
            <p className="text-gray-500 max-w-md">Parâmetros do módulo de suprimentos.</p>
          </div>
        );

      // Projetos Modules
      case ModuleId.PROJETOS_DASHBOARD:
        return <ProjectDashboard />;
      case ModuleId.PROJETOS_QUADROS:
        return <ProjectBoards />;
      case ModuleId.PROJETOS_TAREFAS:
        return <ProjectTasks />;
      case ModuleId.PROJETOS_CALENDARIO:
        return <ProjectCalendar />;
      case ModuleId.PROJETOS_TIMELINE:
        return <ProjectTimeline />;
      case ModuleId.PROJETOS_DOCS:
        return <ProjectDocs />;
      case ModuleId.PROJETOS_TREINAMENTOS:
        return <ProjectTrainings />;
      case ModuleId.PROJETOS_CONFIG:
        return <ProjectSettings />;

      // Planejamento Modules
      case ModuleId.PLAN_FINANCEIRO:
        return <PlanningView sector="Financeiro" />;
      case ModuleId.PLAN_RH:
        return <PlanningView sector="RH" />;
      case ModuleId.PLAN_PRODUCAO:
        return <PlanningView sector="Produção" />;
      case ModuleId.PLAN_VENDAS:
        return <PlanningView sector="Vendas" />;
      case ModuleId.PLAN_COMPRAS:
        return <PlanningView sector="Compras" />;
      case ModuleId.PLAN_PROJETOS:
        return <PlanningView sector="Projetos" />;

      case ModuleId.DASHBOARD:
        return <FinancialDashboard />;
      case ModuleId.LANCAMENTOS:
        return <Transactions />;
      case ModuleId.FINANCEIRO_ADIANTAMENTOS:
        const advanceFilter = activeSubItem === 'adiant_clientes' ? 'customer' : activeSubItem === 'adiant_fornecedores' ? 'supplier' : 'all';
        return <FinancialAdvances initialFilter={advanceFilter as any} />;
      case ModuleId.PLANO_CONTAS:
        return <ChartOfAccounts />;
      case ModuleId.CONTABILIDADE:
        return <Accounting initialView={activeSubItem || 'contab_dre'} />;
      case ModuleId.FLUXO_CAIXA:
        return <CashFlow />;
      case ModuleId.TESOURARIA:
        return <Treasury />;
      case ModuleId.CONTROLADORIA:
        return <Controllership />;
      case ModuleId.GESTAO_CUSTOS:
        return <CostManagement />;
      case ModuleId.PROVISOES:
        return <Provisions />;
      case ModuleId.FISCAL:
        return <TaxManagement />;
      case ModuleId.RELATORIOS:
        return <FinancialReports />;
      case ModuleId.CONFIGURACOES:
        return <Settings />;

      default:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center opacity-60">
              <div className="bg-gray-100 p-8 rounded-full mb-6">
                  {(() => {
                      const Icon = currentMenuItems.find(m => m.id === activeModule)?.icon || Dot;
                      return <Icon size={64} className="text-gray-400" />;
                  })()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo em Desenvolvimento</h2>
              <p className="text-gray-500 max-w-md">
                  O módulo de <strong>{currentMenuItems.find(m => m.id === activeModule)?.label}</strong> está sendo preparado para o sistema VMS {getSectorLabel(activeSector)}.
              </p>
          </div>
        );
    }
  };

  const getSectorLabel = (id: SectorId) => {
    switch (id) {
      case SectorId.FINANCEIRO: return 'Financeiro';
      case SectorId.RH: return 'RH';
      case SectorId.PRODUCAO: return 'Produção';
      case SectorId.VENDAS: return 'Vendas';
      case SectorId.COMPRAS: return 'Compras';
      case SectorId.PROJETOS: return 'Projetos';
      case SectorId.ESTOQUES: return 'Estoques';
      default: return '';
    }
  };

  const currentMenuItems = activeSector === SectorId.FINANCEIRO ? MENU_ITEMS : activeSector === SectorId.RH ? RH_MENU_ITEMS : activeSector === SectorId.PRODUCAO ? PRODUCAO_MENU_ITEMS : activeSector === SectorId.VENDAS ? VENDAS_MENU_ITEMS : activeSector === SectorId.COMPRAS ? COMPRAS_MENU_ITEMS : activeSector === SectorId.ESTOQUES ? ESTOQUES_MENU_ITEMS : PROJETOS_MENU_ITEMS;
  const sectorColor = activeSector === SectorId.FINANCEIRO ? '#0f172a' : activeSector === SectorId.RH ? '#500724' : activeSector === SectorId.PRODUCAO ? '#431407' : activeSector === SectorId.VENDAS ? '#022c22' : activeSector === SectorId.COMPRAS ? '#1e1b4b' : activeSector === SectorId.PROJETOS ? '#1e1b4b' : activeSector === SectorId.ESTOQUES ? '#1e293b' : '#022c22'; 
  const sectorAccent = activeSector === SectorId.FINANCEIRO ? '#1e40af' : activeSector === SectorId.RH ? '#831843' : activeSector === SectorId.PRODUCAO ? '#78350f' : activeSector === SectorId.VENDAS ? '#047857' : activeSector === SectorId.COMPRAS ? '#312e81' : activeSector === SectorId.PROJETOS ? '#4338ca' : activeSector === SectorId.ESTOQUES ? '#334155' : '#047857'; 
  const sectorBorder = activeSector === SectorId.FINANCEIRO ? '#1e3a8a' : activeSector === SectorId.RH ? '#700b34' : activeSector === SectorId.PRODUCAO ? '#92400e' : activeSector === SectorId.VENDAS ? '#064e3b' : activeSector === SectorId.COMPRAS ? '#3730a3' : activeSector === SectorId.PROJETOS ? '#3730a3' : activeSector === SectorId.ESTOQUES ? '#475569' : '#064e3b';
  const sectorIconColor = activeSector === SectorId.FINANCEIRO ? 'text-blue-400' : activeSector === SectorId.RH ? 'text-pink-400' : activeSector === SectorId.PRODUCAO ? 'text-orange-400' : activeSector === SectorId.VENDAS ? 'text-emerald-400' : activeSector === SectorId.COMPRAS ? 'text-indigo-400' : activeSector === SectorId.PROJETOS ? 'text-indigo-400' : activeSector === SectorId.ESTOQUES ? 'text-slate-400' : 'text-emerald-400';
  const sectorShadow = activeSector === SectorId.FINANCEIRO ? 'rgba(59,130,246,0.5)' : activeSector === SectorId.RH ? 'rgba(244,114,182,0.5)' : activeSector === SectorId.PRODUCAO ? 'rgba(251,146,60,0.5)' : activeSector === SectorId.VENDAS ? 'rgba(52,211,153,0.5)' : activeSector === SectorId.COMPRAS ? 'rgba(99,102,241,0.5)' : activeSector === SectorId.PROJETOS ? 'rgba(99,102,241,0.5)' : activeSector === SectorId.ESTOQUES ? 'rgba(71,85,105,0.5)' : 'rgba(52,211,153,0.5)';
  const sectorIndicator = activeSector === SectorId.FINANCEIRO ? '#3b82f6' : activeSector === SectorId.RH ? '#f472b6' : activeSector === SectorId.PRODUCAO ? '#f59e0b' : activeSector === SectorId.VENDAS ? '#10b981' : activeSector === SectorId.COMPRAS ? '#6366f1' : activeSector === SectorId.PROJETOS ? '#6366f1' : activeSector === SectorId.ESTOQUES ? '#64748b' : '#10b981';

  if (isPublicCatalog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-400 to-teal-600">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-tight">{companyProfile.name} - Catálogo</span>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Visualização Pública
          </div>
        </header>
        <main className="max-w-7xl mx-auto">
          <SalesCatalog isPublic={true} />
        </main>
        <footer className="py-8 text-center text-gray-400 text-xs border-t border-gray-100 mt-12">
          &copy; {new Date().getFullYear()} {companyProfile.name}. Todos os direitos reservados.
        </footer>
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        
        {/* Backdrop for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside 
          className={`
            flex flex-col text-white transition-all duration-300 shadow-2xl overflow-hidden
            ${isMobile ? (isSidebarOpen ? 'fixed inset-y-0 left-0 w-72 z-50' : 'fixed inset-y-0 left-0 w-0 z-50') : (isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0')} 
            border-r
          `}
          style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
        >
          {/* Logo Area */}
          <div className="h-16 flex items-center px-4 border-b border-white/10 shadow-md flex-shrink-0" style={{ backgroundColor: '#1e40af' }}>
            <div className="font-black text-base tracking-tighter flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Store size={18} className="text-white" />
              </div>
              <span className="font-black tracking-tight uppercase tracking-widest text-[10px]">VMS MÓVEIS ERP</span>
            </div>
          </div>

          {/* User Info Compact */}
          <div className="px-6 py-4 border-b border-white/10" style={{ backgroundColor: '#1e3a8a' }}>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest mb-0.5 opacity-70 font-black">Organização</p>
            <p className="font-black text-xs truncate text-white uppercase">{companyProfile.name}</p>
          </div>

          {/* Navigation Scroll Area */}
          <div className="flex-1 overflow-y-auto sidebar-scroll py-2">
            {[
              { id: SectorId.FINANCEIRO, label: 'Financeiro', icon: DollarSign, items: MENU_ITEMS, color: 'from-blue-400 to-indigo-600' },
              { id: SectorId.ESTOQUES, label: 'Estoques', icon: Package, items: ESTOQUES_MENU_ITEMS, color: 'from-slate-400 to-slate-600' },
              { id: SectorId.VENDAS, label: 'Vendas', icon: ShoppingCart, items: VENDAS_MENU_ITEMS, color: 'from-emerald-400 to-teal-600' },
              { id: SectorId.RH, label: 'RH', icon: Users, items: RH_MENU_ITEMS, color: 'from-pink-400 to-rose-600' },
              { id: SectorId.PRODUCAO, label: 'Produção', icon: Factory, items: PRODUCAO_MENU_ITEMS, color: 'from-orange-400 to-amber-600' },
              { id: SectorId.COMPRAS, label: 'Compras', icon: ShoppingCart, items: COMPRAS_MENU_ITEMS, color: 'from-indigo-400 to-violet-600' },
              { id: SectorId.PROJETOS, label: 'Projetos', icon: ClipboardList, items: PROJETOS_MENU_ITEMS, color: 'from-purple-400 to-indigo-600' },
            ].map((sector) => {
              const isExpanded = expandedSectors.has(sector.id);
              const isActiveSector = activeSector === sector.id;

              return (
                <div key={sector.id} className="mb-1">
                  <div
                    onClick={() => {
                      const next = new Set(expandedSectors);
                      if (next.has(sector.id)) next.delete(sector.id);
                      else next.add(sector.id);
                      setExpandedSectors(next);
                    }}
                    className={`
                      flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200
                      ${isActiveSector ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br ${sector.color}`}>
                        <sector.icon size={16} className="text-white" />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isActiveSector ? 'text-white font-black' : 'text-gray-400 font-bold'}`}>
                        {sector.label}
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
                  </div>

                  {isExpanded && (
                    <div className="mt-1 space-y-0.5 ml-8 pl-4 border-l border-white/5 py-1 animate-in slide-in-from-top-2 duration-300">
                      {sector.items.map((item) => (
                        <div key={item.id} className="mb-0.5 select-none">
                          <div
                            onClick={() => {
                              setActiveSector(sector.id);
                              handleMainItemClick(item);
                            }}
                            className={`
                              relative flex items-center px-4 py-2 cursor-pointer transition-all duration-200 rounded-lg mr-2
                              ${activeModule === item.id && isActiveSector ? 'bg-indigo-600/50 text-white font-medium shadow-sm border border-indigo-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                            `}
                          >
                            <div className="flex items-center flex-1 gap-3 z-10">
                              <item.icon size={14} className={activeModule === item.id && isActiveSector ? 'text-white' : 'text-gray-500'} />
                              <span className={`text-[10px] uppercase font-black tracking-tighter ${activeModule === item.id && isActiveSector ? 'text-white' : 'text-gray-400'}`}>
                                {item.label}
                              </span>
                            </div>
                            
                            {item.subItems && item.subItems.length > 0 && (
                              <div className="text-gray-500">
                                {expandedModules.has(item.id) ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                              </div>
                            )}
                          </div>

                          {item.subItems && item.subItems.length > 0 && expandedModules.has(item.id) && isActiveSector && (
                            <div className="relative ml-6 pl-4 border-l border-white/5 space-y-1 py-1 mt-1">
                              {item.subItems.map((sub) => {
                                const isSubActive = activeSubItem === sub.id && activeModule === item.id && isActiveSector;
                                return (
                                  <div
                                    key={sub.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveSector(sector.id);
                                      handleSubItemClick(item.id, sub.id);
                                    }}
                                    className={`
                                      group flex items-center gap-2 px-3 py-1 text-[9px] rounded-md cursor-pointer transition-colors uppercase font-bold tracking-tight
                                      ${isSubActive ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                    `}
                                  >
                                    <div className={`w-1 h-1 rounded-full ${isSubActive ? 'bg-indigo-400' : 'bg-gray-600'}`}></div>
                                    <span>{sub.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 mt-auto border-t border-white/5 opacity-40">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-1.5 bg-white/10 rounded overflow-hidden">
                  <Store size={14} className="text-white" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">VMS ERP</span>
                  <span className="text-[9px] font-bold text-gray-400">v2.1.0</span>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
              >
                <Menu size={20} />
              </button>
              
              {/* Context Breadcrumb */}
              <div className="hidden md:flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900">VMS {getSectorLabel(activeSector)}</span>
                <ChevronRight size={14} className="mx-2 opacity-50" />
                <span className="cursor-pointer hover:text-gray-700 font-bold text-slate-800">
                  {currentMenuItems.find(i => i.id === activeModule)?.label}
                </span>
                {activeSubItem && (
                  <>
                    <ChevronRight size={14} className="mx-2 opacity-30" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded cursor-default border border-emerald-100">
                      {activeSubItem.split('_').pop()?.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar cliente, pedido ou contrato..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 w-64 bg-gray-50 transition-all hover:bg-white focus:bg-white"
                />
              </div>

              <button 
                onClick={refreshData}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                title="Sincronizar com Nuvem"
              >
                <Store size={20} className={isLoading ? 'animate-spin text-emerald-600' : ''} />
              </button>

              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <button className="flex items-center gap-3 hover:bg-gray-50 py-1 px-4 rounded-xl transition-all border border-transparent hover:border-gray-100">
                <div className="relative">
                   <Bell size={24} className="text-slate-400" />
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white flex items-center justify-center rounded-full font-black border-2 border-white">5</span>
                </div>
                
                <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
                </div>

                <div className="text-right hidden md:block select-none">
                  <p className="text-[11px] font-black text-slate-800 leading-tight">Administrador</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-end gap-1">
                    VMS MÓVEIS
                    <ChevronDown size={12} className="text-gray-300" />
                  </p>
                </div>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className={`flex-1 overflow-y-auto relative ${activeSector === SectorId.FINANCEIRO ? 'bg-blue-50/30' : activeSector === SectorId.RH ? 'bg-pink-50/30' : activeSector === SectorId.PRODUCAO ? 'bg-orange-50/30' : activeSector === SectorId.VENDAS ? 'bg-emerald-50/30' : activeSector === SectorId.PROJETOS ? 'bg-indigo-50/30' : activeSector === SectorId.ESTOQUES ? 'bg-slate-50/30' : 'bg-emerald-50/30'}`}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <div className={`bg-white p-6 rounded-2xl shadow-xl border flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 ${activeSector === SectorId.FINANCEIRO ? 'border-blue-100' : activeSector === SectorId.RH ? 'border-pink-100' : activeSector === SectorId.PRODUCAO ? 'border-orange-100' : activeSector === SectorId.PROJETOS ? 'border-indigo-100' : activeSector === SectorId.ESTOQUES ? 'border-slate-100' : 'border-emerald-100'}`}>
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin ${activeSector === SectorId.FINANCEIRO ? 'border-blue-100 border-t-blue-600' : activeSector === SectorId.RH ? 'border-pink-100 border-t-pink-600' : activeSector === SectorId.PRODUCAO ? 'border-orange-100 border-t-orange-600' : activeSector === SectorId.PROJETOS ? 'border-indigo-100 border-t-indigo-600' : activeSector === SectorId.ESTOQUES ? 'border-slate-100 border-t-slate-600' : 'border-emerald-100 border-t-emerald-600'}`}></div>
                  <p className={`font-medium text-sm ${activeSector === SectorId.FINANCEIRO ? 'text-blue-900' : activeSector === SectorId.RH ? 'text-pink-900' : activeSector === SectorId.PRODUCAO ? 'text-orange-900' : activeSector === SectorId.PROJETOS ? 'text-indigo-900' : activeSector === SectorId.ESTOQUES ? 'text-slate-900' : 'text-emerald-900'}`}>Sincronizando com a nuvem...</p>
                </div>
              </div>
            )}
            {renderContent()}
          </main>
          
          <TransactionModal />

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-30 flex items-center justify-around">
              {[
                { id: SectorId.FINANCEIRO, label: 'Fin.', icon: DollarSign },
                { id: SectorId.ESTOQUES, label: 'Est.', icon: Package },
                { id: SectorId.VENDAS, label: 'Ven.', icon: ShoppingCart },
                { id: SectorId.PRODUCAO, label: 'Prod.', icon: Factory },
                { id: SectorId.RH, label: 'RH', icon: Users },
                { id: SectorId.PROJETOS, label: 'Proj.', icon: ClipboardList },
              ].map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => {
                    setActiveSector(sector.id);
                    // Reset to dashboard when switching sector
                    const menu = sector.id === SectorId.FINANCEIRO ? MENU_ITEMS : sector.id === SectorId.RH ? RH_MENU_ITEMS : sector.id === SectorId.PRODUCAO ? PRODUCAO_MENU_ITEMS : sector.id === SectorId.VENDAS ? VENDAS_MENU_ITEMS : sector.id === SectorId.COMPRAS ? COMPRAS_MENU_ITEMS : sector.id === SectorId.ESTOQUES ? ESTOQUES_MENU_ITEMS : PROJETOS_MENU_ITEMS;
                    setActiveModule(menu[0].id);
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeSector === sector.id ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
                >
                  <sector.icon size={20} />
                  <span className="text-[10px] mt-0.5">{sector.label}</span>
                </button>
              ))}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center p-2 text-gray-400"
              >
                <Menu size={20} />
                <span className="text-[10px] mt-0.5">Menu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </TaskProvider>
  );
};

export default App;