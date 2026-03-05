import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle,
  Wallet,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  RefreshCw
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area
} from 'recharts';
import { useTransactions } from '../src/context/TransactionContext';
import { BankReconciliationModal } from './BankReconciliationModal';

export const CashFlow: React.FC = () => {
  const { transactions, accounts } = useTransactions();
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'annual'>('daily');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    description: '',
    document: '',
    status: 'all',
    type: 'all',
    minValue: '',
    maxValue: ''
  });

  const chartData = useMemo(() => {
    if (viewMode === 'annual') {
        const yearlyData: Record<string, { 
            entrada: number; 
            saida: number; 
            entradaProjetada: number; 
            saidaProjetada: number 
        }> = {};

        transactions.forEach(t => {
            const year = new Date(t.date).getFullYear().toString();
            
            t.payments.forEach(p => {
                if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                }

                if (!yearlyData[year]) {
                    yearlyData[year] = { entrada: 0, saida: 0, entradaProjetada: 0, saidaProjetada: 0 };
                }

                let isIncome = t.type === 'income';
                let isExpense = t.type === 'expense';

                if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                }

                if (p.status === 'completed' && p.method !== 'Adiantamento') {
                    if (isIncome) yearlyData[year].entrada += p.value;
                    else if (isExpense) yearlyData[year].saida += p.value;
                }

                if (isIncome) yearlyData[year].entradaProjetada += p.value;
                else if (isExpense) yearlyData[year].saidaProjetada += p.value;
            });
        });

        const sortedYears = Object.keys(yearlyData).sort();
        
        // Calculate initial balance (current balance)
        let finalBalance = 0;
        if (selectedAccount === 'all') {
            finalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        } else {
            const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
            finalBalance = acc ? acc.balance : 0;
        }

        return sortedYears.map(year => {
            const data = yearlyData[year];
            
            // Calculate balance at end of this year
            // = Current Balance - (All completed flows AFTER this year)
            let balanceAtYearEnd = finalBalance;
            
            transactions.forEach(t => {
                const tYear = new Date(t.date).getFullYear();
                if (tYear > parseInt(year)) {
                     t.payments.forEach(p => {
                        if (p.status !== 'completed' || p.method === 'Adiantamento') return;
                        if (selectedAccount !== 'all') {
                            const isDestination = p.destination === selectedAccount;
                            const isSource = p.source === selectedAccount;
                            if (!isDestination && !isSource) return;
                        }
                        
                        let isIncome = t.type === 'income';
                        let isExpense = t.type === 'expense';
                        if (t.transactionTypeId === 'transferencia') {
                            if (selectedAccount === 'all') return;
                            if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                            else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                            else return;
                        }

                        if (isIncome) balanceAtYearEnd -= p.value;
                        else if (isExpense) balanceAtYearEnd += p.value;
                     });
                }
            });

            return {
                name: year,
                fullDate: year,
                entrada: data.entrada,
                saida: data.saida,
                saldo: balanceAtYearEnd,
                projetado: balanceAtYearEnd + (data.entradaProjetada - data.entrada) - (data.saidaProjetada - data.saida)
            };
        });
    }

    const dailyData: Record<string, { 
      entrada: number; 
      saida: number; 
      entradaProjetada: number; 
      saidaProjetada: number 
    }> = {};

    transactions.forEach(t => {
      const transYear = new Date(t.date).getFullYear();
      if (transYear !== selectedYear) return;

      t.payments.forEach(p => {
        // Filter by account if selected
        if (selectedAccount !== 'all') {
          const isDestination = p.destination === selectedAccount;
          const isSource = p.source === selectedAccount;
          if (!isDestination && !isSource) return;
        }

        const date = p.dueDate;
        if (!dailyData[date]) {
          dailyData[date] = { entrada: 0, saida: 0, entradaProjetada: 0, saidaProjetada: 0 };
        }
        
        let isIncome = t.type === 'income';
        let isExpense = t.type === 'expense';

        // Handle Transfer logic
        if (t.transactionTypeId === 'transferencia') {
          if (selectedAccount === 'all') {
            // In consolidated view, transfers are neutral
            return;
          }
          if (p.source === selectedAccount) {
            isIncome = false;
            isExpense = true;
          } else if (p.destination === selectedAccount) {
            isIncome = true;
            isExpense = false;
          } else {
            // If the selected account is neither source nor destination, ignore
            return;
          }
        }

        // Realized (Completed)
        if (p.status === 'completed' && p.method !== 'Adiantamento') {
          if (isIncome) {
            dailyData[date].entrada += p.value;
          } else if (isExpense) {
            dailyData[date].saida += p.value;
          }
        }

        // Projected (Completed + Pending)
        if (isIncome) {
          dailyData[date].entradaProjetada += p.value;
        } else if (isExpense) {
          dailyData[date].saidaProjetada += p.value;
        }
      });
    });

    // Sort dates and calculate cumulative balance
    const sortedDates = Object.keys(dailyData).sort();
    
    // Calculate Initial Balance based on selected account(s)
    let currentBalance = 0;
    if (selectedAccount === 'all') {
      currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    } else {
      const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
      currentBalance = acc ? acc.balance : 0;
    }
    
    // Calculate balance at end of selected year
    let balanceAtYearEnd = currentBalance;
    const nextYear = selectedYear + 1;
    
    transactions.forEach(t => {
        const tYear = new Date(t.date).getFullYear();
        if (tYear >= nextYear) {
             t.payments.forEach(p => {
                if (p.status !== 'completed' || p.method === 'Adiantamento') return;
                if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                }
                
                let isIncome = t.type === 'income';
                let isExpense = t.type === 'expense';
                if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                }

                if (isIncome) balanceAtYearEnd -= p.value;
                else if (isExpense) balanceAtYearEnd += p.value;
             });
        }
    });

    // Calculate net flow for the year
    let netFlowYear = 0;
    Object.values(dailyData).forEach(d => {
        netFlowYear += (d.entrada - d.saida);
    });
    
    let startBalance = balanceAtYearEnd - netFlowYear;
    let runningBalance = startBalance;
    let projectedBalance = startBalance;

    return sortedDates.map(date => {
      const dayData = dailyData[date];
      
      runningBalance += (dayData.entrada - dayData.saida);
      projectedBalance += (dayData.entradaProjetada - dayData.saidaProjetada);
      
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}`;

      return {
        name: formattedDate,
        fullDate: date,
        entrada: dayData.entrada,
        saida: dayData.saida,
        saldo: runningBalance,
        projetado: projectedBalance
      };
    });
  }, [transactions, selectedAccount, accounts, selectedYear, viewMode]);

  // Individual entries for the table
  const tableData = useMemo(() => {
    if (viewMode === 'annual') {
        const yearlyData: Record<string, { 
            year: string;
            entrada: number; 
            saida: number; 
            saldo: number;
            status: string;
        }> = {};

        // Group by year
        const years = (Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))) as number[]).sort((a, b) => a - b);
        
        years.forEach(year => {
             yearlyData[String(year)] = { year: year.toString(), entrada: 0, saida: 0, saldo: 0, status: 'Positivo' };
        });

        // Calculate flows per year
        transactions.forEach(t => {
            const year = new Date(t.date).getFullYear().toString();
            t.payments.forEach(p => {
                if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                }
                
                let isIncome = t.type === 'income';
                let isExpense = t.type === 'expense';
                if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                }

                if (p.status === 'completed' && p.method !== 'Adiantamento') {
                    if (isIncome) yearlyData[year].entrada += p.value;
                    else if (isExpense) yearlyData[year].saida += p.value;
                }
            });
        });

        // Calculate balances
        let currentBalance = 0;
        if (selectedAccount === 'all') {
            currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        } else {
            const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
            currentBalance = acc ? acc.balance : 0;
        }
        
        // Calculate total flow of all years > max year in list
        const maxYear = Math.max(...years);
        let balanceAtMaxYearEnd = currentBalance;
        
        transactions.forEach(t => {
            const tYear = new Date(t.date).getFullYear();
            if (tYear > maxYear) {
                 t.payments.forEach(p => {
                    if (p.status !== 'completed' || p.method === 'Adiantamento') return;
                    if (selectedAccount !== 'all') {
                        const isDestination = p.destination === selectedAccount;
                        const isSource = p.source === selectedAccount;
                        if (!isDestination && !isSource) return;
                    }
                    let isIncome = t.type === 'income';
                    let isExpense = t.type === 'expense';
                    if (t.transactionTypeId === 'transferencia') {
                        if (selectedAccount === 'all') return;
                        if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                        else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                        else return;
                    }
                    if (isIncome) balanceAtMaxYearEnd -= p.value;
                    else if (isExpense) balanceAtMaxYearEnd += p.value;
                 });
            }
        });
        
        // Now calculate backwards for each year in our list
        const reversedYears = [...years].reverse();
        let nextBalance = balanceAtMaxYearEnd;
        
        reversedYears.forEach(year => {
            const data = yearlyData[String(year)];
            const netFlow = data.entrada - data.saida;
            data.saldo = nextBalance; // Balance at end of year
            data.status = nextBalance >= 0 ? 'Positivo' : 'Negativo';
            nextBalance -= netFlow; // Balance at start of year (which is end of prev year)
        });

        return Object.values(yearlyData).map(data => ({
            id: data.year,
            date: data.year,
            description: `Ano ${data.year}`,
            document: '-',
            type: 'annual',
            entrada: data.entrada,
            saida: data.saida,
            value: data.entrada - data.saida,
            status: data.status,
            balance: data.saldo,
            customer: '-',
            bank: '-'
        }));
    }

    if (viewMode === 'monthly') {
      const monthlyData: Record<string, { 
        month: string;
        entrada: number; 
        saida: number; 
        saldo: number;
        status: string;
      }> = {};

      // Initialize all months of the selected year
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      monthNames.forEach((name, index) => {
        const key = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
        monthlyData[key] = { month: name, entrada: 0, saida: 0, saldo: 0, status: 'Positivo' };
      });

      // Calculate running balance starting from the beginning of the year
      let runningBalance = 0;
      if (selectedAccount === 'all') {
        runningBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      } else {
        const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
        runningBalance = acc ? acc.balance : 0;
      }

      // We need to adjust runningBalance to be the balance at the START of the year
      // by reversing all completed transactions from the start of the year to now.
      // But for simplicity in this view, let's just show the monthly flow and the balance at the end of each month.
      
      const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate balance at end of selected year first (same logic as daily/annual)
      let balanceAtYearEnd = runningBalance;
      const nextYear = selectedYear + 1;
      
      transactions.forEach(t => {
        const tYear = new Date(t.date).getFullYear();
        if (tYear >= nextYear) {
             t.payments.forEach(p => {
                if (p.status !== 'completed' || p.method === 'Adiantamento') return;
                if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                }
                let isIncome = t.type === 'income';
                let isExpense = t.type === 'expense';
                if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                }
                if (isIncome) balanceAtYearEnd -= p.value;
                else if (isExpense) balanceAtYearEnd += p.value;
             });
        }
      });
      
      // Calculate net flow for the year
      let netFlowYear = 0;
      sortedTransactions.forEach(t => {
          const transYear = new Date(t.date).getFullYear();
          if (transYear !== selectedYear) return;
          t.payments.forEach(p => {
             if (p.status !== 'completed' || p.method === 'Adiantamento') return;
             if (selectedAccount !== 'all') {
                const isDestination = p.destination === selectedAccount;
                const isSource = p.source === selectedAccount;
                if (!isDestination && !isSource) return;
             }
             let isIncome = t.type === 'income';
             let isExpense = t.type === 'expense';
             if (t.transactionTypeId === 'transferencia') {
                if (selectedAccount === 'all') return;
                if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                else return;
             }
             if (isIncome) netFlowYear += p.value;
             else if (isExpense) netFlowYear -= p.value;
          });
      });
      
      let startBalance = balanceAtYearEnd - netFlowYear;
      let currentRunningBalance = startBalance;

      // Now iterate months
      Object.keys(monthlyData).sort().forEach(monthKey => {
          const data = monthlyData[monthKey];
          // Find transactions for this month
          sortedTransactions.forEach(t => {
              t.payments.forEach(p => {
                  const pMonthKey = p.dueDate.substring(0, 7);
                  if (pMonthKey !== monthKey) return;
                  
                  if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                  }
                  
                  let isIncome = t.type === 'income';
                  let isExpense = t.type === 'expense';
                  if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                  }
                  
                  if (p.status === 'completed' && p.method !== 'Adiantamento') {
                    if (isIncome) data.entrada += p.value;
                    else if (isExpense) data.saida += p.value;
                  }
              });
          });
          
          currentRunningBalance += (data.entrada - data.saida);
          data.saldo = currentRunningBalance;
          data.status = currentRunningBalance >= 0 ? 'Positivo' : 'Negativo';
      });

      return Object.entries(monthlyData).map(([key, data]) => ({
        id: key,
        date: key,
        description: data.month,
        document: '-',
        type: 'monthly',
        entrada: data.entrada,
        saida: data.saida,
        value: data.entrada - data.saida,
        status: data.status,
        balance: data.saldo,
        customer: '-',
        bank: '-'
      })).filter(m => m.entrada > 0 || m.saida > 0 || m.balance !== 0);
    }

    const entries: any[] = [];
    
    // Sort transactions by date first
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 1. Calculate the sum of all completed transactions to find the "Starting Balance"
    // relative to the current balance in the accounts.
    let totalFlow = 0;
    sortedTransactions.forEach(t => {
      const transYear = new Date(t.date).getFullYear();
      if (transYear !== selectedYear) return;

      t.payments.forEach(p => {
        if (p.status !== 'completed' || p.method === 'Adiantamento') return;
        
        if (selectedAccount !== 'all') {
          const isDestination = p.destination === selectedAccount;
          const isSource = p.source === selectedAccount;
          if (!isDestination && !isSource) return;
        }

        let isIncome = t.type === 'income';
        let isExpense = t.type === 'expense';
        if (t.transactionTypeId === 'transferencia') {
          if (selectedAccount === 'all') return;
          if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
          else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
          else return;
        }

        if (isIncome) totalFlow += p.value;
        else if (isExpense) totalFlow -= p.value;
      });
    });

    // Current Balance from accounts
    let currentAccountBalance = 0;
    if (selectedAccount === 'all') {
      currentAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    } else {
      const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
      currentAccountBalance = acc ? acc.balance : 0;
    }

    // Starting balance = Current - Total Flow
    // Wait, this logic assumes "Current Balance" is the balance at the end of the selected year?
    // No, Current Balance is NOW.
    // So we need to subtract flows from NOW back to the start of the selected year.
    
    // Let's reuse the logic from chartData to find startBalance of the year.
    let balanceAtYearEnd = currentAccountBalance;
    const nextYear = selectedYear + 1;
    
    transactions.forEach(t => {
        const tYear = new Date(t.date).getFullYear();
        if (tYear >= nextYear) {
             t.payments.forEach(p => {
                if (p.status !== 'completed' || p.method === 'Adiantamento') return;
                if (selectedAccount !== 'all') {
                    const isDestination = p.destination === selectedAccount;
                    const isSource = p.source === selectedAccount;
                    if (!isDestination && !isSource) return;
                }
                let isIncome = t.type === 'income';
                let isExpense = t.type === 'expense';
                if (t.transactionTypeId === 'transferencia') {
                    if (selectedAccount === 'all') return;
                    if (p.source === selectedAccount) { isIncome = false; isExpense = true; }
                    else if (p.destination === selectedAccount) { isIncome = true; isExpense = false; }
                    else return;
                }
                if (isIncome) balanceAtYearEnd -= p.value;
                else if (isExpense) balanceAtYearEnd += p.value;
             });
        }
    });
    
    // Calculate net flow for the year (already done in totalFlow above? No, totalFlow above was just summing up flow in the year)
    // totalFlow calculated above IS the net flow for the selected year.
    
    let runningBalance = balanceAtYearEnd - totalFlow;

    sortedTransactions.forEach(t => {
      const transYear = new Date(t.date).getFullYear();
      if (transYear !== selectedYear) return;

      t.payments.forEach(p => {
        // Filter by account if selected
        if (selectedAccount !== 'all') {
          const isDestination = p.destination === selectedAccount;
          const isSource = p.source === selectedAccount;
          if (!isDestination && !isSource) return;
        }

        let isIncome = t.type === 'income';
        let isExpense = t.type === 'expense';

        if (t.transactionTypeId === 'transferencia') {
          if (selectedAccount === 'all') {
            // In consolidated view, we still want to show the transfer in the table
            // but it's neither income nor expense for the total flow.
            // However, the user wants it to appear as "Transferência".
            isIncome = false;
            isExpense = false;
          } else if (p.source === selectedAccount) {
            isIncome = false;
            isExpense = true;
          } else if (p.destination === selectedAccount) {
            isIncome = true;
            isExpense = false;
          } else {
            return;
          }
        }

        if (p.status === 'completed' && p.method !== 'Adiantamento') {
          if (isIncome) runningBalance += p.value;
          else if (isExpense) runningBalance -= p.value;
        }

        entries.push({
          id: `${t.id}-${p.id}`,
          date: p.dueDate,
          description: t.description,
          document: t.orderNumber || '-',
          type: t.transactionTypeId === 'transferencia' ? 'transfer' : (isIncome ? 'income' : 'expense'),
          value: p.value,
          status: p.status,
          balance: runningBalance,
          customer: t.customerName || '-',
          bank: t.transactionTypeId === 'transferencia' ? `${p.source} → ${p.destination}` : (p.destination || '-')
        });
      });
    });

    // Apply filters
    return entries.filter(entry => {
      const matchDate = filters.date === '' || entry.date.includes(filters.date);
      const matchDesc = filters.description === '' || entry.description.toLowerCase().includes(filters.description.toLowerCase()) || entry.customer.toLowerCase().includes(filters.description.toLowerCase());
      const matchDoc = filters.document === '' || entry.document.toLowerCase().includes(filters.document.toLowerCase());
      const matchStatus = filters.status === 'all' || entry.status === filters.status;
      const matchType = filters.type === 'all' || entry.type === filters.type;
      const matchMin = filters.minValue === '' || entry.value >= parseFloat(filters.minValue);
      const matchMax = filters.maxValue === '' || entry.value <= parseFloat(filters.maxValue);
      
      return matchDate && matchDesc && matchDoc && matchStatus && matchType && matchMin && matchMax;
    }).reverse(); // Show newest first in table
  }, [transactions, selectedAccount, accounts, filters, viewMode, selectedYear]);

  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce((acc, curr) => ({
      entradas: acc.entradas + curr.entrada,
      saidas: acc.saidas + curr.saida
    }), { entradas: 0, saidas: 0 });
  }, [chartData]);

  const lastBalance = chartData.length > 0 ? chartData[chartData.length - 1].saldo : 
    (selectedAccount === 'all' ? accounts.reduce((sum, a) => sum + a.balance, 0) : (accounts.find(a => a.name === selectedAccount)?.balance || 0));
    
  const lastProjectedBalance = chartData.length > 0 ? chartData[chartData.length - 1].projetado : lastBalance;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fluxo de Caixa</h1>
          <p className="text-gray-500">Acompanhamento de entradas, saídas e projeções financeiras</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
             <select
               value={selectedAccount}
               onChange={(e) => setSelectedAccount(e.target.value)}
               className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             >
               <option value="all">Todas as Contas</option>
               {accounts.map(acc => (
                 <option key={acc.id} value={acc.name}>{acc.name}</option>
               ))}
             </select>
             <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'daily' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Diário
            </button>
            <button 
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'monthly' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'annual' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Anual
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setSelectedYear(prev => prev === 2026 ? 2025 : 2026)} // Simple toggle for demo
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
            >
              <Calendar size={16} />
              <span>{selectedYear}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsReconciliationOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm"
            >
              <RefreshCw size={16} />
              <span>Conciliação</span>
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm"
            >
              <Download size={16} />
              <span>Exportar</span>
              <ChevronDown size={14} className="text-emerald-200" />
            </button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileText size={16} className="text-red-500" /> Exportar PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-emerald-500" /> Exportar para Excel
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileCode size={16} className="text-blue-500" /> Exportar CSV
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <File size={16} className="text-indigo-500" /> Exportar DOC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saldo Atual</p>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">R$ {lastBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-gray-400 mt-1">Calculado hoje</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Entradas (Período)</p>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">R$ {totals.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            <span className="text-xs text-gray-400">vs. período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saídas (Período)</p>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-red-600">R$ {totals.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">+5%</span>
            <span className="text-xs text-gray-400">vs. período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saldo Projetado</p>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-blue-600">R$ {lastProjectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-gray-400 mt-1">Previsão final do período</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Evolução do Saldo e Movimentações</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Entradas
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Saídas
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Saldo Acumulado
            </span>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="entrada" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="saida" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="saldo" name="Saldo Realizado" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="projetado" name="Saldo Projetado" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {viewMode === 'daily' ? 'Detalhamento de Lançamentos' : 'Resumo Mensal'}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters({ date: '', description: '', document: '', status: 'all', type: 'all', minValue: '', maxValue: '' })}
                className="text-xs text-gray-500 hover:text-emerald-600 font-medium mr-2"
              >
                Limpar Filtros
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isFilterOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                  <ChevronDown size={14} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Data</label>
                        <input 
                          type="date"
                          value={filters.date}
                          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Descrição/Cliente</label>
                        <input 
                          type="text"
                          placeholder="Buscar..."
                          value={filters.description}
                          onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Documento</label>
                        <input 
                          type="text"
                          placeholder="Nº Doc"
                          value={filters.document}
                          onChange={(e) => setFilters(prev => ({ ...prev, document: e.target.value }))}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tipo</label>
                          <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-white"
                          >
                            <option value="all">Todos</option>
                            <option value="income">Entrada</option>
                            <option value="expense">Saída</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</label>
                          <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-white"
                          >
                            <option value="all">Todos</option>
                            <option value="completed">Realizado</option>
                            <option value="pending">Pendente</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Valor Mín.</label>
                          <input 
                            type="number"
                            placeholder="R$ 0,00"
                            value={filters.minValue}
                            onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Valor Máx.</label>
                          <input 
                            type="number"
                            placeholder="R$ 0,00"
                            value={filters.maxValue}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full mt-2 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">{viewMode === 'daily' ? 'Data' : (viewMode === 'monthly' ? 'Mês' : 'Ano')}</th>
                <th className="px-6 py-3">Descrição / Cliente</th>
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Banco/Caixa</th>
                <th className="px-6 py-3 text-right">Valor</th>
                <th className="px-6 py-3 text-right">Saldo Acumulado</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {viewMode === 'daily' 
                      ? new Date(item.date).toLocaleDateString('pt-BR')
                      : item.description // In monthly mode, description is the month name
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{item.description}</div>
                    <div className="text-xs text-gray-400">{item.customer}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.document}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{item.bank}</td>
                  <td className={`px-6 py-4 text-right font-medium ${
                    item.type === 'income' || item.type === 'monthly' || item.type === 'annual' ? 'text-emerald-600' : 
                    item.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {item.type === 'income' ? '+' : (item.type === 'expense' ? '-' : (item.type === 'transfer' ? '⇄' : ''))} R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    R$ {item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'completed' || item.status === 'Positivo' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {viewMode === 'daily' ? 'Realizado' : 'Positivo'}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Negativo' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {viewMode === 'daily' ? 'Pendente' : 'Negativo'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BankReconciliationModal 
        isOpen={isReconciliationOpen} 
        onClose={() => setIsReconciliationOpen(false)} 
      />
    </div>
  );
};
