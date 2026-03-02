import React, { useState } from 'react';
import { Menu, Bell, Search, UserCircle, MessageSquare, ChevronDown, ChevronRight, Dot, Store } from 'lucide-react';
import { MENU_ITEMS } from './constants';
import { MenuItem, ModuleId } from './types';
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
import { AIChatWidget } from './components/AIChatWidget';
import { OperationalHistory } from './components/OperationalHistory';
import { ChartOfAccounts } from './components/ChartOfAccounts';
import { Accounting } from './components/Accounting';
import { TransactionModal } from './components/TransactionModal';

interface SidebarItemProps {
  item: MenuItem;
  depth?: number;
  activeModule: ModuleId;
  expandedModules: Set<string>;
  activeSubItem: string | null;
  onMainItemClick: (item: MenuItem) => void;
  onSubItemClick: (moduleId: ModuleId, subItemId: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  depth = 0, 
  activeModule, 
  expandedModules, 
  activeSubItem, 
  onMainItemClick, 
  onSubItemClick 
}) => {
  const isExpanded = expandedModules.has(item.id);
  const isActiveModule = activeModule === item.id;
  const hasChildren = item.subItems && item.subItems.length > 0;
  const Icon = item.icon;

  return (
    <div className="mb-1 select-none">
      <div
        onClick={() => onMainItemClick(item)}
        className={`
          relative flex items-center px-4 py-3 cursor-pointer transition-all duration-200
          ${isActiveModule ? 'bg-white/10 text-white font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
        `}
      >
        {isActiveModule && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
        )}

        <div className="flex items-center flex-1 gap-3">
           <Icon size={20} className={isActiveModule ? 'text-emerald-400' : 'text-gray-400'} />
           <span className="text-sm tracking-wide">{item.label}</span>
        </div>
        
        {hasChildren && (
          <div className="text-gray-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="relative ml-4 pl-4 border-l border-white/10 space-y-1 py-1 animate-in slide-in-from-top-2 duration-200">
          {item.subItems?.map((sub) => {
            const isSubActive = activeSubItem === sub.id && isActiveModule;
            return (
              <div
                key={sub.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSubItemClick(item.id, sub.id);
                }}
                className={`
                  group flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                  ${isSubActive ? 'text-white bg-white/10 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSubActive ? 'bg-emerald-400' : 'bg-gray-600 group-hover:bg-emerald-400'}`}></div>
                <span>{sub.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import { useTransactions } from './src/context/TransactionContext';

const App: React.FC = () => {
  const { userProfile, companyProfile } = useTransactions();
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.DASHBOARD);
  // activeSubItem is kept for potential future use or deep linking, though mostly flattened now
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set()); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
                      const Icon = MENU_ITEMS.find(m => m.id === activeModule)?.icon || Dot;
                      return <Icon size={64} className="text-gray-400" />;
                  })()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo em Desenvolvimento</h2>
              <p className="text-gray-500 max-w-md">
                  O módulo de <strong>{MENU_ITEMS.find(m => m.id === activeModule)?.label}</strong> está sendo preparado para o sistema VMS Financeiro.
              </p>
          </div>
        );
    }
  };

  return (
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        
        {/* Sidebar - Green Theme */}
        <aside 
          className={`
            flex flex-col bg-[#022c22] text-white transition-all duration-300 z-20 shadow-2xl
            ${isSidebarOpen ? 'w-72' : 'w-0 -ml-72'} 
            lg:w-72 lg:ml-0
            border-r border-[#064e3b]
          `}
        >
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 bg-[#047857] border-b border-white/10 shadow-md">
            <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Store size={18} className="text-white" />
              </div>
              <span className="font-bold tracking-tight">VMS Financeiro</span>
            </div>
          </div>

          {/* User Info Compact */}
          <div className="px-6 py-6 border-b border-white/10 bg-[#064e3b]">
            <p className="text-xs text-emerald-200 uppercase tracking-wider mb-1">Organização</p>
            <p className="font-semibold text-sm truncate text-white">{companyProfile.name}</p>
          </div>

          {/* Navigation Scroll Area */}
          <div className="flex-1 overflow-y-auto sidebar-scroll py-4">
            <div className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  activeModule={activeModule}
                  expandedModules={expandedModules}
                  activeSubItem={activeSubItem}
                  onMainItemClick={handleMainItemClick}
                  onSubItemClick={handleSubItemClick}
                />
              ))}
            </div>
          </div>

          {/* Footer / Talk to AI */}
          <div className="p-4 border-t border-white/10 bg-[#022c22]">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg border border-white/10 transition-all group"
            >
              <MessageSquare size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Assistente Financeiro</span>
            </button>
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

              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
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
          <main className="flex-1 overflow-y-auto bg-[#f0fdf4] relative">
            {renderContent()}
          </main>
          
          <TransactionModal />
          
          {/* Floating Chat Widget */}
          <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </div>
  );
};

export default App;