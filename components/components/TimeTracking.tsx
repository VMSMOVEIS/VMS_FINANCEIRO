import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  User,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
  Save,
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TimeEntry, Employee } from '../types';
import { useEmployees } from '../src/context/EmployeeContext';

// Initial mock data for time entries
const INITIAL_ENTRIES: TimeEntry[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'João Silva',
    date: '2026-03-05',
    entry1: '08:00',
    exit1: '12:00',
    entry2: '13:00',
    exit2: '17:00',
    totalHours: 8,
    status: 'normal'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Maria Oliveira',
    date: '2026-03-05',
    entry1: '09:05',
    exit1: '13:00',
    entry2: '14:00',
    exit2: '18:10',
    totalHours: 8.1,
    status: 'extra'
  }
];

export const TimeTracking: React.FC = () => {
  const { employees } = useEmployees();
  const [entries, setEntries] = useState<TimeEntry[]>(INITIAL_ENTRIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Partial<TimeEntry>>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    entry1: '08:00',
    exit1: '12:00',
    entry2: '13:00',
    exit2: '17:00',
    observations: ''
  });

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = dateFilter ? entry.date === dateFilter : true;
      return matchesSearch && matchesDate;
    });
  }, [entries, searchTerm, dateFilter]);

  const calculateHours = (e1: string, s1: string, e2: string, s2: string) => {
    const getMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const morning = getMinutes(s1) - getMinutes(e1);
    const afternoon = getMinutes(s2) - getMinutes(e2);
    return (morning + afternoon) / 60;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

    const totalHours = calculateHours(
      formData.entry1 || '00:00',
      formData.exit1 || '00:00',
      formData.entry2 || '00:00',
      formData.exit2 || '00:00'
    );

    const newEntry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: employee.id,
      employeeName: employee.name,
      date: formData.date || '',
      entry1: formData.entry1 || '',
      exit1: formData.exit1 || '',
      entry2: formData.entry2 || '',
      exit2: formData.exit2 || '',
      totalHours,
      status: totalHours > 8 ? 'extra' : totalHours < 8 ? 'missing' : 'normal',
      observations: formData.observations
    };

    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      entry1: '08:00',
      exit1: '12:00',
      entry2: '13:00',
      exit2: '17:00',
      observations: ''
    });
  };

  const exportToExcel = () => {
    const dataToExport = filteredEntries.map(entry => ({
      'Funcionário': entry.employeeName,
      'Data': entry.date,
      'Entrada 1': entry.entry1,
      'Saída 1': entry.exit1,
      'Entrada 2': entry.entry2,
      'Saída 2': entry.exit2,
      'Total Horas': entry.totalHours.toFixed(2),
      'Status': entry.status === 'normal' ? 'Normal' : entry.status === 'extra' ? 'Extra' : 'Faltante',
      'Observações': entry.observations || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ponto Eletrônico");
    
    // Generate buffer
    XLSX.writeFile(workbook, `Ponto_Eletronico_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-pink-600" size={28} />
            Ponto Eletrônico
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de jornada de trabalho e banco de horas</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <FileSpreadsheet size={18} className="text-green-600" />
            Exportar Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            Lançamento Manual
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por funcionário..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
          />
        </div>
        
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
          />
        </div>

        <button 
          onClick={() => {setSearchTerm(''); setDateFilter('');}}
          className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
          title="Limpar Filtros"
        >
          <XCircle size={20} />
        </button>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total de Horas</p>
            <p className="text-lg font-bold text-pink-600">
              {filteredEntries.reduce((sum, e) => sum + e.totalHours, 0).toFixed(2)}h
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Funcionário</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Entrada 1</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Saída 1</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Entrada 2</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Saída 2</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Nenhum registro encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-medium text-xs">
                          {entry.employeeName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{entry.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center font-mono">{entry.entry1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center font-mono">{entry.exit1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center font-mono">{entry.entry2}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center font-mono">{entry.exit2}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                      {entry.totalHours.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                        entry.status === 'extra' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.status === 'normal' ? <CheckCircle2 size={12} /> : 
                         entry.status === 'extra' ? <Plus size={12} /> : 
                         <AlertCircle size={12} />}
                        {entry.status === 'normal' ? 'Normal' : entry.status === 'extra' ? 'Extra' : 'Faltante'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-pink-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Plus size={20} className="text-pink-600" />
                Lançamento Manual de Ponto
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
                <select 
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm bg-white"
                >
                  <option value="">Selecione um funcionário...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entrada 1</label>
                  <input 
                    type="time" 
                    required
                    value={formData.entry1}
                    onChange={(e) => setFormData({...formData, entry1: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saída 1 (Almoço)</label>
                  <input 
                    type="time" 
                    required
                    value={formData.exit1}
                    onChange={(e) => setFormData({...formData, exit1: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entrada 2 (Volta)</label>
                  <input 
                    type="time" 
                    required
                    value={formData.entry2}
                    onChange={(e) => setFormData({...formData, entry2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saída 2</label>
                  <input 
                    type="time" 
                    required
                    value={formData.exit2}
                    onChange={(e) => setFormData({...formData, exit2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                <textarea 
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm h-20 resize-none"
                  placeholder="Justificativas, atrasos, etc..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save size={18} />
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
