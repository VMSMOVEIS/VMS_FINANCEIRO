import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Account, PaymentMethod, UserProfile, CompanyProfile } from '../../types';

interface TransactionContextType {
  transactions: Transaction[];
  accounts: Account[];
  paymentMethods: PaymentMethod[];
  userProfile: UserProfile;
  companyProfile: CompanyProfile;
  isModalOpen: boolean;
  editingTransaction: Transaction | null;
  openModal: (transaction?: Transaction) => void;
  closeModal: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ricardo Silva',
    email: 'ricardo.silva@empresa.com.br',
    role: 'Gerente Financeiro',
    phone: '(11) 99999-9999',
    avatar: 'RS'
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'Móveis & Design Ltda.',
    cnpj: '12.345.678/0001-90',
    email: 'contato@moveisedesign.com.br',
    phone: '(11) 3333-4444',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 1, 
      date: '2026-02-27', 
      description: 'Venda de Consultoria', 
      category: 'Receita de Serviços', 
      value: 15000, 
      type: 'income', 
      transactionTypeId: 'venda', 
      documentType: 'NF-e',
      orderNumber: 'PED-001',
      status: 'pending',
      payments: [
        { id: 'p1', method: 'boleto', value: 15000, dueDate: '2026-03-15', destination: 'Contas a Receber', status: 'pending' }
      ]
    },
  ]);

  const [accounts, setAccounts] = useState<Account[]>([
    { id: 'acc-1', name: 'Caixa', type: 'cash', balance: 1500 },
    { id: 'acc-2', name: 'Nubank', bank: 'Nubank', type: 'bank', balance: 12500 },
    { id: 'acc-3', name: 'Inter', bank: 'Banco Inter', type: 'bank', balance: 5000 },
    { id: 'acc-4', name: 'Bradesco', bank: 'Bradesco', type: 'bank', balance: 25000 },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm-1', name: 'Dinheiro', type: 'cash', defaultAccountId: 'acc-1' },
    { id: 'pm-2', name: 'Pix Nubank', type: 'pix', defaultAccountId: 'acc-2' },
    { id: 'pm-3', name: 'Pix Inter', type: 'pix', defaultAccountId: 'acc-3' },
    { id: 'pm-4', name: 'Boleto Bradesco', type: 'boleto', defaultAccountId: 'acc-4' },
    { id: 'pm-5', name: 'Cartão Crédito Nubank', type: 'credit_card', defaultAccountId: 'acc-2' },
    { id: 'pm-6', name: 'Transferência Inter', type: 'transfer', defaultAccountId: 'acc-3' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const openModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = (id: number, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = (id: string, updatedAccount: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updatedAccount } : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
  };

  const updatePaymentMethod = (id: string, updatedMethod: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, ...updatedMethod } : m));
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      accounts, 
      paymentMethods,
      userProfile,
      companyProfile,
      isModalOpen,
      editingTransaction,
      openModal,
      closeModal,
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      addAccount,
      updateAccount,
      deleteAccount,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      updateUserProfile,
      updateCompanyProfile
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
