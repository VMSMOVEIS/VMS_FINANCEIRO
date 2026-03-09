import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Download,
  Upload,
  Briefcase,
  DollarSign,
  UserCheck,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Employee, EmployeeDocument } from '../types';
import { useEmployees } from '../src/context/EmployeeContext';

interface EmployeeManagementProps {
  activeSubItem?: string | null;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ activeSubItem }) => {
  const { employees, jobRoles, addEmployee, updateEmployee, deleteEmployee, addDocument, removeDocument } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'docs'>('list');
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.id === selectedEmployeeId) || null
  , [employees, selectedEmployeeId]);

  // Handle sub-items from sidebar
  React.useEffect(() => {
    if (activeSubItem === 'func_lista') {
      setViewMode('list');
      setIsModalOpen(false);
      setSelectedEmployeeId(null);
    } else if (activeSubItem === 'func_cad') {
      setViewMode('list');
      resetForm();
      setIsModalOpen(true);
    } else if (activeSubItem === 'func_doc') {
      setViewMode('docs');
      setIsModalOpen(false);
      setSelectedEmployeeId(null);
    }
  }, [activeSubItem]);

  // Form state for add/edit
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'documents'>>({
    name: '',
    role: '',
    department: 'TI',
    workSchedule: '08:00 - 12:00, 13:00 - 17:00',
    shiftId: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: 'M',
    maritalStatus: 'Solteiro(a)',
    admissionDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'active',
    education: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bankInfo: {
      bank: '',
      agency: '',
      account: '',
      type: 'corrente',
      pixKey: ''
    },
    benefits: []
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const handleEdit = (emp: Employee) => {
    setSelectedEmployeeId(emp.id);
    setFormData({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      workSchedule: emp.workSchedule,
      shiftId: emp.shiftId || '',
      email: emp.email,
      phone: emp.phone,
      cpf: emp.cpf,
      rg: emp.rg || '',
      birthDate: emp.birthDate || '',
      gender: emp.gender || 'M',
      maritalStatus: emp.maritalStatus || 'Solteiro(a)',
      admissionDate: emp.admissionDate,
      salary: emp.salary,
      status: emp.status,
      education: emp.education || '',
      address: emp.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      bankInfo: emp.bankInfo || {
        bank: '',
        agency: '',
        account: '',
        type: 'corrente',
        pixKey: ''
      },
      benefits: emp.benefits || []
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEmployeeId(null);
    setFormData({
      name: '',
      role: '',
      department: 'TI',
      workSchedule: '08:00 - 12:00, 13:00 - 17:00',
      shiftId: '',
      email: '',
      phone: '',
      cpf: '',
      rg: '',
      birthDate: '',
      gender: 'M',
      maritalStatus: 'Solteiro(a)',
      admissionDate: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'active',
      education: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      bankInfo: {
        bank: '',
        agency: '',
        account: '',
        type: 'corrente',
        pixKey: ''
      },
      benefits: []
    });
  };

  const handleViewDetails = (emp: Employee) => {
    setSelectedEmployeeId(emp.id);
    setViewMode('details');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      deleteEmployee(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedEmployee || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    // Simulate upload
    addDocument(selectedEmployee.id, {
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      url: '#' // In a real app, this would be the URL from storage
    });
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 size={12} /> Ativo</span>;
      case 'on_leave':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><AlertCircle size={12} /> Afastado</span>;
      case 'terminated':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={12} /> Desligado</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {viewMode === 'docs' ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-pink-600" size={28} />
                Central de Documentos
              </h1>
              <p className="text-gray-500 text-sm mt-1">Todos os documentos anexados aos perfis dos colaboradores</p>
            </div>
            <button 
              onClick={() => setViewMode('list')}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <XCircle size={18} />
              Voltar para Lista
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data de Upload</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.flatMap(emp => emp.documents.map(doc => ({ ...doc, employeeName: emp.name, employeeId: emp.id }))).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Nenhum documento encontrado no sistema.
                    </td>
                  </tr>
                ) : (
                  employees.flatMap(emp => emp.documents.map(doc => ({ ...doc, employeeName: emp.name, employeeId: emp.id })))
                    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                    .map((doc, idx) => (
                      <tr key={`${doc.id}-${idx}`} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{doc.employeeName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">{doc.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all">
                              <Download size={18} />
                            </button>
                            <button 
                              onClick={() => removeDocument(doc.employeeId, doc.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-pink-600" size={28} />
                Gestão de Funcionários
              </h1>
              <p className="text-gray-500 text-sm mt-1">Cadastro completo, documentação e histórico de colaboradores</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 mr-2">
                <button 
                  onClick={() => setDisplayMode('grid')}
                  className={`p-2 rounded-lg transition-all ${displayMode === 'grid' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Visualização em Cards"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setDisplayMode('table')}
                  className={`p-2 rounded-lg transition-all ${displayMode === 'table' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Visualização em Tabela"
                >
                  <ListIcon size={18} />
                </button>
              </div>
              <button 
                onClick={() => {resetForm(); setIsModalOpen(true);}}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus size={18} />
                Novo Colaborador
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome, cargo ou departamento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
              />
            </div>
            
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20">
              <option value="">Todos os Departamentos</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Vendas">Vendas</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20">
              <option value="">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="on_leave">Afastados</option>
              <option value="terminated">Desligados</option>
            </select>
          </div>

          {/* Employee Grid/Table */}
          {displayMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative">
                  <div className="absolute top-4 right-4">
                    <div className="relative group/menu">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover/menu:block z-10">
                        <button onClick={() => handleEdit(emp)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 size={14} /> Editar
                        </button>
                        <button onClick={() => handleDelete(emp.id)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 size={14} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xl">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{emp.name}</h3>
                      <p className="text-pink-600 text-sm font-medium mt-0.5">{emp.role}</p>
                      <div className="mt-2">
                        {getStatusBadge(emp.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Briefcase size={16} className="text-gray-400" />
                      <span>{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Phone size={16} className="text-gray-400" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={14} />
                      Admissão: {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
                    </div>
                    <button 
                      onClick={() => handleViewDetails(emp)}
                      className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Colaborador</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cargo / Depto</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
                            {emp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-400">Admissão: {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{emp.role}</p>
                        <p className="text-xs text-gray-500">{emp.department}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(emp.status)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{emp.email}</p>
                        <p className="text-xs text-gray-400">{emp.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetails(emp)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                            title="Ver Detalhes"
                          >
                            <UserCheck size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(emp)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(emp.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Details View */
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => setViewMode('list')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <XCircle size={18} />
            Voltar para a lista
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-pink-600 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-3xl border border-white/30">
                  {selectedEmployee?.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-bold">{selectedEmployee?.name}</h2>
                  <p className="text-pink-100 text-lg mt-1">{selectedEmployee?.role} • {selectedEmployee?.department}</p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <UserCheck size={16} />
                      CPF: {selectedEmployee?.cpf}
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <DollarSign size={16} />
                      Salário: R$ {selectedEmployee?.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(selectedEmployee!)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Column */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informações de Contato</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="text-pink-600" size={20} />
                        <div>
                          <p className="text-xs text-gray-500">E-mail Corporativo</p>
                          <p className="text-sm font-medium text-gray-900">{selectedEmployee?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="text-pink-600" size={20} />
                        <div>
                          <p className="text-xs text-gray-500">Telefone</p>
                          <p className="text-sm font-medium text-gray-900">{selectedEmployee?.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Jornada de Trabalho</h3>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-pink-600" size={20} />
                        <span className="text-sm font-medium text-gray-900">Horário Padrão</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{selectedEmployee?.workSchedule}</p>
                    </div>
                  </div>

                  {/* Address Section */}
                  {selectedEmployee?.address && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Endereço</h3>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedEmployee.address.street}, {selectedEmployee.address.number}
                        </p>
                        {selectedEmployee.address.complement && (
                          <p className="text-xs text-gray-500">{selectedEmployee.address.complement}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedEmployee.address.neighborhood} - {selectedEmployee.address.city}/{selectedEmployee.address.state}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">CEP: {selectedEmployee.address.zipCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Bank Info Section */}
                  {selectedEmployee?.bankInfo && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Dados Bancários</h3>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-400 uppercase">{selectedEmployee.bankInfo.bank}</span>
                          <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold uppercase">
                            {selectedEmployee.bankInfo.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase">Agência</p>
                            <p className="text-sm font-medium text-gray-900">{selectedEmployee.bankInfo.agency}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase">Conta</p>
                            <p className="text-sm font-medium text-gray-900">{selectedEmployee.bankInfo.account}</p>
                          </div>
                        </div>
                        {selectedEmployee.bankInfo.pixKey && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-[10px] text-gray-400 uppercase">Chave PIX</p>
                            <p className="text-xs font-medium text-gray-900 truncate">{selectedEmployee.bankInfo.pixKey}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Benefits Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Benefícios Ativos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEmployee?.benefits && selectedEmployee.benefits.length > 0 ? (
                        selectedEmployee.benefits.map(benefit => (
                          <div key={benefit.id} className="p-4 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white text-pink-600 flex items-center justify-center shadow-sm">
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{benefit.name}</p>
                                <p className="text-xs text-pink-600 font-medium">
                                  {benefit.type === 'fixed' ? `R$ ${benefit.value.toLocaleString('pt-BR')}` : `${benefit.value}% do salário`}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-6 bg-gray-50 rounded-2xl text-center">
                          <p className="text-sm text-gray-400 italic">Nenhum benefício cadastrado.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Documentação</h3>
                      <label className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 cursor-pointer">
                        <Upload size={16} />
                        Upload de Documento
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEmployee?.documents.length === 0 ? (
                      <div className="col-span-2 p-12 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                        <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400">Nenhum documento anexado ainda.</p>
                      </div>
                    ) : (
                      selectedEmployee?.documents.map(doc => (
                        <div key={doc.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-pink-200 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type} • {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Download size={18} />
                            </button>
                            <button 
                              onClick={() => removeDocument(selectedEmployee.id, doc.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                  <div className="mt-12 p-6 bg-gray-900 rounded-3xl text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">Ações Administrativas</h4>
                      <p className="text-gray-400 text-sm">Gerencie o status contratual deste colaborador</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
                        Gerar Holerite
                      </button>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition-colors">
                        Rescisão
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal (Simplified for now) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-pink-50/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {selectedEmployee ? <Edit2 size={24} className="text-pink-600" /> : <Plus size={24} className="text-pink-600" />}
                {selectedEmployee ? 'Editar Colaborador' : 'Novo Colaborador'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="col-span-2">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Dados Pessoais</h4>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="Ex: João da Silva" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cargo</label>
                    <select 
                      required
                      value={formData.role}
                      onChange={(e) => {
                        const role = jobRoles.find(r => r.name === e.target.value);
                        setFormData({
                          ...formData, 
                          role: e.target.value,
                          department: role?.department || formData.department,
                          salary: role?.baseSalary || formData.salary
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="">Selecione um Cargo</option>
                      {jobRoles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departamento</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="TI">TI</option>
                      <option value="RH">RH</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Produção">Produção</option>
                      <option value="Comercial">Comercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Salário</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                    <input 
                      type="text" 
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="000.000.000-00" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">RG</label>
                    <input 
                      type="text" 
                      value={formData.rg}
                      onChange={(e) => setFormData({...formData, rg: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="00.000.000-0" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Data de Nascimento</label>
                    <input 
                      type="date" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gênero</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="Other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estado Civil</label>
                    <select 
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Escolaridade</label>
                    <input 
                      type="text" 
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="Ex: Ensino Superior Completo" 
                    />
                  </div>

                  {/* Contact */}
                  <div className="col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Contato</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="email@empresa.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Endereço</h4>
                  </div>
                  <div className="col-span-2 grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Rua</label>
                      <input 
                        type="text" 
                        value={formData.address.street}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nº</label>
                      <input 
                        type="text" 
                        value={formData.address.number}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, number: e.target.value}})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bairro</label>
                    <input 
                      type="text" 
                      value={formData.address.neighborhood}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, neighborhood: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CEP</label>
                    <input 
                      type="text" 
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cidade</label>
                    <input 
                      type="text" 
                      value={formData.address.city}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                    <input 
                      type="text" 
                      value={formData.address.state}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>

                  {/* Professional Info */}
                  <div className="col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Informações Profissionais</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cargo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      placeholder="Ex: Desenvolvedor" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departamento</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="TI">TI</option>
                      <option value="RH">RH</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Produção">Produção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Data de Admissão</label>
                    <input 
                      type="date" 
                      required
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Salário Base (R$)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Turno / Jornada</label>
                    <select 
                      value={formData.workSchedule}
                      onChange={(e) => setFormData({...formData, workSchedule: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="08:00 - 12:00, 13:00 - 17:00">Comercial (08:00 - 17:00)</option>
                      <option value="09:00 - 13:00, 14:00 - 18:00">Tarde (09:00 - 18:00)</option>
                      <option value="22:00 - 02:00, 03:00 - 06:00">Noturno (22:00 - 06:00)</option>
                      <option value="12x36">Escala 12x36</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="active">Ativo</option>
                      <option value="on_leave">Afastado</option>
                      <option value="terminated">Desligado</option>
                    </select>
                  </div>

                  {/* Bank Info */}
                  <div className="col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Dados Bancários</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Banco</label>
                    <input 
                      type="text" 
                      value={formData.bankInfo.bank}
                      onChange={(e) => setFormData({...formData, bankInfo: {...formData.bankInfo, bank: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Agência</label>
                      <input 
                        type="text" 
                        value={formData.bankInfo.agency}
                        onChange={(e) => setFormData({...formData, bankInfo: {...formData.bankInfo, agency: e.target.value}})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Conta</label>
                      <input 
                        type="text" 
                        value={formData.bankInfo.account}
                        onChange={(e) => setFormData({...formData, bankInfo: {...formData.bankInfo, account: e.target.value}})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Conta</label>
                    <select 
                      value={formData.bankInfo.type}
                      onChange={(e) => setFormData({...formData, bankInfo: {...formData.bankInfo, type: e.target.value as any}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                    >
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chave PIX</label>
                    <input 
                      type="text" 
                      value={formData.bankInfo.pixKey}
                      onChange={(e) => setFormData({...formData, bankInfo: {...formData.bankInfo, pixKey: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>

                  {/* Benefits */}
                  <div className="col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4">Benefícios Aplicados</h4>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-4 rounded-xl space-y-3">
                    {[
                      { id: 'b1', name: 'Vale Refeição', value: 600, type: 'fixed' },
                      { id: 'b2', name: 'Vale Transporte', value: 6, type: 'percentage' },
                      { id: 'b3', name: 'Plano de Saúde', value: 0, type: 'fixed' },
                      { id: 'b4', name: 'Seguro de Vida', value: 0, type: 'fixed' }
                    ].map(benefit => (
                      <label key={benefit.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={formData.benefits.some(b => b.id === benefit.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, benefits: [...formData.benefits, benefit as any]});
                            } else {
                              setFormData({...formData, benefits: formData.benefits.filter(b => b.id !== benefit.id)});
                            }
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                          {benefit.name} {benefit.value > 0 && `(${benefit.type === 'fixed' ? 'R$ ' + benefit.value : benefit.value + '%'})`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-8 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/20">
                  {selectedEmployee ? 'Salvar Alterações' : 'Salvar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
