import React, { useState, useMemo } from 'react';
import { Search, X, Check, AlertCircle } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { Transaction, Payment } from '../types';

interface SearchTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment_receipt' | 'advance';
  transactionType: 'income' | 'expense'; // The context of the current operation
  onSelect: (result: any) => void;
  onRegisterNew: () => void;
}

interface SearchableItem {
    id: string | number;
    date: string;
    description: string;
    customerName: string;
    orderNumber: string;
    value: number;
    originalTransaction: Transaction;
    paymentId?: string; // Only for payments
    isPayment: boolean;
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
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const filteredItems = useMemo(() => {
    let items: SearchableItem[] = [];

    if (type === 'payment_receipt') {
        // Flatten transactions into pending payments
        transactions.forEach(t => {
            // Filter by type (Income/Expense) and exclude advances
            if (t.type === transactionType && !t.transactionTypeId?.includes('adiantamento')) {
                t.payments.forEach((p, index) => {
                    if (p.status !== 'completed') {
                        items.push({
                            id: p.id,
                            paymentId: p.id,
                            date: p.dueDate,
                            description: `${t.description} ${t.payments.length > 1 ? `(${index + 1}/${t.payments.length})` : ''}`,
                            customerName: t.customerName || '-',
                            orderNumber: t.orderNumber || t.documentType || '-',
                            value: p.value,
                            originalTransaction: t,
                            isPayment: true
                        });
                    }
                });
            }
        });
    } else if (type === 'advance') {
        // List transactions that are advances and pending
        transactions.forEach(t => {
            let matchesType = false;
            if (transactionType === 'income') {
                matchesType = (t.transactionTypeId === 'adiantamento_cliente' || t.transactionTypeId?.includes('adiantamento')) && t.type === 'income';
            } else {
                matchesType = (t.transactionTypeId === 'adiantamento_fornecedor' || t.transactionTypeId?.includes('adiantamento')) && t.type === 'expense';
            }

            if (matchesType && (t.status === 'pending' || t.status === 'a_compensar')) {
                items.push({
                    id: t.id,
                    date: t.date,
                    description: t.description,
                    customerName: t.customerName || '-',
                    orderNumber: t.orderNumber || t.documentType || '-',
                    value: t.value,
                    originalTransaction: t,
                    isPayment: false
                });
            }
        });
    }

    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return items.filter(item => 
        item.description.toLowerCase().includes(searchLower) ||
        item.customerName.toLowerCase().includes(searchLower) ||
        item.orderNumber.toLowerCase().includes(searchLower) ||
        item.value.toString().includes(searchLower)
    );

  }, [transactions, type, transactionType, searchTerm]);

  const toggleSelection = (id: string | number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = filteredItems.filter(item => selectedIds.includes(item.id));
    // If it's advance, we return array of transactions (mapped from items)
    // If it's payment, we return the item itself (which contains paymentId)
    if (type === 'advance') {
        onSelect(selected.map(i => i.originalTransaction));
    } else {
        onSelect(selected[0]); // Single selection for payment
    }
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
              placeholder="Buscar por nome, descrição ou valor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
            />
          </div>

          {/* Results List */}
          <div className="max-h-[300px] overflow-y-auto border border-gray-100 rounded-lg">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle size={32} className="text-gray-300" />
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                  <tr>
                    {type === 'advance' && <th className="px-4 py-2 w-10"></th>}
                    <th className="px-4 py-2">Vencimento</th>
                    <th className="px-4 py-2">Nº Doc</th>
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Descrição</th>
                    <th className="px-4 py-2 text-right">Valor</th>
                    {type === 'payment_receipt' && <th className="px-4 py-2 text-center">Ação</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => type === 'advance' && toggleSelection(item.id)}
                    >
                      {type === 'advance' && (
                        <td className="px-4 py-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedIds.includes(item.id) 
                              ? 'bg-blue-500 border-blue-500 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {selectedIds.includes(item.id) && <Check size={12} />}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-500">{item.date.split('-').reverse().join('/')}</td>
                      <td className="px-4 py-3 text-gray-500">{item.orderNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.customerName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{item.description}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      {type === 'payment_receipt' && (
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(item);
                            }}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
