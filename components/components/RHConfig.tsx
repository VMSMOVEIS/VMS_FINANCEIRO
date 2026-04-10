import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Briefcase, 
  Building2, 
  DollarSign,
  XCircle,
  Save
} from 'lucide-react';
import { useEmployees } from '../src/context/EmployeeContext';
import { JobRole } from '../types';

export const RHConfig: React.FC = () => {
  const { jobRoles, addJobRole, updateJobRole, deleteJobRole } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [formData, setFormData] = useState<Omit<JobRole, 'id'>>({
    name: '',
    description: '',
    department: '',
    baseSalary: 0
  });

  const handleEdit = (role: JobRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      department: role.department || '',
      baseSalary: role.baseSalary || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      updateJobRole(selectedRole.id, formData);
    } else {
      addJobRole(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      department: '',
      baseSalary: 0
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      deleteJobRole(id);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-pink-600" size={28} />
            Configurações de RH
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie cargos, departamentos e parâmetros do RH</p>
        </div>

        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Novo Cargo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Briefcase size={18} className="text-pink-600" />
              Cargos Cadastrados
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Departamento</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Salário Base</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobRoles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      Nenhum cargo cadastrado.
                    </td>
                  </tr>
                ) : (
                  jobRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{role.name}</p>
                          {role.description && <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <Building2 size={12} />
                          {role.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          R$ {role.baseSalary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(role)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(role.id)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-pink-50/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {selectedRole ? <Edit2 size={24} className="text-pink-600" /> : <Plus size={24} className="text-pink-600" />}
                {selectedRole ? 'Editar Cargo' : 'Novo Cargo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-8 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Cargo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    placeholder="Ex: Vendedor, Gerente..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Departamento</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                  >
                    <option value="">Selecione um Departamento</option>
                    <option value="TI">TI</option>
                    <option value="RH">RH</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Produção">Produção</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Salário Base</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.baseSalary || ''}
                      onChange={(e) => setFormData({...formData, baseSalary: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descrição (Opcional)</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none" 
                    rows={3}
                    placeholder="Breve descrição das responsabilidades..."
                  />
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
