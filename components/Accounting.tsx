import React, { useState, useMemo } from 'react';
import { FileText, Book, Scale, Calculator, Calendar, Edit2, Trash2, PieChart, TrendingUp, FileBarChart, List, AlignLeft } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

interface AccountingProps {
  initialView?: string;
}

export const Accounting: React.FC<AccountingProps> = ({ initialView = 'contab_dre' }) => {
  const [activeTab, setActiveTab] = useState(initialView);
  const { transactions, accounts } = useTransactions();

  // Sync activeTab when initialView changes (e.g. from sidebar navigation)
  React.useEffect(() => {
    if (initialView) {
      setActiveTab(initialView);
    }
  }, [initialView]);

  const renderContent = () => {
    switch (activeTab) {
      case 'contab_dre':
        return <DREView transactions={transactions} />;
      case 'contab_balanco':
        return <BalanceSheetView transactions={transactions} accounts={accounts} />;
      case 'contab_balancete':
        return <TrialBalanceView transactions={transactions} />;
      case 'contab_diario':
        return <JournalView transactions={transactions} />;
      case 'contab_razao':
        return <LedgerView transactions={transactions} />;
      case 'contab_dfc':
        return <DFCView transactions={transactions} accounts={accounts} />;
      case 'contab_dmpl':
        return <DMPLView transactions={transactions} />;
      case 'contab_dva':
        return <DVAView transactions={transactions} />;
      case 'contab_notas':
        return <NotesView />;
      case 'contab_dlpa':
        return <DLPAView transactions={transactions} />;
      case 'contab_dra':
        return <DRAView transactions={transactions} />;
      default:
        return <DREView transactions={transactions} />;
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

// Helper to generate accounting entries from transactions
const generateAccountingEntries = (transactions: any[]) => {
  const entries: any[] = [];
  let entryId = 1;

  transactions.forEach(t => {
    // Handle Transfers specially
    if (t.type === 'transfer') {
      t.payments.forEach((p: any) => {
        if (p.status === 'completed') {
          const transferEntry = {
            id: entryId++,
            transactionId: t.id,
            date: p.dueDate || t.date,
            description: `Transferência - ${t.description}`,
            debit: `1.1.01 - ${p.destination}`,
            credit: `1.1.01 - ${p.source}`,
            value: p.value
          };
          entries.push(transferEntry);
        }
      });
      return;
    }

    // 1. Initial Recognition (Accrual Basis)
    // Settlements don't generate new revenue/expense, they just move assets/liabilities
    if (!t.linkedTransactionId) {
      const accrualEntry = {
        id: entryId++,
        transactionId: t.id,
        date: t.date,
        description: `Reconhecimento de ${t.type === 'income' ? 'Receita' : 'Despesa'} - ${t.description}`,
        debit: t.type === 'income' ? '1.1.02 - Contas a Receber' : `4.2.02 - Despesas Administrativas (${t.category})`,
        credit: t.type === 'income' ? `3.1.01 - Receita de Vendas (${t.category})` : '2.1.01 - Fornecedores',
        value: t.value
      };
      entries.push(accrualEntry);
    }

    // 2. Payments/Receipts (Cash Basis)
    t.payments.forEach((p: any) => {
      if (p.status === 'completed') {
        // If this payment was settled by another independent transaction, skip it here
        // to avoid double counting the cash movement
        const isSettledByOther = transactions.some(other => 
          other.linkedTransactionId === t.id && other.linkedPaymentId === p.id
        );
        
        if (isSettledByOther) return;

        const paymentEntry = {
          id: entryId++,
          transactionId: t.id,
          date: p.dueDate || t.date,
          description: `${t.type === 'income' ? 'Recebimento' : 'Pagamento'} - ${t.description}`,
          debit: t.type === 'income' ? '1.1.01 - Caixa/Banco' : '2.1.01 - Fornecedores',
          credit: t.type === 'income' ? '1.1.02 - Contas a Receber' : '1.1.01 - Caixa/Banco',
          value: p.value
        };
        entries.push(paymentEntry);
      }
    });
  });

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const DREView = ({ transactions }: { transactions: any[] }) => {
  const dreData = useMemo(() => {
    const revenue = transactions
      .filter(t => t.type === 'income' && !t.linkedTransactionId)
      .reduce((sum, t) => sum + t.value, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense' && !t.linkedTransactionId)
      .reduce((sum, t) => sum + t.value, 0);

    const grossProfit = revenue; // Simplified
    const netProfit = revenue - expenses;
    
    return { revenue, expenses, grossProfit, netProfit };
  }, [transactions]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Demonstração do Resultado do Exercício</h3>
        <div className="flex gap-2">
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>2026</option>
            <option>2025</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            Gerar Relatório
          </button>
        </div>
      </div>
      
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
            <tr className="bg-emerald-50/30 font-medium">
              <td className="px-6 py-3 text-emerald-900">RECEITA OPERACIONAL BRUTA</td>
              <td className="px-6 py-3 text-right text-emerald-700">R$ {dreData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right text-emerald-700">100%</td>
            </tr>
            <tr>
              <td className="px-6 py-2 pl-10 text-gray-600">(-) Deduções da Receita Bruta</td>
              <td className="px-6 py-2 text-right text-red-600">(R$ 0,00)</td>
              <td className="px-6 py-2 text-right text-gray-500">0%</td>
            </tr>
            <tr className="font-medium bg-gray-50/50">
              <td className="px-6 py-3 text-gray-900">(=) RECEITA OPERACIONAL LÍQUIDA</td>
              <td className="px-6 py-3 text-right text-gray-900">R$ {dreData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3 text-right text-gray-500">100%</td>
            </tr>
             <tr>
              <td className="px-6 py-2 pl-10 text-gray-600">(-) Custos e Despesas</td>
              <td className="px-6 py-2 text-right text-red-600">(R$ {dreData.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</td>
              <td className="px-6 py-2 text-right text-gray-500">{dreData.revenue ? ((dreData.expenses / dreData.revenue) * 100).toFixed(1) : 0}%</td>
            </tr>
             <tr className="font-bold bg-gray-100">
              <td className="px-6 py-3 text-gray-900">(=) LUCRO/PREJUÍZO LÍQUIDO</td>
              <td className={`px-6 py-3 text-right ${dreData.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                R$ {dreData.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-3 text-right text-gray-500">
                {dreData.revenue ? ((dreData.netProfit / dreData.revenue) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          </tbody>
        </table>
        <div className="p-8 text-center text-gray-400 italic">
          Dados calculados com base nos lançamentos registrados.
        </div>
      </div>
    </div>
  );
};

const BalanceSheetView = ({ transactions, accounts }: { transactions: any[], accounts: any[] }) => {
  const balances = useMemo(() => {
    const totalInitialBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const entries = generateAccountingEntries(transactions);
    const accountBalances: Record<string, number> = {
      '1.1.01 - Caixa/Banco': 0,
      '1.1.02 - Contas a Receber': 0,
      '2.1.01 - Fornecedores': 0,
      'Capital Social': 100000, // Mock initial capital
    };

    // Calculate balances from entries
    entries.forEach(entry => {
      // Debit increases Asset/Expense, decreases Liability/Equity/Income
      // Credit decreases Asset/Expense, increases Liability/Equity/Income
      
      // Simplified logic: Just tracking main accounts for the view
      if (accountBalances[entry.debit] !== undefined) accountBalances[entry.debit] += entry.value;
      if (accountBalances[entry.credit] !== undefined) accountBalances[entry.credit] -= entry.value;
      
      // Handle dynamic accounts (Expenses/Revenues) for Retained Earnings calculation
      // For Balance Sheet, we need Assets = Liabilities + Equity
      // Equity = Capital + Retained Earnings (Revenue - Expenses)
    });

    // Recalculate strictly for Balance Sheet buckets
    let assets = {
      cash: 0,
      receivables: 0,
      fixed: 120000 // Mock fixed assets
    };
    let liabilities = {
      payables: 0,
      taxes: 15000 // Mock taxes
    };
    let equity = {
      capital: 100000,
      earnings: 0
    };

    // Process all transactions to build current state
    transactions.forEach(t => {
      if (t.type === 'income') {
        if (!t.linkedTransactionId) {
          equity.earnings += t.value; // Revenue increases equity
        }
        // If paid, goes to cash. If pending, goes to receivables.
        const paidAmount = t.payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.value, 0);
        
        // If this transaction is a settlement, it shouldn't increase receivables
        if (t.linkedTransactionId) {
           assets.cash += paidAmount;
           // We don't touch receivables here because the original transaction's payment will be marked as completed
           // and its receivable will be reduced there.
           // Wait, if we skip the payment entry in the original transaction, we must reduce receivables here.
           assets.receivables -= paidAmount;
        } else {
           assets.cash += paidAmount;
           assets.receivables += (t.value - paidAmount);
        }
      } else if (t.type === 'expense') {
        if (!t.linkedTransactionId) {
          equity.earnings -= t.value; // Expense decreases equity
        }
        // If paid, comes from cash. If pending, goes to payables.
        const paidAmount = t.payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.value, 0);
        
        if (t.linkedTransactionId) {
           assets.cash -= paidAmount;
           liabilities.payables -= paidAmount;
        } else {
           assets.cash -= paidAmount;
           liabilities.payables += (t.value - paidAmount);
        }
      }
      // Transfers are neutral for consolidated cash and equity earnings
    });

    // Add real initial balance from accounts
    assets.cash += totalInitialBalance; 

    return { assets, liabilities, equity };
  }, [transactions, accounts]);

  const totalAssets = balances.assets.cash + balances.assets.receivables + balances.assets.fixed;
  const totalLiabilities = balances.liabilities.payables + balances.liabilities.taxes;
  const totalEquity = balances.equity.capital + balances.equity.earnings;

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Balanço Patrimonial</h3>
      <div className="grid grid-cols-2 gap-8">
        {/* Assets */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">ATIVO</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">ATIVO CIRCULANTE</span>
              <span className="font-bold">R$ {(balances.assets.cash + balances.assets.receivables).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Caixa e Equivalentes</span>
              <span>R$ {balances.assets.cash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Clientes a Receber</span>
              <span>R$ {balances.assets.receivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between text-sm mt-4">
              <span className="font-medium">ATIVO NÃO CIRCULANTE</span>
              <span className="font-bold">R$ {balances.assets.fixed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Imobilizado</span>
              <span>R$ {balances.assets.fixed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between text-sm font-bold bg-gray-50 p-2 rounded mt-4 border-t border-gray-200">
              <span>TOTAL DO ATIVO</span>
              <span>R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">PASSIVO</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">PASSIVO CIRCULANTE</span>
              <span className="font-bold">R$ {totalLiabilities.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Fornecedores</span>
              <span>R$ {balances.liabilities.payables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Obrigações Fiscais</span>
              <span>R$ {balances.liabilities.taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-sm mt-4">
              <span className="font-medium">PATRIMÔNIO LÍQUIDO</span>
              <span className="font-bold">R$ {totalEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Capital Social</span>
              <span>R$ {balances.equity.capital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pl-4 flex justify-between text-sm text-gray-600">
              <span>Lucros/Prejuízos Acumulados</span>
              <span className={balances.equity.earnings >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                R$ {balances.equity.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold bg-gray-50 p-2 rounded mt-4 border-t border-gray-200">
              <span>TOTAL DO PASSIVO + PL</span>
              <span>R$ {(totalLiabilities + totalEquity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrialBalanceView = ({ transactions }: { transactions: any[] }) => {
  const trialBalance = useMemo(() => {
    const entries = generateAccountingEntries(transactions);
    const accounts: Record<string, { debit: number, credit: number }> = {};

    entries.forEach(entry => {
      if (!accounts[entry.debit]) accounts[entry.debit] = { debit: 0, credit: 0 };
      if (!accounts[entry.credit]) accounts[entry.credit] = { debit: 0, credit: 0 };
      
      accounts[entry.debit].debit += entry.value;
      accounts[entry.credit].credit += entry.value;
    });

    return Object.entries(accounts).map(([name, values]) => ({
      name,
      debit: values.debit,
      credit: values.credit,
      balance: values.debit - values.credit
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const totals = trialBalance.reduce((acc, curr) => ({
    debit: acc.debit + curr.debit,
    credit: acc.credit + curr.credit
  }), { debit: 0, credit: 0 });

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Balancete de Verificação</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Conta Contábil</th>
              <th className="px-6 py-3 text-right">Débito</th>
              <th className="px-6 py-3 text-right">Crédito</th>
              <th className="px-6 py-3 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trialBalance.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-800 font-medium">{item.name}</td>
                <td className="px-6 py-3 text-right text-blue-600">R$ {item.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-3 text-right text-red-600">R$ {item.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className={`px-6 py-3 text-right font-bold ${item.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  R$ {Math.abs(item.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {item.balance > 0 ? ' D' : item.balance < 0 ? ' C' : ''}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-4 text-gray-900">TOTAIS</td>
              <td className="px-6 py-4 text-right text-blue-700">R$ {totals.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-right text-red-700">R$ {totals.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-right text-emerald-700">R$ 0,00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JournalView = ({ transactions }: { transactions: any[] }) => {
  const { openModal, deleteTransaction } = useTransactions();
  const entries = useMemo(() => generateAccountingEntries(transactions), [transactions]);

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

const LedgerView = ({ transactions }: { transactions: any[] }) => {
  const accounts = useMemo(() => {
    const entries = generateAccountingEntries(transactions);
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
  }, [transactions]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Livro Razão</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(accounts).length === 0 ? (
             <div className="col-span-2 text-center text-gray-500">Nenhuma conta movimentada.</div>
        ) : (
            Object.entries(accounts).map(([accountName, data]: [string, any]) => {
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

const DFCView = ({ transactions, accounts }: { transactions: any[], accounts: any[] }) => {
  const dfcData = useMemo(() => {
    const totalInitialBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    // Operating Activities: Net Income + Non-cash items + Changes in Working Capital
    // Simplified: Cash In - Cash Out from Operating activities
    const operatingIn = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.value, 0);
    
    const operatingOut = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed' && t.category !== 'Investimento' && t.category !== 'Empréstimos')
      .reduce((sum, t) => sum + t.value, 0);

    const netOperating = operatingIn - operatingOut;

    // Investing Activities
    const investingOut = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed' && t.category === 'Investimento')
      .reduce((sum, t) => sum + t.value, 0);
    
    const netInvesting = -investingOut;

    // Financing Activities
    const financingIn = transactions
      .filter(t => t.type === 'income' && t.status === 'completed' && (t.category === 'Empréstimos' || t.category === 'Capital'))
      .reduce((sum, t) => sum + t.value, 0);
    
    const financingOut = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed' && t.category === 'Empréstimos')
      .reduce((sum, t) => sum + t.value, 0);

    const netFinancing = financingIn - financingOut;

    const initialCash = totalInitialBalance;
    const finalCash = initialCash + netOperating + netInvesting + netFinancing;

    return { netOperating, netInvesting, netFinancing, initialCash, finalCash };
  }, [transactions, accounts]);

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

const DMPLView = ({ transactions }: { transactions: any[] }) => {
  const dmplData = useMemo(() => {
    const capital = 100000;
    const reserves = 15000;
    const profit = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0) - 
      transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
    
    return { capital, reserves, profit };
  }, [transactions]);

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

const DVAView = ({ transactions }: { transactions: any[] }) => {
  const dvaData = useMemo(() => {
    const revenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
    const inputs = transactions.filter(t => t.type === 'expense' && t.category !== 'Pessoal' && t.category !== 'Impostos').reduce((sum, t) => sum + t.value, 0);
    const grossAddedValue = revenue - inputs;
    const retention = grossAddedValue * 0.05; // Mock 5% depreciation
    const netAddedValue = grossAddedValue - retention;
    
    // Distribution
    const personnel = transactions.filter(t => t.type === 'expense' && t.category === 'Pessoal').reduce((sum, t) => sum + t.value, 0);
    const taxes = transactions.filter(t => t.type === 'expense' && t.category === 'Impostos').reduce((sum, t) => sum + t.value, 0);
    const equity = netAddedValue - personnel - taxes; // Remainder to equity/profit

    return { revenue, inputs, grossAddedValue, retention, netAddedValue, personnel, taxes, equity };
  }, [transactions]);

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

const DLPAView = ({ transactions }: { transactions: any[] }) => {
  const dlpaData = useMemo(() => {
    const previousBalance = 0;
    const profit = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0) - 
      transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
    const dividends = 0; // Mock
    const finalBalance = previousBalance + profit - dividends;
    return { previousBalance, profit, dividends, finalBalance };
  }, [transactions]);

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

const DRAView = ({ transactions }: { transactions: any[] }) => {
  const draData = useMemo(() => {
    const profit = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0) - 
      transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
    const otherComprehensiveIncome = 0;
    return { profit, otherComprehensiveIncome };
  }, [transactions]);

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
