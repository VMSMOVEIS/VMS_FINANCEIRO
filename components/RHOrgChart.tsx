import React from 'react';
import { 
  Network, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  User, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Maximize2,
  Download
} from 'lucide-react';

const RHOrgChart: React.FC = () => {
  const departments = [
    { 
      id: '1', 
      name: 'Diretoria Executiva', 
      manager: 'Roberto Almeida', 
      employees: 3,
      subDepartments: [
        { id: '2', name: 'Financeiro', manager: 'Ricardo Oliveira', employees: 8 },
        { id: '3', name: 'Recursos Humanos', manager: 'Ana Silva', employees: 5 },
        { id: '4', name: 'Operações', manager: 'Carlos Santos', employees: 45 },
      ]
    },
    { 
      id: '5', 
      name: 'Comercial', 
      manager: 'Mariana Costa', 
      employees: 12,
      subDepartments: [
        { id: '6', name: 'Vendas Internas', manager: 'Lucas Mendes', employees: 8 },
        { id: '7', name: 'Marketing', manager: 'Fernanda Rocha', employees: 4 },
      ]
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Network className="text-pink-600" size={28} />
            Organograma & Estrutura
          </h1>
          <p className="text-gray-500 text-sm mt-1">Visualização da hierarquia e distribuição de equipes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <Download size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
            <Plus size={18} />
            Novo Departamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-bold">Total Colaboradores</h3>
          </div>
          <p className="text-3xl font-bold">142</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">Distribuídos em 12 áreas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Network size={20} />
            </div>
            <h3 className="font-bold">Níveis Hierárquicos</h3>
          </div>
          <p className="text-3xl font-bold">4</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Estrutura verticalizada</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <User size={20} />
            </div>
            <h3 className="font-bold">Gestores</h3>
          </div>
          <p className="text-3xl font-bold">15</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Média de 9.4 subordinados</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Maximize2 size={20} />
            </div>
            <h3 className="font-bold">Vagas Abertas</h3>
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Aguardando preenchimento</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <h3 className="font-bold text-lg">Visualização Hierárquica</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar departamento ou pessoa..." 
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 w-64"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100">
              <button className="px-3 py-1 text-xs font-bold bg-white text-pink-600 rounded shadow-sm">Lista</button>
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-700">Gráfico</button>
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto w-full">
          {departments.map(dept => (
            <div key={dept.id} className="space-y-4">
              <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-pink-200 flex items-center justify-center text-pink-600 font-bold shadow-sm">
                    {dept.manager.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-500">{dept.manager} • {dept.employees} colaboradores</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
              </div>

              <div className="pl-12 space-y-4 border-l-2 border-pink-100 ml-6">
                {dept.subDepartments.map(sub => (
                  <div key={sub.id} className="p-4 bg-white rounded-xl border border-gray-100 flex items-center justify-between group hover:border-pink-200 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {sub.manager.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-gray-900">{sub.name}</h5>
                        <p className="text-xs text-gray-500">{sub.manager} • {sub.employees} colaboradores</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RHOrgChart;
