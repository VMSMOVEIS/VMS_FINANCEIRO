import React, { useState, useMemo } from 'react';
import { FileText, Book, Scale, Calculator, Calendar, Edit2, Trash2, PieChart, TrendingUp, FileBarChart, List, AlignLeft, ListTree, AlertTriangle } from 'lucide-react';
import { useTransactions } from '@/src/context/TransactionContext';
import { useSales } from '@/src/context/SalesContext';
import { usePurchasing } from '@/src/context/PurchasingContext';
import { ChartOfAccounts } from './ChartOfAccounts';

interface AccountingProps {
  initialView?: string;
}

export const Accounting: React.FC<AccountingProps> = ({ initialView = 'contab_dre' }) => {
  const [activeTab, setActiveTab] = useState(initialView);
  const [reportLevel, setReportLevel] = useState<'grupo' | 'subgrupo' | 'sintetica' | 'analitica'>('analitica');
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const { transactions, accounts, accountPlans } = useTransactions();
  const { sales } = useSales();
  const { purchases } = usePurchasing();

  // Sync activeTab when initialView changes (e.g. from sidebar navigation)
  React.useEffect(() => {
    if (initialView) {
      setActiveTab(initialView);
    }
  }, [initialView]);

  const entries = useMemo(() => generateAccountingEntries(transactions, accountPlans, sales, purchases), [transactions, accountPlans, sales, purchases]);

  const renderContent = () => {
    const commonProps = { transactions, accountPlans, entries, reportLevel, showZeroBalances };
    
    switch (activeTab) {
      case 'contab_dre':
        return <DREView {...commonProps} />;
      case 'contab_balanco':
        return <BalanceSheetView {...commonProps} accounts={accounts} />;
      case 'contab_balancete':
        return <TrialBalanceView {...commonProps} />;
      case 'contab_plano':
        return <ChartOfAccounts />;
      case 'contab_diario':
        return <JournalView transactions={transactions} entries={entries} />;
      case 'contab_razao':
        return <LedgerView entries={entries} />;
      case 'contab_dfc':
        return <DFCView {...commonProps} accounts={accounts} />;
      case 'contab_dmpl':
        return <DMPLView {...commonProps} />;
      case 'contab_dva':
        return <DVAView {...commonProps} />;
      case 'contab_notas':
        return <NotesView />;
      case 'contab_dlpa':
        return <DLPAView {...commonProps} />;
      case 'contab_dra':
        return <DRAView {...commonProps} />;
      default:
        return <DREView {...commonProps} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidade</h1>
          <p className="text-gray-500">Gestão contábil, livros e demonstrações financeiras</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          <TabButton id="contab_dre" label="DRE" icon={FileText} active={activeTab === 'contab_dre'} onClick={setActiveTab} />
          <TabButton id="contab_balanco" label="Balanço Patrimonial" icon={Scale} active={activeTab === 'contab_balanco'} onClick={setActiveTab} />
          <TabButton id="contab_balancete" label="Balancete" icon={Calculator} active={activeTab === 'contab_balancete'} onClick={setActiveTab} />
          <TabButton id="contab_plano" label="Plano de Contas" icon={ListTree} active={activeTab === 'contab_plano'} onClick={setActiveTab} />
          <TabButton id="contab_diario" label="Livro Diário" icon={Calendar} active={activeTab === 'contab_diario'} onClick={setActiveTab} />
          <TabButton id="contab_razao" label="Livro Razão" icon={Book} active={activeTab === 'contab_razao'} onClick={setActiveTab} />
          <TabButton id="contab_dfc" label="DFC" icon={TrendingUp} active={activeTab === 'contab_dfc'} onClick={setActiveTab} />
          <TabButton id="contab_dmpl" label="DMPL" icon={FileBarChart} active={activeTab === 'contab_dmpl'} onClick={setActiveTab} />
          <TabButton id="contab_dva" label="DVA" icon={PieChart} active={activeTab === 'contab_dva'} onClick={setActiveTab} />
          <TabButton id="contab_dlpa" label="DLPA" icon={List} active={activeTab === 'contab_dlpa'} onClick={setActiveTab} />
          <TabButton id="contab_dra" label="DRA" icon={AlignLeft} active={activeTab === 'contab_dra'} onClick={setActiveTab} />
          <TabButton id="contab_notas" label="Notas Explicativas" icon={FileText} active={activeTab === 'contab_notas'} onClick={setActiveTab} />
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Nível de Detalhe:</label>
          <select 
            value={reportLevel}
            onChange={(e) => setReportLevel(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="grupo">Grupo (1)</option>
            <option value="subgrupo">Subgrupo (1.1)</option>
            <option value="sintetica">Sintética (1.1.01)</option>
            <option value="analitica">Analítica (1.1.01.01)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showZeroBalances}
              onChange={(e) => setShowZeroBalances(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Mostrar contas com saldo zero</span>
          </label>
        </div>

        <div className="flex-1"></div>

        <div className="flex gap-2">
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>Exercício 2026</option>
            <option>Exercício 2025</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

const TabButton = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    `}
  >
    <Icon size={16} className={active ? 'text-blue-600' : 'text-gray-400'} />
    {label}
  </button>
);

// Helper to generate accounting entries from transactions using the Chart of Accounts
const generateAccountingEntries = (transactions: any[], accountPlans: any[], sales: any[] = [], purchases: any[] = []) => {
  const entries: any[] = [];
  let entryId = 1;

  const findPlan = (name: string) => accountPlans.find(p => p.name === name || p.id === name);
  const getLabel = (name: string) => {
    const p = findPlan(name);
    return p ? `${p.code} - ${p.name}` : name;
  };

  // Default accounts if not found
  const planReceivables = findPlan('Clientes') || findPlan('Contas a Receber') || { code: '1.1.02.01', name: 'Clientes' };
  const planPayables = findPlan('Fornecedores') || { code: '2.1.01', name: 'Fornecedores' };
  const planCash = findPlan('Caixa') || findPlan('Banco Conta Corrente') || findPlan('Caixa e Equivalentes de Caixa') || { code: '1.1.01.01', name: 'Caixa' };

  // Process Sales Orders (Accrual Basis)
  sales.forEach(s => {
    if (s.status === 'completed' && s.effectiveDate) {
      const revenuePlan = findPlan(s.accountPlanId) || findPlan('Venda de Mercadorias') || { code: '4.1.01.01', name: 'Venda de Mercadorias' };
      const revenueLabel = `${revenuePlan.code} - ${revenuePlan.name}`;
      
      // If paid, debit Cash/Bank, otherwise debit Accounts Receivable
      const isPaid = s.paymentStatus === 'paid';
      const debitPlan = isPaid ? (findPlan(s.paymentMethod) || planCash) : planReceivables;
      const debitLabel = `${debitPlan.code} - ${debitPlan.name}`;

      entries.push({
        id: entryId++,
        transactionId: s.id,
        date: s.effectiveDate,
        description: `Venda Concluída - ${s.id} - ${s.customer}`,
        debit: debitLabel,
        credit: revenueLabel,
        value: s.value
      });

      // Add COGS entry if estimatedCost is present
      if (s.estimatedCost && s.estimatedCost > 0) {
        const cogsPlan = findPlan('Custo das Mercadorias Vendidas') || findPlan('CUSTOS DE PRODUÇÃO') || { code: '5.1.01', name: 'CMV' };
        const inventoryPlan = findPlan('Produtos Acabados') || findPlan('Estoques') || { code: '1.1.03.10', name: 'Estoques' };
        
        entries.push({
          id: entryId++,
          transactionId: s.id,
          date: s.effectiveDate,
          description: `Baixa de Estoque (CMV) - ${s.id}`,
          debit: `${cogsPlan.code} - ${cogsPlan.name}`,
          credit: `${inventoryPlan.code} - ${inventoryPlan.name}`,
          value: s.estimatedCost
        });
      }
    }
  });

  // Process Purchase Orders (Accrual Basis)
  purchases.forEach(p => {
    if (p.status === 'completed' && p.effectiveDate) {
      const expensePlan = findPlan(p.accountPlanId) || findPlan('Compras de Mercadorias') || { code: '5.1.01.01', name: 'Compras de Mercadorias' };
      const expenseLabel = `${expensePlan.code} - ${expensePlan.name}`;
      
      // If paid, credit Cash/Bank, otherwise credit Accounts Payable
      const isPaid = p.paymentStatus === 'paid';
      const creditPlan = isPaid ? (findPlan(p.paymentMethod) || planCash) : planPayables;
      const creditLabel = `${creditPlan.code} - ${creditPlan.name}`;

      entries.push({
        id: entryId++,
        transactionId: p.id,
        date: p.effectiveDate,
        description: `Compra Concluída - ${p.id} - ${p.supplier}`,
        debit: expenseLabel,
        credit: creditLabel,
        value: p.value
      });
    }
  });

  transactions.forEach(t => {
    // Handle Transfers
    if (t.type === 'transfer') {
      t.payments.forEach((p: any) => {
        if (p.status === 'completed') {
          const sourcePlan = findPlan(p.source) || planCash;
          const destPlan = findPlan(p.destination) || planCash;
          
          entries.push({
            id: entryId++,
            transactionId: t.id,
            date: p.dueDate || t.date,
            description: `Transferência - ${t.description}`,
            debit: `${destPlan.code} - ${destPlan.name}`,
            credit: `${sourcePlan.code} - ${sourcePlan.name}`,
            value: p.value
          });
        }
      });
      return;
    }

    // 1. Initial Recognition (Accrual Basis) for manual transactions
    // Only if not linked to a sale/purchase (which are handled above)
    if (!t.linkedTransactionId && t.status === 'completed') {
      const categoryPlan = findPlan(t.accountPlanId) || findPlan(t.categoryCode) || findPlan(t.category);
      const categoryLabel = categoryPlan ? `${categoryPlan.code} - ${categoryPlan.name}` : t.category;
      
      if (t.transactionTypeId === 'adiantamento_cliente') {
        const advanceLiabilityPlan = findPlan('Adiantamento de Clientes') || { code: '2.1.05', name: 'Adiantamento de Clientes' };
        entries.push({
          id: entryId++,
          transactionId: t.id,
          date: t.date,
          description: `Recebimento de Adiantamento - ${t.description}`,
          debit: `${planCash.code} - ${planCash.name}`,
          credit: `${advanceLiabilityPlan.code} - ${advanceLiabilityPlan.name}`,
          value: t.value
        });
      } else if (t.transactionTypeId === 'adiantamento_fornecedor') {
        const advanceAssetPlan = findPlan('Adiantamento a Fornecedores') || { code: '1.1.04.02', name: 'Adiantamento a Fornecedores' };
        entries.push({
          id: entryId++,
          transactionId: t.id,
          date: t.date,
          description: `Pagamento de Adiantamento - ${t.description}`,
          debit: `${advanceAssetPlan.code} - ${advanceAssetPlan.name}`,
          credit: `${planCash.code} - ${planCash.name}`,
          value: t.value
        });
      } else if (t.type === 'income') {
        // If it's a direct income (not from a sale order), recognize revenue
        entries.push({
          id: entryId++,
          transactionId: t.id,
          date: t.date,
          description: `Receita Direta - ${t.description}`,
          debit: `${planCash.code} - ${planCash.name}`,
          credit: categoryLabel,
          value: t.value
        });
      } else if (t.type === 'expense') {
        // If it's a direct expense (not from a purchase order), recognize expense
        entries.push({
          id: entryId++,
          transactionId: t.id,
          date: t.date,
          description: `Despesa Direta - ${t.description}`,
          debit: categoryLabel,
          credit: `${planCash.code} - ${planCash.name}`,
          value: t.value
        });
      }
    }

    // 2. Payments/Receipts (Cash Basis) for linked transactions (Settling AR/AP)
    // This part is tricky because we need to know if it's settling a previous accrual
    // For now, let's assume if it has payments, it's a cash movement.
    // If it's NOT a direct income/expense (handled above), it might be settling AR/AP.
    // But wait, the current system doesn't clearly link Transactions to Sales Orders in a way that we can easily tell.
    // So I'll stick to the logic that if it's a Transaction with payments, it's a cash movement.

    // 2. Payments/Receipts (Cash Basis)
    t.payments.forEach((p: any) => {
      if (p.status === 'completed') {
        const isSettledByOther = transactions.some(other => 
          other.linkedTransactionId === t.id && other.linkedPaymentId === p.id
        );
        
        if (isSettledByOther) return;

        const bankPlan = findPlan(p.destination || p.source) || planCash;
        const bankLabel = `${bankPlan.code} - ${bankPlan.name}`;

        if (t.type === 'income') {
          entries.push({
            id: entryId++,
            transactionId: t.id,
            date: p.dueDate || t.date,
            description: `Recebimento - ${t.description}`,
            debit: bankLabel,
            credit: `${planReceivables.code} - ${planReceivables.name}`,
            value: p.value
          });
        } else if (t.type === 'expense') {
          entries.push({
            id: entryId++,
            transactionId: t.id,
            date: p.dueDate || t.date,
            description: `Pagamento - ${t.description}`,
            debit: `${planPayables.code} - ${planPayables.name}`,
            credit: bankLabel,
            value: p.value
          });
        }
      }
    });
  });

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const DREView = ({ transactions, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const dreData = useMemo(() => {
    const balances: Record<string, number> = {};
    accountPlans.forEach(p => balances[p.code] = 0);

    entries.forEach(entry => {
      const debitCode = entry.debit.split(' - ')[0];
      const creditCode = entry.credit.split(' - ')[0];
      
      const debitPlan = accountPlans.find(p => p.code === debitCode);
      const creditPlan = accountPlans.find(p => p.code === creditCode);

      if (debitPlan?.type === 'despesa') balances[debitCode] += entry.value;
      if (creditPlan?.type === 'receita') balances[creditCode] += entry.value;
      
      if (debitPlan?.type === 'receita') balances[debitCode] -= entry.value;
      if (creditPlan?.type === 'despesa') balances[creditCode] -= entry.value;
    });

    const getGroupBalance = (prefix: string) => {
      return Object.entries(balances)
        .filter(([code]) => code.startsWith(prefix))
        .reduce((sum, [_, val]) => sum + val, 0);
    };

    const revenue = getGroupBalance('4');
    const costs = getGroupBalance('5');
    const expenses = getGroupBalance('6');
    
    const grossProfit = revenue - costs;
    const netProfit = grossProfit - expenses;

    // Filter and aggregate details based on reportLevel
    const levelMap: Record<string, number> = { 'grupo': 1, 'subgrupo': 2, 'sintetica': 3, 'analitica': 4 };
    const maxParts = levelMap[reportLevel] || 4;

    const filteredDetails = accountPlans
      .filter(p => (p.type === 'receita' || p.type === 'despesa'))
      .filter(p => p.code.split('.').length <= maxParts)
      .map(p => {
        const balance = Object.entries(balances)
          .filter(([code]) => code.startsWith(p.code))
          .reduce((sum, [_, val]) => sum + val, 0);
        return { ...p, balance };
      })
      .filter(p => showZeroBalances || Math.abs(p.balance) > 0.01)
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    
    return { 
      revenue, 
      costs,
      grossProfit,
      expenses, 
      netProfit,
      details: filteredDetails
    };
  }, [entries, accountPlans, reportLevel, showZeroBalances]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Demonstração do Resultado do Exercício</h3>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-right">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dreData.details.map((item, idx) => {
              const parts = item.code.split('.').length;
              const isGroup = parts === 1;
              const isSubgroup = parts === 2;
              const isRevenue = item.type === 'receita';
              
              return (
                <tr key={idx} className={`${isGroup ? 'bg-gray-50 font-bold' : isSubgroup ? 'font-semibold' : ''} hover:bg-gray-50/50`}>
                  <td className="px-6 py-2 font-mono text-xs text-gray-500">{item.code}</td>
                  <td className={`px-6 py-2 ${parts > 1 ? `pl-${(parts - 1) * 4}` : ''}`}>
                    {item.name}
                  </td>
                  <td className={`px-6 py-2 text-right ${!isRevenue && !isGroup && !isSubgroup ? 'text-red-600' : 'text-gray-900'}`}>
                    {(!isRevenue && !isGroup && !isSubgroup ? '(' : '')}
                    R$ {Math.abs(item.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {(!isRevenue && !isGroup && !isSubgroup ? ')' : '')}
                  </td>
                  <td className="px-6 py-2 text-right text-gray-500">
                    {dreData.revenue ? ((Math.abs(item.balance) / dreData.revenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              );
            })}
            
            <tr className="font-bold bg-blue-50 border-t-2 border-blue-100">
              <td className="px-6 py-4" colSpan={2}>(=) LUCRO/PREJUÍZO LÍQUIDO</td>
              <td className={`px-6 py-4 text-right ${dreData.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                R$ {dreData.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 text-right text-gray-500">
                {dreData.revenue ? ((dreData.netProfit / dreData.revenue) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BalanceSheetView = ({ transactions, accounts, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accounts: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const balances = useMemo(() => {
    const accountBalances: Record<string, number> = {};
    accountPlans.forEach(p => accountBalances[p.code] = 0);

    // Initial balances from accounts (Cash/Bank)
    accounts.forEach(acc => {
      const plan = accountPlans.find(p => p.name === acc.name);
      if (plan) {
        accountBalances[plan.code] = acc.balance;
      }
    });

    // Process entries
    entries.forEach(entry => {
      const debitCode = entry.debit.split(' - ')[0];
      const creditCode = entry.credit.split(' - ')[0];
      
      const debitPlan = accountPlans.find(p => p.code === debitCode);
      const creditPlan = accountPlans.find(p => p.code === creditCode);

      if (debitPlan) {
        if (debitPlan.type === 'ativo' || debitPlan.type === 'despesa') accountBalances[debitCode] += entry.value;
        else accountBalances[debitCode] -= entry.value;
      }

      if (creditPlan) {
        if (creditPlan.type === 'passivo' || creditPlan.type === 'receita') accountBalances[creditCode] += entry.value;
        else accountBalances[creditCode] -= entry.value;
      }
    });

    // Retained Earnings (Revenue - Costs - Expenses)
    const getGroupBalance = (prefix: string) => {
      return Object.entries(accountBalances)
        .filter(([code]) => code.startsWith(prefix))
        .reduce((sum, [_, val]) => sum + val, 0);
    };
    const revenue = getGroupBalance('4');
    const costs = getGroupBalance('5');
    const expenses = getGroupBalance('6');
    const retainedEarnings = revenue - costs - expenses;

    // Filter and aggregate details based on reportLevel
    const levelMap: Record<string, number> = { 'grupo': 1, 'subgrupo': 2, 'sintetica': 3, 'analitica': 4 };
    const maxParts = levelMap[reportLevel] || 4;

    const filteredDetails = accountPlans
      .filter(p => (p.type === 'ativo' || p.type === 'passivo'))
      .filter(p => p.code.split('.').length <= maxParts)
      .map(p => {
        const balance = Object.entries(accountBalances)
          .filter(([code]) => code.startsWith(p.code))
          .reduce((sum, [_, val]) => sum + val, 0);
        return { ...p, balance };
      })
      .filter(p => showZeroBalances || Math.abs(p.balance) > 0.01)
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

    return { 
      retainedEarnings,
      details: filteredDetails
    };
  }, [entries, accountPlans, accounts, reportLevel, showZeroBalances]);

  const totalAssets = balances.details.filter(p => p.type === 'ativo' && p.code.split('.').length === 1).reduce((sum, p) => sum + p.balance, 0);
  const totalLiabilities = balances.details.filter(p => p.type === 'passivo' && p.code.split('.').length === 1 && p.code !== '3').reduce((sum, p) => sum + p.balance, 0);
  const totalEquity = balances.details.filter(p => p.code === '3').reduce((sum, p) => sum + p.balance, 0) + balances.retainedEarnings;

  const hasNegativeBalances = balances.details.some(p => p.balance < -0.01);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Balanço Patrimonial</h3>
      
      {hasNegativeBalances && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
          <AlertTriangle size={20} className="text-amber-600" />
          <p className="text-sm font-medium">
            Atenção: Existem contas com saldo negativo ou invertido. Verifique os lançamentos no balancete para identificar possíveis erros de classificação ou lançamentos incorretos.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-800 font-bold border-b border-blue-100">
              <tr>
                <th className="px-4 py-3">ATIVO</th>
                <th className="px-4 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {balances.details.filter(p => p.type === 'ativo').map((p, idx) => {
                const parts = p.code.split('.').length;
                return (
                  <tr key={idx} className={`${parts === 1 ? 'bg-gray-50 font-bold' : parts === 2 ? 'font-semibold' : ''}`}>
                    <td className={`px-4 py-2 ${parts > 1 ? `pl-${(parts - 1) * 4}` : ''}`}>
                      <span className="font-mono text-xs text-gray-400 mr-2">{p.code}</span>
                      {p.name}
                    </td>
                    <td className="px-4 py-2 text-right">
                      R$ {Math.abs(p.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-blue-600 text-white font-bold">
                <td className="px-4 py-3">TOTAL DO ATIVO</td>
                <td className="px-4 py-3 text-right">R$ {Math.abs(totalAssets).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Liabilities & Equity */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-purple-50 text-purple-800 font-bold border-b border-purple-100">
              <tr>
                <th className="px-4 py-3">PASSIVO E PL</th>
                <th className="px-4 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {balances.details.filter(p => p.type === 'passivo').map((p, idx) => {
                const parts = p.code.split('.').length;
                return (
                  <tr key={idx} className={`${parts === 1 ? 'bg-gray-50 font-bold' : parts === 2 ? 'font-semibold' : ''}`}>
                    <td className={`px-4 py-2 ${parts > 1 ? `pl-${(parts - 1) * 4}` : ''}`}>
                      <span className="font-mono text-xs text-gray-400 mr-2">{p.code}</span>
                      {p.name}
                    </td>
                    <td className="px-4 py-2 text-right">
                      R$ {Math.abs(p.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-medium">
                <td className="px-4 py-2 pl-8">
                  <span className="font-mono text-xs text-gray-400 mr-2">3.2</span>
                  Lucros/Prejuízos Acumulados
                </td>
                <td className={`px-4 py-2 text-right ${balances.retainedEarnings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  R$ {balances.retainedEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-purple-600 text-white font-bold">
                <td className="px-4 py-3">TOTAL DO PASSIVO + PL</td>
                <td className="px-4 py-3 text-right">R$ {Math.abs(totalLiabilities + totalEquity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TrialBalanceView = ({ entries, accountPlans, reportLevel, showZeroBalances }: { entries: any[], accountPlans: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const trialBalance = useMemo(() => {
    const accountBalances: Record<string, { debit: number, credit: number }> = {};
    accountPlans.forEach(p => accountBalances[p.code] = { debit: 0, credit: 0 });

    entries.forEach(entry => {
      const debitCode = entry.debit.split(' - ')[0];
      const creditCode = entry.credit.split(' - ')[0];
      
      if (accountBalances[debitCode]) accountBalances[debitCode].debit += entry.value;
      if (accountBalances[creditCode]) accountBalances[creditCode].credit += entry.value;
    });

    const levelMap: Record<string, number> = { 'grupo': 1, 'subgrupo': 2, 'sintetica': 3, 'analitica': 4 };
    const maxParts = levelMap[reportLevel] || 4;

    return accountPlans
      .filter(p => p.code.split('.').length <= maxParts)
      .map(p => {
        const relevantBalances = Object.entries(accountBalances)
          .filter(([code]) => code.startsWith(p.code));
        
        const debit = relevantBalances.reduce((sum, [_, val]) => sum + val.debit, 0);
        const credit = relevantBalances.reduce((sum, [_, val]) => sum + val.credit, 0);
        
        let balance = 0;
        if (p.type === 'ativo' || p.type === 'despesa') balance = debit - credit;
        else balance = credit - debit;

        return {
          code: p.code,
          name: p.name,
          debit,
          credit,
          balance,
          type: p.type
        };
      })
      .filter(p => showZeroBalances || Math.abs(p.balance) > 0.01)
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }, [entries, accountPlans, reportLevel, showZeroBalances]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Balancete de Verificação</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Conta Contábil</th>
              <th className="px-6 py-3 text-right">Débito</th>
              <th className="px-6 py-3 text-right">Crédito</th>
              <th className="px-6 py-3 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trialBalance.map((item, idx) => {
              const parts = item.code.split('.').length;
              return (
                <tr key={idx} className={`${parts === 1 ? 'bg-gray-50 font-bold' : parts === 2 ? 'font-semibold' : ''} hover:bg-gray-50`}>
                  <td className="px-6 py-2 font-mono text-xs text-gray-500">{item.code}</td>
                  <td className={`px-6 py-2 ${parts > 1 ? `pl-${(parts - 1) * 4}` : ''}`}>{item.name}</td>
                  <td className="px-6 py-2 text-right text-blue-600">R$ {item.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-2 text-right text-red-600">R$ {item.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className={`px-6 py-2 text-right font-bold ${item.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    R$ {Math.abs(item.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {item.balance > 0 ? ' D' : item.balance < 0 ? ' C' : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JournalView = ({ transactions, entries }: { transactions: any[], entries: any[] }) => {
  const { openModal, deleteTransaction } = useTransactions();

  const handleEdit = (transactionId: number) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) openModal(transaction);
  };

  const handleDelete = (transactionId: number) => {
    if (window.confirm('Deseja realmente excluir o lançamento original desta partida?')) {
      deleteTransaction(transactionId);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Livro Diário</h3>
      <div className="space-y-4">
        {entries.length === 0 ? (
            <div className="text-center text-gray-500">Nenhum lançamento contábil registrado.</div>
        ) : (
            entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group relative">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(entry.transactionId)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar Lançamento Original"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(entry.transactionId)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Lançamento Original"
                    >
                      <Trash2 size={14} />
                    </button>
                </div>
                <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">Lançamento #{entry.id}</span>
                    <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <span className="font-bold text-gray-900 mr-16">R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-sm text-gray-800 font-medium mb-3">{entry.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>D - {entry.debit}</span>
                    <span>R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>C - {entry.credit}</span>
                    <span>R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

const LedgerView = ({ entries }: { entries: any[] }) => {
  const ledgerAccounts = useMemo(() => {
    const accs: Record<string, { type: string, entries: any[] }> = {};

    entries.forEach(entry => {
        // Process Debit
        if (!accs[entry.debit]) accs[entry.debit] = { type: 'Devedora', entries: [] };
        accs[entry.debit].entries.push({ date: entry.date, history: entry.description, debit: entry.value, credit: 0 });

        // Process Credit
        if (!accs[entry.credit]) accs[entry.credit] = { type: 'Credora', entries: [] };
        accs[entry.credit].entries.push({ date: entry.date, history: entry.description, debit: 0, credit: entry.value });
    });

    return accs;
  }, [entries]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Livro Razão</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(ledgerAccounts).length === 0 ? (
             <div className="col-span-2 text-center text-gray-500">Nenhuma conta movimentada.</div>
        ) : (
            Object.entries(ledgerAccounts).map(([accountName, data]: [string, any]) => {
                const totalDebit = data.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
                const totalCredit = data.entries.reduce((sum: number, e: any) => sum + e.credit, 0);
                const balance = totalDebit - totalCredit; 

                return (
                    <div key={accountName} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                        <h4 className="font-bold text-gray-800 text-sm">{accountName}</h4>
                        </div>
                        <table className="w-full text-xs">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-100">
                            <th className="text-left pb-2">Data</th>
                            <th className="text-left pb-2">Histórico</th>
                            <th className="text-right pb-2">Débito</th>
                            <th className="text-right pb-2">Crédito</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.entries.map((e: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-2">{new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                                    <td className="py-2 truncate max-w-[100px]" title={e.history}>{e.history}</td>
                                    <td className="py-2 text-right text-blue-600">{e.debit > 0 ? e.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
                                    <td className="py-2 text-right text-red-600">{e.credit > 0 ? e.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                            <td className="py-2" colSpan={2}>Saldo Atual</td>
                            <td className="py-2 text-right text-blue-700">{balance > 0 ? balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}</td>
                            <td className="py-2 text-right text-red-700">{balance < 0 ? Math.abs(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};

const DFCView = ({ transactions, accounts, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accounts: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const dfcData = useMemo(() => {
    const totalInitialBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    
    // Operating Activities: Cash in/out from accounts with codes starting with 3 (Revenue) or 4 (Expense)
    // Investing Activities: Cash in/out from accounts with codes starting with 1.2 (Non-current assets)
    // Financing Activities: Cash in/out from accounts with codes starting with 2.2 (Non-current liabilities) or 2.3 (Equity)

    const cashAccounts = accountPlans.filter(p => p.code.startsWith('1.1.01')).map(p => `${p.code} - ${p.name}`);

    let netOperating = 0;
    let netInvesting = 0;
    let netFinancing = 0;

    entries.forEach(entry => {
      const isDebitCash = cashAccounts.includes(entry.debit);
      const isCreditCash = cashAccounts.includes(entry.credit);

      if (isDebitCash || isCreditCash) {
        const otherSide = isDebitCash ? entry.credit : entry.debit;
        const otherCode = otherSide.split(' - ')[0];
        const value = isDebitCash ? entry.value : -entry.value;

        if (otherCode.startsWith('4') || otherCode.startsWith('5') || otherCode.startsWith('6') || otherCode.startsWith('1.1.02') || otherCode.startsWith('2.1.01')) {
          netOperating += value;
        } else if (otherCode.startsWith('1.2')) {
          netInvesting += value;
        } else if (otherCode.startsWith('2.1.04') || otherCode.startsWith('3')) {
          netFinancing += value;
        }
      }
    });

    const initialCash = totalInitialBalance;
    const finalCash = initialCash + netOperating + netInvesting + netFinancing;

    return { netOperating, netInvesting, netFinancing, initialCash, finalCash };
  }, [entries, accounts, accountPlans]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demonstração dos Fluxos de Caixa (DFC)</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3">ATIVIDADES OPERACIONAIS</td>
              <td className={`px-6 py-3 text-right ${dfcData.netOperating >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dfcData.netOperating.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3">ATIVIDADES DE INVESTIMENTO</td>
              <td className={`px-6 py-3 text-right ${dfcData.netInvesting >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dfcData.netInvesting.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3">ATIVIDADES DE FINANCIAMENTO</td>
              <td className={`px-6 py-3 text-right ${dfcData.netFinancing >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dfcData.netFinancing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-emerald-50 font-bold border-t border-emerald-100">
              <td className="px-6 py-4 text-emerald-900">VARIAÇÃO LÍQUIDA DE CAIXA</td>
              <td className="px-6 py-4 text-right text-emerald-700">
                R$ {(dfcData.netOperating + dfcData.netInvesting + dfcData.netFinancing).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 text-gray-600">Saldo Inicial de Caixa</td>
              <td className="px-6 py-3 text-right text-gray-900">R$ {dfcData.initialCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="font-bold">
              <td className="px-6 py-3 text-gray-900">Saldo Final de Caixa</td>
              <td className="px-6 py-3 text-right text-gray-900">R$ {dfcData.finalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DMPLView = ({ transactions, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const dmplData = useMemo(() => {
    const getGroupBalance = (prefix: string) => {
      const balances: Record<string, number> = {};
      accountPlans.forEach(p => balances[p.code] = 0);

      entries.forEach(entry => {
        const debitCode = entry.debit.split(' - ')[0];
        const creditCode = entry.credit.split(' - ')[0];
        
        const debitPlan = accountPlans.find(p => p.code === debitCode);
        const creditPlan = accountPlans.find(p => p.code === creditCode);

        if (debitPlan?.code.startsWith(prefix)) {
          if (debitPlan.type === 'ativo' || debitPlan.type === 'despesa') balances[debitCode] += entry.value;
          else balances[debitCode] -= entry.value;
        }
        if (creditPlan?.code.startsWith(prefix)) {
          if (creditPlan.type === 'passivo' || creditPlan.type === 'receita') balances[creditCode] += entry.value;
          else balances[creditCode] -= entry.value;
        }
      });

      return Object.entries(balances)
        .filter(([code]) => code.startsWith(prefix))
        .reduce((sum, [_, val]) => sum + val, 0);
    };

    const capital = getGroupBalance('3.1');
    const reserves = getGroupBalance('3.4');
    
    const revenue = accountPlans
      .filter(p => p.type === 'receita')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.credit.startsWith(p.code)) return s + e.value;
          if (e.debit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const expenses = accountPlans
      .filter(p => p.type === 'despesa')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.debit.startsWith(p.code)) return s + e.value;
          if (e.credit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const profit = revenue - expenses;

    return { capital, reserves, profit };
  }, [entries, accountPlans]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demonstração das Mutações do Patrimônio Líquido (DMPL)</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Capital Social</th>
              <th className="px-6 py-3 text-right">Reservas de Lucro</th>
              <th className="px-6 py-3 text-right">Lucros Acumulados</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-3 font-medium">Saldo Inicial</td>
              <td className="px-6 py-3 text-right">R$ {dmplData.capital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right">R$ {dmplData.reserves.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right">R$ 0,00</td>
              <td className="px-6 py-3 text-right font-bold">R$ {(dmplData.capital + dmplData.reserves).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="px-6 py-3">Lucro Líquido do Exercício</td>
              <td className="px-6 py-3 text-right">-</td>
              <td className="px-6 py-3 text-right">-</td>
              <td className={`px-6 py-3 text-right ${dmplData.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dmplData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className={`px-6 py-3 text-right font-bold ${dmplData.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dmplData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold border-t border-gray-200">
              <td className="px-6 py-4">Saldo Final</td>
              <td className="px-6 py-4 text-right">R$ {dmplData.capital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-right">R$ {dmplData.reserves.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-right">R$ {dmplData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-right text-emerald-700">
                R$ {(dmplData.capital + dmplData.reserves + dmplData.profit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DVAView = ({ transactions, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const dvaData = useMemo(() => {
    const getBalance = (type: string) => {
      return entries.reduce((sum, entry) => {
        const debitPlan = accountPlans.find(p => p.code === entry.debit.split(' - ')[0]);
        const creditPlan = accountPlans.find(p => p.code === entry.credit.split(' - ')[0]);
        
        if (type === 'receita') {
          if (creditPlan?.type === 'receita') return sum + entry.value;
          if (debitPlan?.type === 'receita') return sum - entry.value;
        } else if (type === 'despesa') {
          if (debitPlan?.type === 'despesa') return sum + entry.value;
          if (creditPlan?.type === 'despesa') return sum - entry.value;
        }
        return sum;
      }, 0);
    };

    const revenue = getBalance('receita');
    const expenses = getBalance('despesa');
    
    // Simplified DVA mapping
    const inputs = expenses * 0.6;
    const grossAddedValue = revenue - inputs;
    const retention = 0;
    const netAddedValue = grossAddedValue - retention;
    const personnel = expenses * 0.2;
    const taxes = expenses * 0.1;
    const equity = netAddedValue - personnel - taxes;

    return { revenue, inputs, grossAddedValue, retention, netAddedValue, personnel, taxes, equity };
  }, [entries, accountPlans]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demonstração do Valor Adicionado (DVA)</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-right">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="font-medium">
              <td className="px-6 py-3">1. RECEITAS</td>
              <td className="px-6 py-3 text-right">R$ {dvaData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right">-</td>
            </tr>
            <tr>
              <td className="px-6 py-3 pl-10 text-gray-600">2. Insumos Adquiridos de Terceiros</td>
              <td className="px-6 py-3 text-right text-red-600">(R$ {dvaData.inputs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
              <td className="px-6 py-3 text-right">-</td>
            </tr>
            <tr className="font-medium bg-gray-50">
              <td className="px-6 py-3">3. VALOR ADICIONADO BRUTO (1-2)</td>
              <td className="px-6 py-3 text-right">R$ {dvaData.grossAddedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right">-</td>
            </tr>
            <tr>
              <td className="px-6 py-3 pl-10 text-gray-600">4. Retenções (Depreciação)</td>
              <td className="px-6 py-3 text-right text-red-600">(R$ {dvaData.retention.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
              <td className="px-6 py-3 text-right">-</td>
            </tr>
            <tr className="font-bold bg-emerald-50 text-emerald-900">
              <td className="px-6 py-3">5. VALOR ADICIONADO LÍQUIDO (3-4)</td>
              <td className="px-6 py-3 text-right">R$ {dvaData.netAddedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right">100%</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium" colSpan={3}>6. DISTRIBUIÇÃO DO VALOR ADICIONADO</td>
            </tr>
            <tr>
              <td className="px-6 py-2 pl-10 text-gray-600">6.1. Pessoal</td>
              <td className="px-6 py-2 text-right">R$ {dvaData.personnel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-2 text-right">{((dvaData.personnel / dvaData.netAddedValue) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="px-6 py-2 pl-10 text-gray-600">6.2. Impostos, Taxas e Contribuições</td>
              <td className="px-6 py-2 text-right">R$ {dvaData.taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-2 text-right">{((dvaData.taxes / dvaData.netAddedValue) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="px-6 py-2 pl-10 text-gray-600">6.3. Remuneração de Capitais Próprios (Lucros)</td>
              <td className="px-6 py-2 text-right">R$ {dvaData.equity.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-2 text-right">{((dvaData.equity / dvaData.netAddedValue) * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NotesView = () => (
  <div className="p-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Notas Explicativas</h3>
    <div className="space-y-6 text-gray-700">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-2">Nota 1 - Contexto Operacional</h4>
        <p className="text-sm leading-relaxed">
          A empresa Móveis & Design Ltda. tem como objetivo principal a comercialização de móveis e artigos de decoração. 
          As demonstrações contábeis foram elaboradas de acordo com as práticas contábeis adotadas no Brasil.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-2">Nota 2 - Principais Práticas Contábeis</h4>
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li><strong>Caixa e Equivalentes de Caixa:</strong> Incluem dinheiro em caixa, depósitos bancários e aplicações financeiras de curto prazo.</li>
          <li><strong>Contas a Receber:</strong> Registradas pelo valor nominal dos títulos representativos desses créditos.</li>
          <li><strong>Estoques:</strong> Avaliados pelo custo médio de aquisição, inferior aos valores de reposição ou de realização.</li>
          <li><strong>Imobilizado:</strong> Demonstrado ao custo de aquisição, deduzido da depreciação acumulada.</li>
        </ul>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-2">Nota 3 - Eventos Subsequentes</h4>
        <p className="text-sm leading-relaxed">
          Não ocorreram eventos subsequentes ao encerramento do exercício que pudessem alterar de forma relevante a situação patrimonial e financeira da Sociedade.
        </p>
      </div>
    </div>
  </div>
);

const DLPAView = ({ transactions, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const dlpaData = useMemo(() => {
    const previousBalance = 0;
    
    const revenue = accountPlans
      .filter(p => p.type === 'receita')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.credit.startsWith(p.code)) return s + e.value;
          if (e.debit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const expenses = accountPlans
      .filter(p => p.type === 'despesa')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.debit.startsWith(p.code)) return s + e.value;
          if (e.credit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const profit = revenue - expenses;
    const dividends = 0; 
    const finalBalance = previousBalance + profit - dividends;
    return { previousBalance, profit, dividends, finalBalance };
  }, [entries, accountPlans]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demonstração dos Lucros ou Prejuízos Acumulados (DLPA)</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-3">Saldo Inicial</td>
              <td className="px-6 py-3 text-right">R$ {dlpaData.previousBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="px-6 py-3">Ajustes de Exercícios Anteriores</td>
              <td className="px-6 py-3 text-right">R$ 0,00</td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3">Saldo Ajustado</td>
              <td className="px-6 py-3 text-right">R$ {dlpaData.previousBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td className="px-6 py-3">(+) Lucro Líquido do Exercício</td>
              <td className={`px-6 py-3 text-right ${dlpaData.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {dlpaData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3">(-) Dividendos Distribuídos</td>
              <td className="px-6 py-3 text-right text-red-600">(R$ {dlpaData.dividends.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
            </tr>
            <tr className="bg-emerald-50 font-bold border-t border-emerald-100">
              <td className="px-6 py-4 text-emerald-900">SALDO FINAL</td>
              <td className="px-6 py-4 text-right text-emerald-700">
                R$ {dlpaData.finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DRAView = ({ transactions, accountPlans, entries, reportLevel, showZeroBalances }: { transactions: any[], accountPlans: any[], entries: any[], reportLevel: string, showZeroBalances: boolean }) => {
  const draData = useMemo(() => {
    const revenue = accountPlans
      .filter(p => p.type === 'receita')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.credit.startsWith(p.code)) return s + e.value;
          if (e.debit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const expenses = accountPlans
      .filter(p => p.type === 'despesa')
      .reduce((sum, p) => {
        const b = entries.reduce((s, e) => {
          if (e.debit.startsWith(p.code)) return s + e.value;
          if (e.credit.startsWith(p.code)) return s - e.value;
          return s;
        }, 0);
        return sum + b;
      }, 0);

    const profit = revenue - expenses;
    const otherComprehensiveIncome = 0;
    return { profit, otherComprehensiveIncome };
  }, [entries, accountPlans]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demonstração do Resultado Abrangente (DRA)</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="font-medium">
              <td className="px-6 py-3">LUCRO LÍQUIDO DO EXERCÍCIO</td>
              <td className={`px-6 py-3 text-right ${draData.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {draData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 pl-10 text-gray-600">Outros Resultados Abrangentes</td>
              <td className="px-6 py-3 text-right">R$ {draData.otherComprehensiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="bg-emerald-50 font-bold border-t border-emerald-100">
              <td className="px-6 py-4 text-emerald-900">RESULTADO ABRANGENTE TOTAL</td>
              <td className="px-6 py-4 text-right text-emerald-700">
                R$ {(draData.profit + draData.otherComprehensiveIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
