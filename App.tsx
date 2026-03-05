import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Menu, Bell, Search, UserCircle, ChevronDown, ChevronRight, Dot, Store, X, Calendar, ArrowRight, Users, Clock, UserPlus } from 'lucide-react';
import { MENU_ITEMS, RH_MENU_ITEMS } from './constants';
import { MenuItem, ModuleId, SectorId } from './types';
import { FinancialDashboard } from './components/FinancialDashboard';
import { AccountsPayable } from './components/AccountsPayable';
import { AccountsReceivable } from './components/AccountsReceivable';
import { CashFlow } from './components/CashFlow';
import { Transactions } from './components/Transactions';
import { Treasury } from './components/Treasury';
import { Controllership } from './components/Controllership';
import { TaxManagement } from './components/TaxManagement';
import { FinancialReports } from './components/FinancialReports';
import { Settings } from './components/Settings';
import { OperationalHistory } from './components/OperationalHistory';
import { ChartOfAccounts } from './components/ChartOfAccounts';
import { Accounting } from './components/Accounting';
import { TransactionModal } from './components/TransactionModal';
import { useTransactions } from './src/context/TransactionContext';
import { DollarSign, LayoutDashboard, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const { userProfile, companyProfile, isLoading, refreshData, transactions, notificationSettings } = useTransactions();
  const [activeSector, setActiveSector] = useState<SectorId>(SectorId.FINANCEIRO);
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.DASHBOARD);
  // activeSubItem is kept for potential future use or deep linking, though mostly flattened now
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set()); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
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

        // Show if within alert range OR overdue (up to 30 days)
        if (diffDays <= notificationSettings.alertDaysBefore && diffDays >= -30) {
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
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
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
      if (!expandedModules.has(item.id)) {
        const newExpanded = new Set(expandedModules);
        newExpanded.add(item.id);
        setExpandedModules(newExpanded);
      }
      setActiveModule(item.id);
      setActiveSubItem(item.subItems[0].id);
    } else {
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
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 p-8 rounded-full mb-6">
              <Users size={64} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestão de Funcionários</h2>
            <p className="text-gray-500 max-w-md">Cadastro e gestão de colaboradores da empresa.</p>
          </div>
        );
      case ModuleId.RH_FOLHA:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 p-8 rounded-full mb-6">
              <Briefcase size={64} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Folha de Pagamento</h2>
            <p className="text-gray-500 max-w-md">Processamento de salários, encargos e benefícios.</p>
          </div>
        );
      case ModuleId.RH_PONTO:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="bg-pink-100 p-8 rounded-full mb-6">
              <Clock size={64} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ponto Eletrônico</h2>
            <p className="text-gray-500 max-w-md">Controle de jornada e banco de horas.</p>
          </div>
        );
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
                  O módulo de <strong>{currentMenuItems.find(m => m.id === activeModule)?.label}</strong> está sendo preparado para o sistema VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : 'RH'}.
              </p>
          </div>
        );
    }
  };

  const currentMenuItems = activeSector === SectorId.FINANCEIRO ? MENU_ITEMS : RH_MENU_ITEMS;
  const sectorColor = activeSector === SectorId.FINANCEIRO ? '#022c22' : '#500724'; // Dark Green vs Dark Pink (Pink-950)
  const sectorAccent = activeSector === SectorId.FINANCEIRO ? '#047857' : '#831843'; // Emerald vs Pink-900
  const sectorBorder = activeSector === SectorId.FINANCEIRO ? '#064e3b' : '#700b34';
  const sectorIconColor = activeSector === SectorId.FINANCEIRO ? 'text-emerald-400' : 'text-pink-400';
  const sectorShadow = activeSector === SectorId.FINANCEIRO ? 'rgba(52,211,153,0.5)' : 'rgba(244,114,182,0.5)';

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
              ${activeSector === SectorId.FINANCEIRO ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
            `}
            title="Setor Financeiro"
          >
            <DollarSign size={20} />
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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br ${activeSector === SectorId.FINANCEIRO ? 'from-emerald-400 to-teal-600' : 'from-pink-400 to-rose-600'}`}>
                {activeSector === SectorId.FINANCEIRO ? <Store size={18} className="text-white" /> : <Users size={18} className="text-white" />}
              </div>
              <span className="font-bold tracking-tight">VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : 'RH'}</span>
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
                        style={{ backgroundColor: activeSector === SectorId.FINANCEIRO ? '#34d399' : '#f472b6', boxShadow: `0 0 10px ${sectorShadow}` }}
                      ></div>
                    )}

                    <div className="flex items-center flex-1 gap-3">
                       <item.icon size={20} className={activeModule === item.id ? (activeSector === SectorId.FINANCEIRO ? 'text-emerald-400' : 'text-pink-400') : 'text-gray-400'} />
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
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSubActive ? (activeSector === SectorId.FINANCEIRO ? 'bg-emerald-400' : 'bg-pink-400') : 'bg-gray-600 group-hover:bg-emerald-400'}`}></div>
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
            <div className="text-center text-[10px] uppercase tracking-widest opacity-40" style={{ color: activeSector === SectorId.FINANCEIRO ? '#6ee7b7' : '#f472b6' }}>
              VMS {activeSector === SectorId.FINANCEIRO ? 'Financeiro' : 'RH'} v1.0
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
                <span className="font-medium text-gray-900">VMS Financeiro</span>
                <ChevronRight size={14} className="mx-2" />
                <span className="cursor-pointer hover:text-gray-700">
                  {MENU_ITEMS.find(i => i.id === activeModule)?.label}
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
                        notifications.map((notification) => (
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
                        ))
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
          <main className={`flex-1 overflow-y-auto relative ${activeSector === SectorId.FINANCEIRO ? 'bg-[#f0fdf4]' : 'bg-[#fdf2f8]'}`}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <div className={`bg-white p-6 rounded-2xl shadow-xl border flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 ${activeSector === SectorId.FINANCEIRO ? 'border-emerald-100' : 'border-pink-100'}`}>
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin ${activeSector === SectorId.FINANCEIRO ? 'border-emerald-100 border-t-emerald-600' : 'border-pink-100 border-t-pink-600'}`}></div>
                  <p className={`font-medium text-sm ${activeSector === SectorId.FINANCEIRO ? 'text-emerald-900' : 'text-pink-900'}`}>Sincronizando com a nuvem...</p>
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