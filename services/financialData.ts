import { ModuleId } from '../types';

export interface AccountPlan {
  id: string;
  code: string;
  name: string;
  type: 'ativo' | 'passivo' | 'receita' | 'despesa';
}

export interface TransactionType {
  id: string;
  label: string;
  defaultDestination: string;
  defaultType: 'income' | 'expense';
}

// Initial Mock Data for Chart of Accounts - Professional Standard
export const defaultAccountPlans: Omit<AccountPlan, 'id'>[] = [
  // 1. ATIVOS
  { code: '1', name: 'ATIVO', type: 'ativo' },
  { code: '1.1', name: 'ATIVO CIRCULANTE', type: 'ativo' },
  { code: '1.1.01', name: 'Caixa e Equivalentes de Caixa', type: 'ativo' },
  { code: '1.1.02', name: 'Contas a Receber', type: 'ativo' },
  { code: '1.1.03', name: 'Estoques', type: 'ativo' },
  { code: '1.2', name: 'ATIVO NÃO CIRCULANTE', type: 'ativo' },
  { code: '1.2.01', name: 'Imobilizado', type: 'ativo' },
  { code: '1.2.02', name: 'Intangível', type: 'ativo' },
  
  // 2. PASSIVOS E PL
  { code: '2', name: 'PASSIVO E PATRIMÔNIO LÍQUIDO', type: 'passivo' },
  { code: '2.1', name: 'PASSIVO CIRCULANTE', type: 'passivo' },
  { code: '2.1.01', name: 'Fornecedores', type: 'passivo' },
  { code: '2.1.02', name: 'Obrigações Trabalhistas', type: 'passivo' },
  { code: '2.1.03', name: 'Obrigações Tributárias', type: 'passivo' },
  { code: '2.2', name: 'PASSIVO NÃO CIRCULANTE', type: 'passivo' },
  { code: '2.2.01', name: 'Empréstimos e Financiamentos', type: 'passivo' },
  { code: '2.3', name: 'PATRIMÔNIO LÍQUIDO', type: 'passivo' },
  { code: '2.3.01', name: 'Capital Social', type: 'passivo' },
  { code: '2.3.02', name: 'Reservas de Lucros', type: 'passivo' },

  // 3. RECEITAS
  { code: '3', name: 'RECEITAS', type: 'receita' },
  { code: '3.1', name: 'RECEITA OPERACIONAL BRUTA', type: 'receita' },
  { code: '3.1.01', name: 'Venda de Mercadorias', type: 'receita' },
  { code: '3.1.02', name: 'Prestação de Serviços', type: 'receita' },
  { code: '3.2', name: 'OUTRAS RECEITAS', type: 'receita' },
  { code: '3.2.01', name: 'Receitas Financeiras', type: 'receita' },
  
  // 4. CUSTOS E DESPESAS
  { code: '4', name: 'CUSTOS E DESPESAS', type: 'despesa' },
  { code: '4.1', name: 'CUSTOS DAS VENDAS E SERVIÇOS', type: 'despesa' },
  { code: '4.1.01', name: 'Custo das Mercadorias Vendidas', type: 'despesa' },
  { code: '4.2', name: 'DESPESAS OPERACIONAIS', type: 'despesa' },
  { code: '4.2.01', name: 'Despesas com Pessoal', type: 'despesa' },
  { code: '4.2.02', name: 'Despesas Administrativas', type: 'despesa' },
  { code: '4.2.03', name: 'Despesas Tributárias', type: 'despesa' },
  { code: '4.2.04', name: 'Despesas Financeiras', type: 'despesa' },
];

let accountPlans: AccountPlan[] = defaultAccountPlans.map((p, i) => ({ ...p, id: `def-${i}` }));

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
