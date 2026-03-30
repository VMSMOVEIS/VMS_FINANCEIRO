import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, CreditCard, Building, Landmark, Plus, Trash2, Save, Edit2, X, Check } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { Account, PaymentMethod, UserProfile, CompanyProfile } from '../types';
import { formatCPF, formatCNPJ, formatPhone, formatCEP } from '../src/lib/formatters';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bancos');
  const { 
    accounts, 
    addAccount, 
    updateAccount,
    deleteAccount, 
    paymentMethods, 
    addPaymentMethod, 
    updatePaymentMethod,
    deletePaymentMethod,
    accountPlans,
    userProfile,
    updateUserProfile,
    companyProfile,
    updateCompanyProfile,
    notificationSettings: contextNotificationSettings,
    updateNotificationSettings
  } = useTransactions();

  // Profile State
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  
  // Company State
  const [companyForm, setCompanyForm] = useState<CompanyProfile>(companyProfile);

  // Security State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Notifications State
  const [notificationSettings, setNotificationSettings] = useState(contextNotificationSettings);

  // Banks State
  const [newAccount, setNewAccount] = useState<Partial<Account>>({ name: '', type: 'bank', balance: 0 });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingAccountForm, setEditingAccountForm] = useState<Partial<Account>>({});

  // Payment Methods State
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({ name: '', type: 'pix', defaultAccountId: '' });
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);
  const [editingMethodForm, setEditingMethodForm] = useState<Partial<PaymentMethod>>({});

  // Update local forms when context changes
  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  useEffect(() => {
    setCompanyForm(companyProfile);
  }, [companyProfile]);

  useEffect(() => {
    setNotificationSettings(contextNotificationSettings);
  }, [contextNotificationSettings]);

  const handleSaveProfile = () => {
    updateUserProfile(profileForm);
    alert('Perfil atualizado com sucesso!');
  };

  const handleSaveCompany = () => {
    updateCompanyProfile(companyForm);
    alert('Dados da empresa atualizados com sucesso!');
  };

  const handleSaveSecurity = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Mock password update
    alert('Configurações de segurança atualizadas!');
    setSecurityForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleSaveNotifications = () => {
    updateNotificationSettings(notificationSettings);
    alert('Preferências de notificação salvas!');
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name) {
      addAccount({
        name: newAccount.name,
        type: newAccount.type as any,
        balance: Number(newAccount.balance) || 0,
        bank: newAccount.bank,
        color: newAccount.color,
        accountPlanId: newAccount.accountPlanId,
        accountPlanName: newAccount.accountPlanName,
        accountPlanCode: newAccount.accountPlanCode
      });
      setNewAccount({ name: '', type: 'bank', balance: 0, bank: '', color: '#10B981', accountPlanId: '', accountPlanName: '', accountPlanCode: '' });
    }
  };

  const startEditingAccount = (account: Account) => {
    setEditingAccountId(account.id);
    setEditingAccountForm(account);
  };

  const cancelEditingAccount = () => {
    setEditingAccountId(null);
    setEditingAccountForm({});
  };

  const saveEditingAccount = () => {
    if (editingAccountId && editingAccountForm.name) {
      updateAccount(editingAccountId, editingAccountForm);
      setEditingAccountId(null);
      setEditingAccountForm({});
    }
  };

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMethod.name && newMethod.defaultAccountId) {
      addPaymentMethod({
        name: newMethod.name,
        type: newMethod.type as any,
        defaultAccountId: newMethod.defaultAccountId
      });
      setNewMethod({ name: '', type: 'pix', defaultAccountId: '' });
    }
  };

  const startEditingMethod = (method: PaymentMethod) => {
    setEditingMethodId(method.id);
    setEditingMethodForm(method);
  };

  const cancelEditingMethod = () => {
    setEditingMethodId(null);
    setEditingMethodForm({});
  };

  const saveEditingMethod = () => {
    if (editingMethodId && editingMethodForm.name) {
      updatePaymentMethod(editingMethodId, editingMethodForm);
      setEditingMethodId(null);
      setEditingMethodForm({});
    }
  };

  const tabs = [
    { id: 'perfil', icon: User, label: 'Perfil' },
    { id: 'empresa', icon: Building, label: 'Empresa' },
    { id: 'financeiro', icon: Landmark, label: 'Financeiro' },
    { id: 'seguranca', icon: Lock, label: 'Segurança' },
    { id: 'notificacoes', icon: Bell, label: 'Notificações' },
    { id: 'faturamento', icon: CreditCard, label: 'Faturamento' },
    { id: 'integracoes', icon: SettingsIcon, label: 'Integrações' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-500">Gerencie preferências e parâmetros do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <ul className="space-y-1">
            {tabs.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-6">
          {/* PERFIL TAB */}
          {activeTab === 'perfil' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={profileForm.name}
                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={profileForm.email}
                    onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={profileForm.role}
                    onChange={e => setProfileForm({...profileForm, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={profileForm.phone}
                    onChange={e => setProfileForm({...profileForm, phone: formatPhone(e.target.value)})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* EMPRESA TAB */}
          {activeTab === 'empresa' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.name}
                    onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.cnpj}
                    onChange={e => setCompanyForm({...companyForm, cnpj: formatCNPJ(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.email}
                    onChange={e => setCompanyForm({...companyForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.phone}
                    onChange={e => setCompanyForm({...companyForm, phone: formatPhone(e.target.value)})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.address}
                    onChange={e => setCompanyForm({...companyForm, address: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    value={companyForm.logo || ''}
                    onChange={e => setCompanyForm({...companyForm, logo: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveCompany}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Salvar Dados
                </button>
              </div>
            </div>
          )}

          {/* FINANCEIRO TAB */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6">
              {/* Contas Bancárias Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contas Bancárias / Caixas</h3>
                
                <div className="space-y-4 mb-6">
                  {accounts.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {editingAccountId === acc.id ? (
                        /* EDIT MODE */
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-1">
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              value={editingAccountForm.name || ''}
                              onChange={e => setEditingAccountForm({...editingAccountForm, name: e.target.value})}
                              placeholder="Nome"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              value={editingAccountForm.bank || ''}
                              onChange={e => setEditingAccountForm({...editingAccountForm, bank: e.target.value})}
                              placeholder="Banco"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <select 
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              value={editingAccountForm.accountPlanId || ''}
                              onChange={e => {
                                const plan = accountPlans.find(p => p.id === e.target.value);
                                setEditingAccountForm({
                                  ...editingAccountForm, 
                                  accountPlanId: e.target.value,
                                  accountPlanName: plan?.name,
                                  accountPlanCode: plan?.code
                                });
                              }}
                            >
                              <option value="">Tipo de conta...</option>
                              {accountPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.code} - {plan.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-1">
                            <input 
                              type="number" 
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                              value={editingAccountForm.balance || editingAccountForm.balance === 0 ? editingAccountForm.balance : ''}
                              onChange={e => setEditingAccountForm({...editingAccountForm, balance: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={saveEditingAccount} className="text-emerald-600 hover:text-emerald-800 p-1">
                              <Check size={18} />
                            </button>
                            <button onClick={cancelEditingAccount} className="text-gray-500 hover:text-gray-700 p-1">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE */
                        <>
                          <div>
                            <p className="font-medium text-gray-900">{acc.name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {acc.type} {acc.bank ? `- ${acc.bank}` : ''} 
                              {acc.accountPlanName ? ` (${acc.accountPlanName})` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => startEditingAccount(acc)} className="text-blue-500 hover:text-blue-700 p-1">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => deleteAccount(acc.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome da Conta</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Nubank Principal"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newAccount.name}
                      onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Banco (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Nubank"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newAccount.bank || ''}
                      onChange={e => setNewAccount({...newAccount, bank: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de conta</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newAccount.accountPlanId || ''}
                      onChange={e => {
                        const plan = accountPlans.find(p => p.id === e.target.value);
                        setNewAccount({
                          ...newAccount, 
                          accountPlanId: e.target.value,
                          accountPlanName: plan?.name,
                          accountPlanCode: plan?.code
                        });
                      }}
                    >
                      <option value="">Selecione...</option>
                      {accountPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.code} - {plan.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newAccount.type}
                      onChange={e => setNewAccount({...newAccount, type: e.target.value as any})}
                    >
                      <option value="bank">Conta Corrente</option>
                      <option value="cash">Caixa Físico</option>
                      <option value="investment">Investimento</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cor</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        className="h-9 w-full border border-gray-300 rounded-lg cursor-pointer p-1"
                        value={newAccount.color || '#10B981'}
                        onChange={e => setNewAccount({...newAccount, color: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar
                  </button>
                </form>
              </div>

              {/* Formas de Pagamento Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Formas de Pagamento Personalizadas</h3>
                <p className="text-sm text-gray-500 mb-4">Crie opções de pagamento e vincule-as a uma conta específica para facilitar os lançamentos.</p>

                <div className="space-y-4 mb-6">
                  {paymentMethods.map(pm => {
                    const linkedAccount = accounts.find(a => a.id === pm.defaultAccountId);
                    return (
                      <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {editingMethodId === pm.id ? (
                          /* EDIT MODE */
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                value={editingMethodForm.name || ''}
                                onChange={e => setEditingMethodForm({...editingMethodForm, name: e.target.value})}
                                placeholder="Nome"
                              />
                            </div>
                            <div>
                              <select 
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                value={editingMethodForm.defaultAccountId || ''}
                                onChange={e => setEditingMethodForm({...editingMethodForm, defaultAccountId: e.target.value})}
                              >
                                <option value="">Selecione a conta...</option>
                                {accounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={saveEditingMethod} className="text-emerald-600 hover:text-emerald-800 p-1">
                                <Check size={18} />
                              </button>
                              <button onClick={cancelEditingMethod} className="text-gray-500 hover:text-gray-700 p-1">
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* VIEW MODE */
                          <>
                            <div>
                              <p className="font-medium text-gray-900">{pm.name}</p>
                              <p className="text-xs text-gray-500">Tipo: {pm.type}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">
                                Conta: {linkedAccount?.name || 'Não vinculada'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => startEditingMethod(pm)} className="text-blue-500 hover:text-blue-700 p-1">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => deletePaymentMethod(pm.id)} className="text-red-500 hover:text-red-700 p-1">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleAddMethod} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome (Ex: Pix Nubank)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nome exibido no lançamento"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newMethod.name}
                      onChange={e => setNewMethod({...newMethod, name: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo Real</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={newMethod.type}
                      onChange={e => setNewMethod({...newMethod, type: e.target.value as any})}
                    >
                      <option value="pix">Pix</option>
                      <option value="boleto">Boleto</option>
                      <option value="credit_card">Cartão de Crédito</option>
                      <option value="debit_card">Cartão de Débito</option>
                      <option value="transfer">Transferência</option>
                      <option value="cash">Dinheiro</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Conta Vinculada</label>
                    <select 
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={newMethod.defaultAccountId}
                      onChange={e => setNewMethod({...newMethod, defaultAccountId: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SEGURANÇA TAB */}
          {activeTab === 'seguranca' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Segurança da Conta</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Alterar Senha</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Senha Atual</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={securityForm.currentPassword}
                        onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nova Senha</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={securityForm.newPassword}
                        onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={securityForm.confirmPassword}
                        onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Autenticação em Dois Fatores (2FA)</h4>
                      <p className="text-xs text-gray-500">Adicione uma camada extra de segurança à sua conta.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={securityForm.twoFactorEnabled}
                        onChange={e => setSecurityForm({...securityForm, twoFactorEnabled: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSaveSecurity}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Atualizar Segurança
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICAÇÕES TAB */}
          {activeTab === 'notificacoes' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Preferências de Notificação</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Alertas de Vencimento</h4>
                    <p className="text-xs text-gray-500">Receba alertas sobre contas a pagar e receber próximas do vencimento.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.dueDateAlert}
                      onChange={e => setNotificationSettings({...notificationSettings, dueDateAlert: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {notificationSettings.dueDateAlert && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alertar com quantos dias de antecedência?</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1" 
                        max="30"
                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={notificationSettings.alertDaysBefore}
                        onChange={e => setNotificationSettings({...notificationSettings, alertDaysBefore: Number(e.target.value)})}
                      />
                      <span className="text-sm text-gray-600">dias antes do vencimento</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
                    <p className="text-xs text-gray-500">Receba resumos semanais e alertas importantes por email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.emailAlerts}
                      onChange={e => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSaveNotifications}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Salvar Preferências
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FATURAMENTO TAB */}
          {activeTab === 'faturamento' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Plano e Faturamento</h3>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center">
                <h4 className="text-xl font-bold text-emerald-800 mb-2">Plano Enterprise</h4>
                <p className="text-emerald-600 mb-4">Sua assinatura está ativa e válida até 31/12/2026.</p>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Gerenciar Assinatura
                </button>
              </div>
            </div>
          )}

          {/* INTEGRAÇÕES TAB */}
          {activeTab === 'integracoes' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Integrações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">N</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Nota Fiscal Eletrônica</h4>
                      <p className="text-xs text-gray-500">Integração com SEFAZ para emissão de NF-e.</p>
                    </div>
                  </div>
                  <button className="text-emerald-600 text-sm font-medium hover:underline">Configurar</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">B</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Bancos (Open Finance)</h4>
                      <p className="text-xs text-gray-500">Conecte suas contas bancárias automaticamente.</p>
                    </div>
                  </div>
                  <button className="text-emerald-600 text-sm font-medium hover:underline">Conectar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
