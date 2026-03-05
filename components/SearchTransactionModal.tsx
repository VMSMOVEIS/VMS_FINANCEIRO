import React, { useState, useMemo } from 'react';
import { Search, X, Check, AlertCircle } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { Transaction } from '../types';

interface SearchTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment_receipt' | 'advance';
  transactionType: 'income' | 'expense'; // The context of the current operation
  onSelect: (transaction: Transaction | Transaction[]) => void;
  onRegisterNew: () => void;
}

export const SearchTransactionModal: React.FC<SearchTransactionModalProps> = ({
  isOpen,
  onClose,
  type,
  transactionType,
  onSelect,
  onRegisterNew
}) => {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filter logic based on modal type and transaction context
      let matchesType = false;
      let matchesStatus = true;

      if (type === 'payment_receipt') {
        // If we are doing a Payment (Expense), we look for Accounts Payable (Expense)
        // If we are doing a Receipt (Income), we look for Accounts Receivable (Income)
        matchesType = t.type === transactionType;
        matchesStatus = t.status !== 'completed'; // Only show pending/partial for payments/receipts
      } else if (type === 'advance') {
        // If we are doing a Sale (Income), we look for Customer Advances (Income)
        // If we are doing a Purchase (Expense), we look for Supplier Advances (Expense)
        if (transactionType === 'income') {
           matchesType = (t.transactionTypeId === 'adiantamento_cliente' || t.transactionTypeId?.includes('adiantamento')) && t.type === 'income';
        } else {
           matchesType = (t.transactionTypeId === 'adiantamento_fornecedor' || t.transactionTypeId?.includes('adiantamento')) && t.type === 'expense';
        }
        
        // Only show advances that are waiting compensation (pending)
        // If it's completed, it means it has been used/reconciled.
        matchesStatus = t.status === 'pending';
      }

      if (!matchesType || !matchesStatus) return false;

      // Search logic
      const searchLower = searchTerm.toLowerCase();
      return (
        t.description.toLowerCase().includes(searchLower) ||
        (t.customerName && t.customerName.toLowerCase().includes(searchLower)) ||
        (t.orderNumber && t.orderNumber.toLowerCase().includes(searchLower)) ||
        t.value.toString().includes(searchLower)
      );
    });
  }, [transactions, type, transactionType, searchTerm]);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = filteredTransactions.filter(t => selectedIds.includes(t.id));
    onSelect(selected);
  };

  if (!isOpen) return null;

  const title = type === 'payment_receipt' 
    ? (transactionType === 'income' ? 'Buscar Contas a Receber' : 'Buscar Contas a Pagar')
    : (transactionType === 'income' ? 'Buscar Adiantamento de Cliente' : 'Buscar Adiantamento a Fornecedor');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, pedido ou valor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              autoFocus
            />
          </div>

          {/* Results List */}
          <div className="max-h-[300px] overflow-y-auto border border-gray-100 rounded-lg">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle size={32} className="text-gray-300" />
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                  <tr>
                    {type === 'advance' && <th className="px-4 py-2 w-10"></th>}
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Descrição</th>
                    <th className="px-4 py-2 text-right">Valor</th>
                    {type === 'payment_receipt' && <th className="px-4 py-2 text-center">Ação</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map(t => (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(t.id) ? 'bg-emerald-50' : ''}`}
                      onClick={() => type === 'advance' && toggleSelection(t.id)}
                    >
                      {type === 'advance' && (
                        <td className="px-4 py-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedIds.includes(t.id) 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {selectedIds.includes(t.id) && <Check size={12} />}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-500">{t.date.split('-').reverse().join('/')}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{t.customerName || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{t.description}</div>
                        {t.orderNumber && <div className="text-xs text-gray-400">Doc: {t.orderNumber}</div>}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      {type === 'payment_receipt' && (
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(t);
                            }}
                            className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                            title="Selecionar"
                          >
                            <Check size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            {type === 'advance' ? (
              <button 
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check size={16} />
                Confirmar Seleção ({selectedIds.length})
              </button>
            ) : (
              <button 
                onClick={onRegisterNew}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
              >
                Registrar Novo (Sem Vínculo)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
