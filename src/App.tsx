import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Menu, Bell, Search, UserCircle, ChevronDown, ChevronRight, Dot, Store, X, Calendar, ArrowRight, Users, Clock, UserPlus, FileSpreadsheet, Settings2 } from 'lucide-react';
import { MENU_ITEMS, RH_MENU_ITEMS, PRODUCAO_MENU_ITEMS, VENDAS_MENU_ITEMS, COMPRAS_MENU_ITEMS } from '../constants';
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
import { TransactionModal } from '../components/TransactionModal';
import { TimeTracking } from '../components/TimeTracking';
import { EmployeeManagement } from '../components/EmployeeManagement';
import { PayrollManagement } from '../components/PayrollManagement';
import { RHConfig } from '../components/RHConfig';
import { ProductionOrders } from '../components/ProductionOrders';
import SalesCRM from '../components/SalesCRM';
import SalesDashboard from '../components/SalesDashboard';
import SalesOrders from '../components/SalesOrders';
import PurchasingOrders from '../components/PurchasingOrders';
import SalesCustomers from '../components/SalesCustomers';
import { SalesPDV } from '../components/SalesPDV';
import { SalesCatalog } from '../components/SalesCatalog';
import { SalesQuotes } from '../components/SalesQuotes';
import { SalesSettings } from '../components/SalesSettings';
import { ProductionSettings } from '../components/ProductionSettings';
import { ProductionInventory } from '../components/ProductionInventory';
import { useTransactions } from '@/src/context/TransactionContext';
import { DollarSign, LayoutDashboard, Briefcase, Factory, Package, ClipboardList, Wrench, CheckCircle2, ShoppingCart, Target, FileText, UserCheck, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const { userProfile, companyProfile, isLoading, refreshData, transactions, notificationSettings } = useTransactions();
  const [activeSector, setActiveSector] = useState<SectorId>(SectorId.FINANCEIRO);
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.DASHBOARD);
  // activeSubItem is kept for potential future use or deep linking, though mostly flattened now
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set()); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isPublicCatalog, setIsPublicCatalog] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/catalogo-publico') {
      setIsPublicCatalog(true);
    }
  }, []);
  const notificationRef = useRef<HTMLDivElement>(null);

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
      const tab = activeSubItem === 'cp_adiantamentos' ? 'adiantamentos' : 'geral';
      return <AccountsPayable initialTab={tab} />;
    }

    // Handle Sub-items for Accounts Receivable
    if (activeModule === ModuleId.CONTAS_RECEBER) {
      const tab = activeSubItem === 'cr_adiantamentos' ? 'adiantamentos' : 'geral';
      return <AccountsReceivable initialTab={tab} />;
    }

    switch (activeModule) {
      // RH Modules
      case ModuleId.RH_DASHBOARD:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 p-8 rounded-full mb-6">
              <LayoutDashboard size={64} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard RH</h2>
            <p className="text-gray-500 max-w-md">Visão geral da gestão de pessoas e indicadores de RH.</p>
          </div>
        );
      case ModuleId.RH_FUNCIONARIOS:
        return <EmployeeManagement activeSubItem={activeSubItem} />;
      case ModuleId.RH_FOLHA:
        return <PayrollManagement activeSubItem={activeSubItem} />;
      case ModuleId.RH_PONTO:
        return <TimeTracking />;
      case ModuleId.RH_RECRUTAMENTO:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 p-8 rounded-full mb-6">
              <UserPlus size={64} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recrutamento & Seleção</h2>
            <p className="text-gray-500 max-w-md">Gestão de vagas e processos seletivos.</p>
          </div>
        );
      case ModuleId.RH_CONFIG:
        return <RHConfig />;

      // Produção Modules
      case ModuleId.PRODUCAO_DASHBOARD:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-orange-100 p-8 rounded-full mb-6">
              <LayoutDashboard size={64} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Produção</h2>
            <p className="text-gray-500 max-w-md">Visão geral da linha de produção e produtividade.</p>
          </div>
        );
      case ModuleId.PRODUCAO_ORDENS:
        return <ProductionOrders activeSubItem={activeSubItem} />;
      case ModuleId.PRODUCAO_ESTOQUE:
        return <ProductionInventory activeSubItem={activeSubItem} />;
      case ModuleId.PRODUCAO_MAQUINAS:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-orange-100 p-8 rounded-full mb-6">
              <Factory size={64} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Máquinas & Equipamentos</h2>
            <p className="text-gray-500 max-w-md">Gestão de ativos e capacidade produtiva.</p>
          </div>
        );

      // Vendas Modules
      case ModuleId.VENDAS_DASHBOARD:
        return <SalesDashboard />;
      case ModuleId.VENDAS_PDV:
        return <SalesPDV />;
      case ModuleId.VENDAS_CRM:
        return <SalesCRM />;
      case ModuleId.VENDAS_PEDIDOS:
        return <SalesOrders />;
      case ModuleId.VENDAS_ORCAMENTOS:
        return <SalesQuotes />;
      case ModuleId.VENDAS_CLIENTES:
        return <SalesCustomers />;
      case ModuleId.VENDAS_CATALOGO:
        return <SalesCatalog />;
      case ModuleId.VENDAS_CONFIG:
        return <SalesSettings />;
      case ModuleId.PRODUCAO_CONFIG:
        return <ProductionSettings />;
      
      // Compras Modules
      case ModuleId.COMPRAS_DASHBOARD:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-indigo-100 p-8 rounded-full mb-6">
              <LayoutDashboard size={64} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Compras</h2>
            <p className="text-gray-500 max-w-md">Visão geral das aquisições e fornecedores.</p>
          </div>
        );
      case ModuleId.COMPRAS_PEDIDOS:
        return <PurchasingOrders />;
      case ModuleId.COMPRAS_FORNECEDORES:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-indigo-100 p-8 rounded-full mb-6">
              <Users size={64} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestão de Fornecedores</h2>
            <p className="text-gray-500 max-w-md">Cadastro e avaliação de parceiros comerciais.</p>
          </div>
        );
      case ModuleId.COMPRAS_COTACAO:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-indigo-100 p-8 rounded-full mb-6">
              <FileSpreadsheet size={64} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cotações de Preço</h2>
            <p className="text-gray-500 max-w-md">Comparativo de preços e condições de compra.</p>
          </div>
        );
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

      case ModuleId.DASHBOARD:
        return <FinancialDashboard />;
      case ModuleId.LANCAMENTOS:
        return <Transactions />;
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
                  O módulo de <strong>{currentMenuItems.find(m => m.id === activeModule)?.label}</strong> está sendo preparado para o sistema VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : activeSector === SectorId.RH ? 'RH' : activeSector === SectorId.PRODUCAO ? 'Produção' : activeSector === SectorId.VENDAS ? 'Vendas' : 'Compras'}.
              </p>
          </div>
        );
    }
  };

  const currentMenuItems = activeSector === SectorId.FINANCEIRO ? MENU_ITEMS : activeSector === SectorId.RH ? RH_MENU_ITEMS : activeSector === SectorId.PRODUCAO ? PRODUCAO_MENU_ITEMS : activeSector === SectorId.VENDAS ? VENDAS_MENU_ITEMS : COMPRAS_MENU_ITEMS;
  const sectorColor = activeSector === SectorId.FINANCEIRO ? '#0f172a' : activeSector === SectorId.RH ? '#500724' : activeSector === SectorId.PRODUCAO ? '#431407' : activeSector === SectorId.VENDAS ? '#022c22' : '#1e1b4b'; 
  const sectorAccent = activeSector === SectorId.FINANCEIRO ? '#1e40af' : activeSector === SectorId.RH ? '#831843' : activeSector === SectorId.PRODUCAO ? '#78350f' : activeSector === SectorId.VENDAS ? '#047857' : '#312e81'; 
  const sectorBorder = activeSector === SectorId.FINANCEIRO ? '#1e3a8a' : activeSector === SectorId.RH ? '#700b34' : activeSector === SectorId.PRODUCAO ? '#92400e' : activeSector === SectorId.VENDAS ? '#064e3b' : '#3730a3';
  const sectorIconColor = activeSector === SectorId.FINANCEIRO ? 'text-blue-400' : activeSector === SectorId.RH ? 'text-pink-400' : activeSector === SectorId.PRODUCAO ? 'text-orange-400' : activeSector === SectorId.VENDAS ? 'text-emerald-400' : 'text-indigo-400';
  const sectorShadow = activeSector === SectorId.FINANCEIRO ? 'rgba(59,130,246,0.5)' : activeSector === SectorId.RH ? 'rgba(244,114,182,0.5)' : activeSector === SectorId.PRODUCAO ? 'rgba(251,146,60,0.5)' : activeSector === SectorId.VENDAS ? 'rgba(52,211,153,0.5)' : 'rgba(99,102,241,0.5)';
  const sectorIndicator = activeSector === SectorId.FINANCEIRO ? '#3b82f6' : activeSector === SectorId.RH ? '#f472b6' : activeSector === SectorId.PRODUCAO ? '#f59e0b' : activeSector === SectorId.VENDAS ? '#10b981' : '#6366f1';

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
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        
        {/* Sector Sidebar (Far Left) */}
        <div className="w-16 bg-[#111827] flex flex-col items-center py-6 gap-6 z-30 border-r border-white/5">
          <div 
            onClick={() => {
              setActiveSector(SectorId.FINANCEIRO);
              setActiveModule(ModuleId.DASHBOARD);
            }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all
              ${activeSector === SectorId.FINANCEIRO ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor Financeiro"
          >
            <DollarSign size={20} />
          </div>

          <div 
            onClick={() => {
              setActiveSector(SectorId.VENDAS);
              setActiveModule(ModuleId.VENDAS_DASHBOARD);
            }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300
              ${activeSector === SectorId.VENDAS ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor Vendas"
          >
            <ShoppingCart size={20} />
          </div>

          <div 
            onClick={() => {
              setActiveSector(SectorId.RH);
              setActiveModule(ModuleId.RH_DASHBOARD);
            }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all
              ${activeSector === SectorId.RH ? 'bg-pink-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor RH"
          >
            <Users size={20} />
          </div>

          <div 
            onClick={() => {
              setActiveSector(SectorId.PRODUCAO);
              setActiveModule(ModuleId.PRODUCAO_DASHBOARD);
            }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300
              ${activeSector === SectorId.PRODUCAO ? 'bg-orange-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor Produção"
          >
            <Factory size={20} />
          </div>

          <div 
            onClick={() => {
              setActiveSector(SectorId.COMPRAS);
              setActiveModule(ModuleId.COMPRAS_DASHBOARD);
            }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300
              ${activeSector === SectorId.COMPRAS ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor Compras"
          >
            <ShoppingCart size={20} />
          </div>
        </div>

        {/* Sidebar */}
        <aside 
          className={`
            flex flex-col text-white transition-all duration-300 z-20 shadow-2xl
            ${isSidebarOpen ? 'w-72' : 'w-0 -ml-72'} 
            lg:w-72 lg:ml-0
            border-r
          `}
          style={{ backgroundColor: sectorColor, borderColor: sectorBorder }}
        >
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-white/10 shadow-md" style={{ backgroundColor: sectorAccent }}>
            <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br ${activeSector === SectorId.FINANCEIRO ? 'from-blue-400 to-indigo-600' : activeSector === SectorId.RH ? 'from-pink-400 to-rose-600' : activeSector === SectorId.PRODUCAO ? 'from-orange-400 to-amber-600' : activeSector === SectorId.VENDAS ? 'from-emerald-400 to-teal-600' : 'from-indigo-400 to-violet-600'}`}>
                {activeSector === SectorId.FINANCEIRO ? <Store size={18} className="text-white" /> : activeSector === SectorId.RH ? <Users size={18} className="text-white" /> : activeSector === SectorId.PRODUCAO ? <Factory size={18} className="text-white" /> : <ShoppingCart size={18} className="text-white" />}
              </div>
              <span className="font-bold tracking-tight">VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : activeSector === SectorId.RH ? 'RH' : activeSector === SectorId.PRODUCAO ? 'Produção' : activeSector === SectorId.VENDAS ? 'Vendas' : 'Compras'}</span>
            </div>
          </div>

          {/* User Info Compact */}
          <div className="px-6 py-6 border-b border-white/10" style={{ backgroundColor: sectorBorder }}>
            <p className="text-xs text-emerald-200 uppercase tracking-wider mb-1 opacity-70">Organização</p>
            <p className="font-semibold text-sm truncate text-white">{companyProfile.name}</p>
          </div>

          {/* Navigation Scroll Area */}
          <div className="flex-1 overflow-y-auto sidebar-scroll py-4">
            <div className="space-y-1">
              {currentMenuItems.map((item) => (
                <div key={item.id} className="mb-1 select-none">
                  <div
                    onClick={() => handleMainItemClick(item)}
                    className={`
                      relative flex items-center px-4 py-3 cursor-pointer transition-all duration-200
                      ${activeModule === item.id ? 'bg-white/10 text-white font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    {activeModule === item.id && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1" 
                        style={{ backgroundColor: sectorIndicator, boxShadow: `0 0 10px ${sectorShadow}` }}
                      ></div>
                    )}

                    <div className="flex items-center flex-1 gap-3">
                       <item.icon size={20} className={activeModule === item.id ? sectorIconColor : 'text-gray-400'} />
                       <span className="text-sm tracking-wide">{item.label}</span>
                    </div>
                    
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="text-gray-400">
                        {expandedModules.has(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    )}
                  </div>

                  {item.subItems && item.subItems.length > 0 && expandedModules.has(item.id) && (
                    <div className="relative ml-4 pl-4 border-l border-white/10 space-y-1 py-1 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems.map((sub) => {
                        const isSubActive = activeSubItem === sub.id && activeModule === item.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubItemClick(item.id, sub.id);
                            }}
                            className={`
                              group flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                              ${isSubActive ? 'text-white bg-white/10 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSubActive ? sectorIconColor.replace('text-', 'bg-') : 'bg-gray-600 group-hover:bg-emerald-400'}`}></div>
                            <span>{sub.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10" style={{ backgroundColor: sectorColor }}>
            <div className="text-center text-[10px] uppercase tracking-widest opacity-40" style={{ color: activeSector === SectorId.FINANCEIRO ? '#93c5fd' : activeSector === SectorId.RH ? '#f472b6' : activeSector === SectorId.PRODUCAO ? '#fbbf24' : '#6ee7b7' }}>
              VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : activeSector === SectorId.RH ? 'RH' : activeSector === SectorId.PRODUCAO ? 'Produção' : 'Vendas'} v1.0
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
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md text-gray-600"
              >
                <Menu size={20} />
              </button>
              
              {/* Context Breadcrumb */}
              <div className="hidden md:flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900">VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : activeSector === SectorId.RH ? 'RH' : activeSector === SectorId.PRODUCAO ? 'Produção' : activeSector === SectorId.VENDAS ? 'Vendas' : 'Compras'}</span>
                <ChevronRight size={14} className="mx-2" />
                <span className="cursor-pointer hover:text-gray-700">
                  {currentMenuItems.find(i => i.id === activeModule)?.label}
                </span>
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

              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                      <span className="text-xs text-gray-500">{notifications.length} pendentes</span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Nenhuma notificação</p>
                        </div>
                      ) : (
                        <>
                          {notifications.slice(0, 10).map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${notification.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                  <Calendar size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{notification.description}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {notification.title} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(notification.value)}
                                  </p>
                                  <p className={`text-xs mt-1 font-medium ${notification.daysUntil < 0 ? 'text-red-600' : notification.daysUntil === 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                    {notification.daysUntil < 0 
                                      ? `Venceu há ${Math.abs(notification.daysUntil)} dias`
                                      : notification.daysUntil === 0
                                        ? 'Vence hoje'
                                        : `Vence em ${notification.daysUntil} dias`
                                    }
                                  </p>
                                </div>
                                <ArrowRight size={14} className="text-gray-300 mt-1" />
                              </div>
                            </div>
                          ))}
                          {notifications.length > 10 && (
                            <button 
                              onClick={() => {
                                setActiveModule(ModuleId.CONTAS_PAGAR);
                                setNotificationsOpen(false);
                              }}
                              className="w-full py-3 text-sm text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                              Ver todos os títulos ({notifications.length})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <button className="flex items-center gap-3 hover:bg-gray-50 py-1 px-2 rounded-full transition-colors">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
                <div className="w-9 h-9 bg-[#047857] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {userProfile.avatar || userProfile.name.substring(0, 2).toUpperCase()}
                </div>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className={`flex-1 overflow-y-auto relative ${activeSector === SectorId.FINANCEIRO ? 'bg-blue-50/30' : activeSector === SectorId.RH ? 'bg-pink-50/30' : activeSector === SectorId.PRODUCAO ? 'bg-orange-50/30' : activeSector === SectorId.VENDAS ? 'bg-emerald-50/30' : 'bg-indigo-50/30'}`}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <div className={`bg-white p-6 rounded-2xl shadow-xl border flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 ${activeSector === SectorId.FINANCEIRO ? 'border-blue-100' : activeSector === SectorId.RH ? 'border-pink-100' : activeSector === SectorId.PRODUCAO ? 'border-orange-100' : 'border-emerald-100'}`}>
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin ${activeSector === SectorId.FINANCEIRO ? 'border-blue-100 border-t-blue-600' : activeSector === SectorId.RH ? 'border-pink-100 border-t-pink-600' : activeSector === SectorId.PRODUCAO ? 'border-orange-100 border-t-orange-600' : 'border-emerald-100 border-t-emerald-600'}`}></div>
                  <p className={`font-medium text-sm ${activeSector === SectorId.FINANCEIRO ? 'text-blue-900' : activeSector === SectorId.RH ? 'text-pink-900' : activeSector === SectorId.PRODUCAO ? 'text-orange-900' : 'text-emerald-900'}`}>Sincronizando com a nuvem...</p>
                </div>
              </div>
            )}
            {renderContent()}
          </main>
          
          <TransactionModal />
        </div>
      </div>
  );
};

export default App;