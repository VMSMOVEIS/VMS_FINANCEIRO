import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle, Plus, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { Transaction, Payment } from '../types';
import * as XLSX from 'xlsx';

interface BankReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  value: number;
  type: 'credit' | 'debit';
  status: 'matched' | 'unmatched' | 'potential_match';
  matchedPaymentId?: string;
}

export const BankReconciliationModal: React.FC<BankReconciliationModalProps> = ({ isOpen, onClose }) => {
  const { accounts, transactions, addTransaction, updateTransaction } = useTransactions();
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [importedTransactions, setImportedTransactions] = useState<BankTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Basic parsing logic - assumes columns: Date, Description, Value
      // This is a simplification. Real-world bank exports vary wildly.
      // We'll try to detect columns or just use index 0, 1, 2 for now as a default.
      
      const parsedTransactions: BankTransaction[] = [];
      
      // Skip header row if it exists (simple check: if first cell is string 'Data' or 'Date')
      let startIndex = 0;
      if (jsonData.length > 0 && typeof jsonData[0][0] === 'string' && 
          (jsonData[0][0].toLowerCase().includes('data') || jsonData[0][0].toLowerCase().includes('date'))) {
        startIndex = 1;
      }

      for (let i = startIndex; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.length < 3) continue;

        // Try to parse date
        let dateStr = '';
        if (typeof row[0] === 'number') {
            // Excel date serial
            const date = new Date(Math.round((row[0] - 25569) * 86400 * 1000));
            dateStr = date.toISOString().split('T')[0];
        } else {
             // String date (DD/MM/YYYY or YYYY-MM-DD)
             const rawDate = String(row[0]);
             if (rawDate.includes('/')) {
                 const parts = rawDate.split('/');
                 if (parts.length === 3) dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
             } else {
                 dateStr = rawDate; // Assume ISO or valid format
             }
        }

        const description = String(row[1]);
        
        // Value parsing
        let value = 0;
        let type: 'credit' | 'debit' = 'credit';
        
        if (typeof row[2] === 'number') {
            value = Math.abs(row[2]);
            type = row[2] >= 0 ? 'credit' : 'debit';
        } else {
            const valStr = String(row[2]).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            const numVal = parseFloat(valStr);
            value = Math.abs(numVal);
            type = numVal >= 0 ? 'credit' : 'debit';
        }

        if (dateStr && !isNaN(value)) {
            parsedTransactions.push({
                id: `bank-${Date.now()}-${i}`,
                date: dateStr,
                description,
                value,
                type,
                status: 'unmatched'
            });
        }
      }

      setImportedTransactions(parsedTransactions);
      matchTransactions(parsedTransactions);

    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Erro ao ler o arquivo. Verifique o formato.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const matchTransactions = (bankTransactions: BankTransaction[]) => {
    if (!selectedAccount) return;

    const accountName = accounts.find(a => a.id === selectedAccount)?.name;
    if (!accountName) return;

    const updatedBankTransactions = [...bankTransactions];

    // Get system transactions for this account
    const systemPayments: { payment: Payment, transaction: Transaction }[] = [];
    transactions.forEach(t => {
        t.payments.forEach(p => {
            if (p.destination === accountName || p.source === accountName) {
                systemPayments.push({ payment: p, transaction: t });
            }
        });
    });

    updatedBankTransactions.forEach(bt => {
        // Find match
        // Criteria: Same Value, Date within +/- 2 days
        const match = systemPayments.find(sp => {
            if (sp.payment.reconciled) return false; // Already reconciled

            const paymentDate = new Date(sp.payment.dueDate);
            const bankDate = new Date(bt.date);
            const diffTime = Math.abs(bankDate.getTime() - paymentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            const isValueMatch = Math.abs(sp.payment.value - bt.value) < 0.01;
            
            // Check direction (credit/debit)
            // Bank Credit = Income (Destination is Account)
            // Bank Debit = Expense (Source is Account OR Destination is NOT Account but Source is Account)
            // Wait, simpler:
            // If Bank Credit -> System Income (or Transfer In)
            // If Bank Debit -> System Expense (or Transfer Out)
            
            let isDirectionMatch = false;
            if (bt.type === 'credit') {
                // Should be income or transfer IN
                if (sp.transaction.type === 'income') isDirectionMatch = true;
                if (sp.transaction.transactionTypeId === 'transferencia' && sp.payment.destination === accountName) isDirectionMatch = true;
            } else {
                // Should be expense or transfer OUT
                if (sp.transaction.type === 'expense') isDirectionMatch = true;
                if (sp.transaction.transactionTypeId === 'transferencia' && sp.payment.source === accountName) isDirectionMatch = true;
            }

            return isValueMatch && diffDays <= 2 && isDirectionMatch;
        });

        if (match) {
            bt.status = 'matched';
            bt.matchedPaymentId = match.payment.id;
        } else {
            // Check for potential match (just value?)
            // For now, simple unmatched
            bt.status = 'unmatched';
        }
    });

    setImportedTransactions(updatedBankTransactions);
  };

  const handleReconcile = (bankTransaction: BankTransaction) => {
    if (bankTransaction.status !== 'matched' || !bankTransaction.matchedPaymentId) return;

    // Find the transaction and update the payment to reconciled
    const transactionToUpdate = transactions.find(t => t.payments.some(p => p.id === bankTransaction.matchedPaymentId));
    
    if (transactionToUpdate) {
        const updatedPayments = transactionToUpdate.payments.map(p => {
            if (p.id === bankTransaction.matchedPaymentId) {
                return { ...p, reconciled: true };
            }
            return p;
        });
        
        updateTransaction(transactionToUpdate.id, { payments: updatedPayments });
        
        // Update local state to remove from list or mark as done
        setImportedTransactions(prev => prev.filter(t => t.id !== bankTransaction.id));
    }
  };

  const handleCreateTransaction = (bankTransaction: BankTransaction) => {
    // Open a modal or create directly?
    // For simplicity, let's create a basic transaction directly
    // Ideally, we should open the TransactionModal pre-filled.
    // But since we are inside a modal, maybe we can just create it.
    
    const accountName = accounts.find(a => a.id === selectedAccount)?.name || '';

    const newTransaction: Transaction = {
        id: Date.now(),
        date: bankTransaction.date,
        description: bankTransaction.description,
        value: bankTransaction.value,
        type: bankTransaction.type === 'credit' ? 'income' : 'expense',
        category: 'Outros', // Default
        transactionTypeId: bankTransaction.type === 'credit' ? 'recebimento' : 'pagamento',
        documentType: 'Extrato',
        status: 'completed',
        payments: [{
            id: Date.now().toString(),
            method: 'Transferência', // Default for bank
            value: bankTransaction.value,
            dueDate: bankTransaction.date,
            destination: bankTransaction.type === 'credit' ? accountName : 'Despesa', // If expense, destination isn't the bank account usually, source is.
            source: bankTransaction.type === 'debit' ? accountName : undefined,
            status: 'completed',
            reconciled: true
        }]
    };

    // Fix destination for expense:
    // If expense, money leaves account. Source = Account. Destination = 'Outros' (or category)
    if (newTransaction.type === 'expense') {
        newTransaction.payments[0].destination = 'Outros';
        newTransaction.payments[0].source = accountName;
    } else {
        newTransaction.payments[0].destination = accountName;
    }

    const { id, ...transactionData } = newTransaction;
    addTransaction(transactionData);
    setImportedTransactions(prev => prev.filter(t => t.id !== bankTransaction.id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <RefreshCw size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">Conciliação Bancária</h3>
                <p className="text-sm text-gray-500">Importe seu extrato e concilie com seus lançamentos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
            
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-end">
                <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conta Bancária</label>
                    <select 
                        value={selectedAccount} 
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecione uma conta...</option>
                        {accounts.filter(a => a.type === 'bank').map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".csv, .xls, .xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bank-statement-upload"
                        disabled={!selectedAccount}
                    />
                    <label 
                        htmlFor="bank-statement-upload"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm font-medium cursor-pointer transition-colors
                            ${!selectedAccount ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 bg-white'}
                        `}
                    >
                        <Upload size={16} />
                        {isProcessing ? 'Processando...' : 'Importar Extrato (OFX, CSV, Excel)'}
                    </label>
                </div>
            </div>

            {/* Transactions List */}
            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2">Data</div>
                    <div className="col-span-4">Descrição (Banco)</div>
                    <div className="col-span-2 text-right">Valor</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center">Ação</div>
                </div>
                
                <div className="overflow-y-auto flex-1 bg-white">
                    {importedTransactions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                            <FileSpreadsheet size={48} className="opacity-20" />
                            <p>Nenhum extrato importado ou transações já conciliadas.</p>
                        </div>
                    ) : (
                        importedTransactions.map(t => (
                            <div key={t.id} className="px-4 py-3 border-b border-gray-100 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors text-sm">
                                <div className="col-span-2 text-gray-600">{t.date.split('-').reverse().join('/')}</div>
                                <div className="col-span-4 font-medium text-gray-800 truncate" title={t.description}>{t.description}</div>
                                <div className={`col-span-2 text-right font-semibold ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {t.type === 'credit' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {t.status === 'matched' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                            <Check size={12} /> Encontrado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                            <AlertCircle size={12} /> Pendente
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-2 flex justify-center gap-2">
                                    {t.status === 'matched' ? (
                                        <button 
                                            onClick={() => handleReconcile(t)}
                                            className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                                            title="Conciliar"
                                        >
                                            <Check size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleCreateTransaction(t)}
                                            className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                            title="Lançar no Sistema"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};
