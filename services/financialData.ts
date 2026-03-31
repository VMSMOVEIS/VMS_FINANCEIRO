import { ModuleId } from '../types';

export interface AccountPlan {
  id: string;
  code: string;
  name: string;
  type: 'ativo' | 'passivo' | 'receita' | 'despesa';
  level?: 'grupo' | 'subgrupo' | 'sintetica' | 'analitica';
}

export interface TransactionType {
  id: string;
  label: string;
  defaultDestination: string;
  defaultType: 'income' | 'expense';
}

// Initial Mock Data for Chart of Accounts - Professional Standard (Marcenaria)
export const defaultAccountPlans: Omit<AccountPlan, 'id'>[] = [
  // 1. ATIVO
  { code: '1', name: 'ATIVO', type: 'ativo', level: 'grupo' },
  { code: '1.1', name: 'Ativo Circulante', type: 'ativo', level: 'subgrupo' },
  { code: '1.1.01', name: 'Caixa e Equivalentes de Caixa', type: 'ativo', level: 'sintetica' },
  { code: '1.1.01.01', name: 'Caixa', type: 'ativo', level: 'analitica' },
  { code: '1.1.01.02', name: 'Banco Conta Corrente', type: 'ativo', level: 'analitica' },
  { code: '1.1.01.03', name: 'Aplicações Financeiras', type: 'ativo', level: 'analitica' },
  { code: '1.1.01.04', name: 'Caixa Loja', type: 'ativo', level: 'analitica' },
  { code: '1.1.02', name: 'Contas a Receber', type: 'ativo', level: 'sintetica' },
  { code: '1.1.02.01', name: 'Clientes', type: 'ativo', level: 'analitica' },
  { code: '1.1.02.02', name: 'Cheques a Receber', type: 'ativo', level: 'analitica' },
  { code: '1.1.02.03', name: 'Cartões a Receber', type: 'ativo', level: 'analitica' },
  { code: '1.1.02.04', name: 'Duplicatas a Receber', type: 'ativo', level: 'analitica' },
  { code: '1.1.03', name: 'Estoques', type: 'ativo', level: 'sintetica' },
  { code: '1.1.03.01', name: 'MDF', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.02', name: 'Ferragens', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.03', name: 'Parafusos', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.04', name: 'Puxadores', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.05', name: 'Corrediças', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.06', name: 'Dobradiças', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.07', name: 'Colas', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.08', name: 'Acabamentos', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.09', name: 'Peças em Produção', type: 'ativo', level: 'analitica' },
  { code: '1.1.03.10', name: 'Produtos Acabados', type: 'ativo', level: 'analitica' },
  { code: '1.1.04', name: 'Outros Créditos', type: 'ativo', level: 'sintetica' },
  { code: '1.1.04.01', name: 'Adiantamento a Funcionários', type: 'ativo', level: 'analitica' },
  { code: '1.1.04.02', name: 'Adiantamento a Fornecedores', type: 'ativo', level: 'analitica' },
  { code: '1.1.04.03', name: 'Impostos a Recuperar', type: 'ativo', level: 'analitica' },
  { code: '1.2', name: 'Ativo Não Circulante', type: 'ativo', level: 'subgrupo' },
  { code: '1.2.01', name: 'Imobilizado', type: 'ativo', level: 'sintetica' },
  { code: '1.2.01.01', name: 'Máquinas de Corte', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.02', name: 'Esquadrejadeira', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.03', name: 'Furadeiras', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.04', name: 'Coladeira de Borda', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.05', name: 'Ferramentas', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.06', name: 'Veículos', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.07', name: 'Computadores', type: 'ativo', level: 'analitica' },
  { code: '1.2.01.08', name: 'Móveis e Utensílios', type: 'ativo', level: 'analitica' },
  { code: '1.2.02', name: 'Depreciação Acumulada', type: 'ativo', level: 'sintetica' },
  { code: '1.2.02.01', name: 'Depreciação Máquinas', type: 'ativo', level: 'analitica' },
  { code: '1.2.02.02', name: 'Depreciação Veículos', type: 'ativo', level: 'analitica' },
  { code: '1.2.02.03', name: 'Depreciação Equipamentos', type: 'ativo', level: 'analitica' },

  // 2. PASSIVO
  { code: '2', name: 'PASSIVO', type: 'passivo', level: 'grupo' },
  { code: '2.1', name: 'Passivo Circulante', type: 'passivo', level: 'subgrupo' },
  { code: '2.1.01', name: 'Fornecedores', type: 'passivo', level: 'sintetica' },
  { code: '2.1.01.01', name: 'Fornecedores MDF', type: 'passivo', level: 'analitica' },
  { code: '2.1.01.02', name: 'Fornecedores Ferragens', type: 'passivo', level: 'analitica' },
  { code: '2.1.01.03', name: 'Fornecedores Ferramentas', type: 'passivo', level: 'analitica' },
  { code: '2.1.02', name: 'Obrigações Trabalhistas', type: 'passivo', level: 'sintetica' },
  { code: '2.1.02.01', name: 'Salários a Pagar', type: 'passivo', level: 'analitica' },
  { code: '2.1.02.02', name: 'FGTS a Recolher', type: 'passivo', level: 'analitica' },
  { code: '2.1.02.03', name: 'INSS a Recolher', type: 'passivo', level: 'analitica' },
  { code: '2.1.02.04', name: 'Férias a Pagar', type: 'passivo', level: 'analitica' },
  { code: '2.1.02.05', name: '13º Salário a Pagar', type: 'passivo', level: 'analitica' },
  { code: '2.1.03', name: 'Obrigações Tributárias', type: 'passivo', level: 'sintetica' },
  { code: '2.1.03.01', name: 'Simples Nacional', type: 'passivo', level: 'analitica' },
  { code: '2.1.03.02', name: 'ICMS', type: 'passivo', level: 'analitica' },
  { code: '2.1.03.03', name: 'ISS', type: 'passivo', level: 'analitica' },
  { code: '2.1.03.04', name: 'PIS', type: 'passivo', level: 'analitica' },
  { code: '2.1.03.05', name: 'COFINS', type: 'passivo', level: 'analitica' },
  { code: '2.1.04', name: 'Empréstimos e Financiamentos', type: 'passivo', level: 'sintetica' },
  { code: '2.1.04.01', name: 'Empréstimo Bancário', type: 'passivo', level: 'analitica' },
  { code: '2.1.04.02', name: 'Financiamento de Máquinas', type: 'passivo', level: 'analitica' },
  { code: '2.1.05', name: 'Adiantamentos de Clientes', type: 'passivo', level: 'sintetica' },
  { code: '2.1.05.01', name: 'Adiantamento de Clientes', type: 'passivo', level: 'analitica' },

  // 3. PATRIMÔNIO LÍQUIDO
  { code: '3', name: 'PATRIMÔNIO LÍQUIDO', type: 'passivo', level: 'grupo' },
  { code: '3.1', name: 'Capital Social', type: 'passivo', level: 'subgrupo' },
  { code: '3.2', name: 'Lucros Acumulados', type: 'passivo', level: 'subgrupo' },
  { code: '3.3', name: 'Prejuízos Acumulados', type: 'passivo', level: 'subgrupo' },
  { code: '3.4', name: 'Reservas', type: 'passivo', level: 'subgrupo' },

  // 4. RECEITAS
  { code: '4', name: 'RECEITAS', type: 'receita', level: 'grupo' },
  { code: '4.1', name: 'Receita Operacional', type: 'receita', level: 'subgrupo' },
  { code: '4.1.01', name: 'Venda de Móveis Sob Medida', type: 'receita', level: 'analitica' },
  { code: '4.1.02', name: 'Venda de Móveis Prontos', type: 'receita', level: 'analitica' },
  { code: '4.1.03', name: 'Serviços de Montagem', type: 'receita', level: 'analitica' },
  { code: '4.1.04', name: 'Serviços de Instalação', type: 'receita', level: 'analitica' },
  { code: '4.2', name: 'Outras Receitas', type: 'receita', level: 'subgrupo' },
  { code: '4.2.01', name: 'Venda de Sucata', type: 'receita', level: 'analitica' },
  { code: '4.2.02', name: 'Descontos Obtidos', type: 'receita', level: 'analitica' },
  { code: '4.2.03', name: 'Receitas Financeiras', type: 'receita', level: 'analitica' },

  // 5. CUSTOS DE PRODUÇÃO
  { code: '5', name: 'CUSTOS DE PRODUÇÃO', type: 'despesa', level: 'grupo' },
  { code: '5.1', name: 'Matéria Prima', type: 'despesa', level: 'subgrupo' },
  { code: '5.1.01', name: 'MDF', type: 'despesa', level: 'analitica' },
  { code: '5.1.02', name: 'Ferragens', type: 'despesa', level: 'analitica' },
  { code: '5.1.03', name: 'Parafusos', type: 'despesa', level: 'analitica' },
  { code: '5.1.04', name: 'Dobradiças', type: 'despesa', level: 'analitica' },
  { code: '5.1.05', name: 'Puxadores', type: 'despesa', level: 'analitica' },
  { code: '5.1.06', name: 'Corrediças', type: 'despesa', level: 'analitica' },
  { code: '5.1.07', name: 'Colas', type: 'despesa', level: 'analitica' },
  { code: '5.1.08', name: 'Acabamentos', type: 'despesa', level: 'analitica' },
  { code: '5.2', name: 'Mão de Obra Direta', type: 'despesa', level: 'subgrupo' },
  { code: '5.2.01', name: 'Salários Produção', type: 'despesa', level: 'analitica' },
  { code: '5.2.02', name: 'Encargos Produção', type: 'despesa', level: 'analitica' },
  { code: '5.3', name: 'Custos Indiretos de Fabricação', type: 'despesa', level: 'subgrupo' },
  { code: '5.3.01', name: 'Energia da Produção', type: 'despesa', level: 'analitica' },
  { code: '5.3.02', name: 'Manutenção de Máquinas', type: 'despesa', level: 'analitica' },
  { code: '5.3.03', name: 'Desgaste de Ferramentas', type: 'despesa', level: 'analitica' },
  { code: '5.3.04', name: 'Materiais de Consumo', type: 'despesa', level: 'analitica' },

  // 6. DESPESAS OPERACIONAIS
  { code: '6', name: 'DESPESAS OPERACIONAIS', type: 'despesa', level: 'grupo' },
  { code: '6.1', name: 'Despesas Administrativas', type: 'despesa', level: 'subgrupo' },
  { code: '6.1.01', name: 'Salários Administrativos', type: 'despesa', level: 'analitica' },
  { code: '6.1.02', name: 'Contabilidade', type: 'despesa', level: 'analitica' },
  { code: '6.1.03', name: 'Internet', type: 'despesa', level: 'analitica' },
  { code: '6.1.04', name: 'Energia Escritório', type: 'despesa', level: 'analitica' },
  { code: '6.1.05', name: 'Aluguel', type: 'despesa', level: 'analitica' },
  { code: '6.1.06', name: 'Material de Escritório', type: 'despesa', level: 'analitica' },
  { code: '6.2', name: 'Despesas Comerciais', type: 'despesa', level: 'subgrupo' },
  { code: '6.2.01', name: 'Marketing', type: 'despesa', level: 'analitica' },
  { code: '6.2.02', name: 'Comissão de Vendas', type: 'despesa', level: 'analitica' },
  { code: '6.2.03', name: 'Fretes de Entrega', type: 'despesa', level: 'analitica' },
  { code: '6.2.04', name: 'Combustível', type: 'despesa', level: 'analitica' },
  { code: '6.3', name: 'Despesas Financeiras', type: 'despesa', level: 'subgrupo' },
  { code: '6.3.01', name: 'Juros Bancários', type: 'despesa', level: 'analitica' },
  { code: '6.3.02', name: 'Tarifas Bancárias', type: 'despesa', level: 'analitica' },
  { code: '6.3.03', name: 'Juros de Empréstimos', type: 'despesa', level: 'analitica' },
];

let accountPlans: AccountPlan[] = defaultAccountPlans.map((p, i) => ({ ...p, id: `def-${i}` }));

export const transactionTypes: TransactionType[] = [
  { id: 'pagamento', label: 'Pagamento', defaultDestination: 'Fluxo de Caixa', defaultType: 'expense' },
  { id: 'recebimento', label: 'Recebimento', defaultDestination: 'Fluxo de Caixa', defaultType: 'income' },
  { id: 'venda', label: 'Venda', defaultDestination: 'Fluxo de Caixa', defaultType: 'income' },
  { id: 'compra', label: 'Compra', defaultDestination: 'Fluxo de Caixa', defaultType: 'expense' },
  { id: 'adiantamento_cliente', label: 'Adiantamento de Cliente', defaultDestination: 'Fluxo de Caixa', defaultType: 'income' },
  { id: 'adiantamento_fornecedor', label: 'Adiantamento a Fornecedor', defaultDestination: 'Fluxo de Caixa', defaultType: 'expense' },
  { id: 'transferencia', label: 'Transferência', defaultDestination: 'Tesouraria', defaultType: 'expense' },
  { id: 'duplicata_receber', label: 'Contas a receber', defaultDestination: 'Contas a Receber', defaultType: 'income' },
  { id: 'duplicata_pagar', label: 'Contas a pagar', defaultDestination: 'Contas a Pagar', defaultType: 'expense' },
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
