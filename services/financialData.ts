import { ModuleId } from '../types';

export interface AccountPlan {
  id: string;
  code: string;
  name: string;
  type: 'receita' | 'despesa';
  parent?: string;
}

export interface TransactionType {
  id: string;
  label: string;
  defaultDestination: string;
  defaultType: 'income' | 'expense';
}

// Initial Mock Data for Chart of Accounts
let accountPlans: AccountPlan[] = [
  // Receitas
  { id: '1', code: '1.01', name: 'Receita de Vendas', type: 'receita' },
  { id: '2', code: '1.02', name: 'Receita de Serviços', type: 'receita' },
  { id: '3', code: '1.03', name: 'Rendimentos Financeiros', type: 'receita' },
  { id: '4', code: '1.04', name: 'Outras Receitas', type: 'receita' },
  
  // Despesas
  { id: '5', code: '2.01', name: 'Custos de Mercadoria', type: 'despesa' },
  { id: '6', code: '2.02', name: 'Despesas com Pessoal', type: 'despesa' },
  { id: '7', code: '2.03', name: 'Despesas Administrativas', type: 'despesa' },
  { id: '8', code: '2.04', name: 'Impostos e Taxas', type: 'despesa' },
  { id: '9', code: '2.05', name: 'Marketing e Publicidade', type: 'despesa' },
  { id: '10', code: '2.06', name: 'Infraestrutura e Aluguel', type: 'despesa' },
];

export const transactionTypes: TransactionType[] = [
  { id: 'compra', label: 'Compra', defaultDestination: 'Contas a Pagar', defaultType: 'expense' },
  { id: 'venda', label: 'Venda', defaultDestination: 'Contas a Receber', defaultType: 'income' },
  { id: 'pagamento', label: 'Pagamento', defaultDestination: 'Fluxo de Caixa', defaultType: 'expense' },
  { id: 'recebimento', label: 'Recebimento', defaultDestination: 'Fluxo de Caixa', defaultType: 'income' },
  { id: 'adiantamento_cliente', label: 'Adiantamento de Cliente', defaultDestination: 'Fluxo de Caixa', defaultType: 'income' },
  { id: 'adiantamento_fornecedor', label: 'Adiantamento a Fornecedor', defaultDestination: 'Fluxo de Caixa', defaultType: 'expense' },
  { id: 'transferencia', label: 'Transferência', defaultDestination: 'Tesouraria', defaultType: 'expense' },
  { id: 'duplicata_receber', label: 'Duplicatas ou promissórias a receber', defaultDestination: 'Contas a Receber', defaultType: 'income' },
  { id: 'duplicata_pagar', label: 'Duplicatas ou promissórias a pagar', defaultDestination: 'Contas a Pagar', defaultType: 'expense' },
];

// Service methods to simulate API calls
export const getAccountPlans = () => [...accountPlans];

export const addAccountPlan = (account: Omit<AccountPlan, 'id'>) => {
  const newAccount = { ...account, id: Date.now().toString() };
  accountPlans = [...accountPlans, newAccount];
  return newAccount;
};

export const removeAccountPlan = (id: string) => {
  accountPlans = accountPlans.filter(a => a.id !== id);
};

export const getTransactionTypes = () => transactionTypes;
