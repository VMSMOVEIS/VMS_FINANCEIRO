import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Account, PaymentMethod, UserProfile, CompanyProfile, Payment } from '../../types';
import { supabase } from '../lib/supabase';
import { AccountPlan } from '../../services/financialData';

interface TransactionContextType {
  transactions: Transaction[];
  accounts: Account[];
  paymentMethods: PaymentMethod[];
  accountPlans: AccountPlan[];
  userProfile: UserProfile;
  companyProfile: CompanyProfile;
  isModalOpen: boolean;
  editingTransaction: Transaction | null;
  isLoading: boolean;
  openModal: (transaction?: Transaction) => void;
  closeModal: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  addAccountPlan: (plan: Omit<AccountPlan, 'id'>) => Promise<void>;
  updateAccountPlan: (id: string, plan: Partial<AccountPlan>) => Promise<void>;
  deleteAccountPlan: (id: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [accountPlans, setAccountPlans] = useState<AccountPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*');
      if (accountsError) throw accountsError;
      setAccounts(accountsData.map(a => ({
        id: a.id,
        name: a.name,
        bank: a.bank,
        accountNumber: a.account_number,
        type: a.type,
        balance: Number(a.balance)
      })));

      // Fetch Payment Methods
      const { data: pmData, error: pmError } = await supabase
        .from('payment_methods')
        .select('*');
      if (pmError) throw pmError;
      setPaymentMethods(pmData.map(pm => ({
        id: pm.id,
        name: pm.name,
        type: pm.type,
        defaultAccountId: pm.default_account_id
      })));

      // Fetch Account Plans
      const { data: plansData, error: plansError } = await supabase
        .from('account_plans')
        .select('*');
      if (plansError) throw plansError;
      setAccountPlans(plansData.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        type: p.type as 'receita' | 'despesa'
      })));

      // Fetch Transactions with Payments
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select(`
          *,
          payments (*)
        `)
        .order('date', { ascending: false });
      
      if (transError) throw transError;
      
      setTransactions(transData.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        category: t.category,
        value: Number(t.value),
        type: t.type,
        transactionTypeId: t.transaction_type_id,
        documentType: t.document_type,
        orderNumber: t.order_number,
        customerName: t.customer_name,
        status: t.status,
        payments: t.payments.map((p: any) => ({
          id: p.id,
          method: p.method,
          value: Number(p.value),
          dueDate: p.due_date,
          bankId: p.bank_id,
          destination: p.destination,
          source: p.source,
          status: p.status
        }))
      })));

    } catch (error: any) {
      console.error('Error fetching data from Supabase:', error);
      if (error.message === 'Failed to fetch' || error.message?.includes('TypeError')) {
        alert('Erro de conexão com o Supabase. Verifique se a URL no Vercel está correta e se o projeto não está pausado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
    } else {
      setEditingTransaction(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!supabase) return;
    try {
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert([{
          date: transaction.date,
          description: transaction.description,
          category: transaction.category,
          value: transaction.value,
          type: transaction.type,
          transaction_type_id: transaction.transactionTypeId,
          document_type: transaction.documentType,
          order_number: transaction.orderNumber,
          customer_name: transaction.customerName,
          status: transaction.status
        }])
        .select()
        .single();

      if (transError) throw transError;

      if (transaction.payments && transaction.payments.length > 0) {
        const { error: payError } = await supabase
          .from('payments')
          .insert(transaction.payments.map(p => ({
            transaction_id: transData.id,
            method: p.method,
            value: p.value,
            due_date: p.dueDate,
            bank_id: p.bankId,
            destination: p.destination,
            source: p.source,
            status: p.status
          })));
        
        if (payError) throw payError;
      }

      await fetchData();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      alert(`Erro ao salvar lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const updateTransaction = async (id: number, updatedTransaction: Partial<Transaction>) => {
    if (!supabase) return;
    try {
      // 1. Update the transaction record
      const { error: transError } = await supabase
        .from('transactions')
        .update({
          date: updatedTransaction.date,
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          value: updatedTransaction.value,
          type: updatedTransaction.type,
          transaction_type_id: updatedTransaction.transactionTypeId,
          document_type: updatedTransaction.documentType,
          order_number: updatedTransaction.orderNumber,
          customer_name: updatedTransaction.customerName,
          status: updatedTransaction.status
        })
        .eq('id', id);

      if (transError) throw transError;

      // 2. Update payments: Delete existing and insert new ones
      // This is the most reliable way to sync a list of related items
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('transaction_id', id);
      
      if (deleteError) throw deleteError;

      if (updatedTransaction.payments && updatedTransaction.payments.length > 0) {
        const { error: insertError } = await supabase
          .from('payments')
          .insert(updatedTransaction.payments.map(p => ({
            transaction_id: id,
            method: p.method,
            value: p.value,
            due_date: p.dueDate,
            bank_id: p.bankId,
            destination: p.destination,
            source: p.source,
            status: p.status
          })));
        
        if (insertError) throw insertError;
      }

      await fetchData();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      alert(`Erro ao atualizar lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const deleteTransaction = async (id: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      alert(`Erro ao excluir lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('accounts')
        .insert([{
          name: account.name,
          bank: account.bank,
          account_number: account.accountNumber,
          type: account.type,
          balance: account.balance
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding account:', error);
      alert(`Erro ao adicionar conta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const updateAccount = async (id: string, updatedAccount: Partial<Account>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('accounts')
        .update({
          name: updatedAccount.name,
          bank: updatedAccount.bank,
          account_number: updatedAccount.accountNumber,
          type: updatedAccount.type,
          balance: updatedAccount.balance
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          name: method.name,
          type: method.type,
          default_account_id: method.defaultAccountId
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const updatePaymentMethod = async (id: string, updatedMethod: Partial<PaymentMethod>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          name: updatedMethod.name,
          type: updatedMethod.type,
          default_account_id: updatedMethod.defaultAccountId
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const addAccountPlan = async (plan: Omit<AccountPlan, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .insert([{
          code: plan.code,
          name: plan.name,
          type: plan.type
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding account plan:', error);
    }
  };

  const updateAccountPlan = async (id: string, plan: Partial<AccountPlan>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .update({
          code: plan.code,
          name: plan.name,
          type: plan.type
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating account plan:', error);
    }
  };

  const deleteAccountPlan = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting account plan:', error);
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    // In a real app, this would update the 'profiles' table
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const updateCompanyProfile = async (profile: Partial<CompanyProfile>) => {
    // In a real app, this would update the 'companies' table
    setCompanyProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      accounts, 
      paymentMethods,
      accountPlans,
      userProfile,
      companyProfile,
      isModalOpen,
      editingTransaction,
      isLoading,
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
      addAccountPlan,
      updateAccountPlan,
      deleteAccountPlan,
      updateUserProfile,
      updateCompanyProfile,
      refreshData: fetchData
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
