import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  Box, 
  Factory, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft, 
  Plus, 
  History, 
  ArrowRight,
  Clock,
  Users,
  Search,
  Filter,
  Download,
  FileText,
  Layers,
  Wrench,
  RefreshCw,
  BookmarkCheck,
  Upload,
  MoreVertical,
  Edit2,
  Trash2,
  Kanban,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Truck,
  Calendar,
  Store,
  Activity,
  Barcode,
  Info,
  X,
  MapPin
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ModuleId } from '../types';

interface InventoryModuleProps {
  activeModule: ModuleId;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({ activeModule }) => {
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [isWipMovementModalOpen, setIsWipMovementModalOpen] = useState(false);
  const [isFinishedProductModalOpen, setIsFinishedProductModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);

  const [rawMaterials, setRawMaterials] = useState([
    { id: '1', name: 'MDF Branco 15mm', brand: 'Duratex', cat: 'MDF', sku: 'MDF0001', unit: 'Chapa', current: 125, res: 20, cost: 78.50, loc: 'A01-P01-N01', minStock: 20, lastModified: new Date().toISOString() },
    { id: '2', name: 'MDF Carvalho 15mm', brand: 'Arauco', cat: 'MDF', sku: 'MDF0002', unit: 'Chapa', current: 68, res: 15, cost: 92.30, loc: 'A01-P02-N03', minStock: 15, lastModified: new Date().toISOString() },
    { id: '3', name: 'MDF Preto 18mm', brand: 'Duratex', cat: 'MDF', sku: 'MDF0003', unit: 'Chapa', current: 45, res: 10, cost: 105.60, loc: 'A02-P01-N02', minStock: 10, lastModified: new Date().toISOString() },
    { id: '4', name: 'Fita de Borda Branca', brand: 'Rehau', cat: 'Fitas de Borda', sku: 'FIT0001', unit: 'Rolo', current: 15, res: 5, cost: 35.20, loc: 'B01-P01-N01', minStock: 20, lastModified: new Date().toISOString() },
    { id: '5', name: 'Dobradiça 35mm', brand: 'Blum', cat: 'Ferragens', sku: 'FER0001', unit: 'Unidade', current: 1200, res: 200, cost: 2.45, loc: 'C01-P03-N02', minStock: 500, lastModified: new Date().toISOString() },
  ]);

  const handleAddRawMaterial = (newItem: any) => {
    if (editingItem) {
      setRawMaterials(rawMaterials.map(item => 
        item.id === editingItem.id ? { ...newItem, id: item.id, lastModified: new Date().toISOString() } : item
      ));
      setEditingItem(null);
    } else {
      setRawMaterials([...rawMaterials, { ...newItem, id: Date.now().toString(), lastModified: new Date().toISOString() }]);
    }
  };

  const handleEditRawMaterial = (item: any) => {
    setEditingItem(item);
    setIsRawMaterialModalOpen(true);
  };

  const handleDeleteRawMaterial = (id: string) => {
    if (confirm('Você tem permissão para excluir este item? Esta ação não pode ser desfeita.')) {
      setRawMaterials(rawMaterials.filter(item => item.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeModule) {
      case ModuleId.ESTOQUES_VISAO_GERAL:
        return <StockOverview />;
      case ModuleId.ESTOQUES_MATERIA_PRIMA:
        return (
          <RawMaterialsView 
            onOpenNewItem={() => {
              setEditingItem(null);
              setIsRawMaterialModalOpen(true);
            }} 
            items={rawMaterials} 
            onEdit={handleEditRawMaterial}
            onDelete={handleDeleteRawMaterial}
          />
        );
      case ModuleId.ESTOQUES_WIP:
        return <WipView onOpenNewMovement={() => setIsWipMovementModalOpen(true)} />;
      case ModuleId.ESTOQUES_PRODUTOS_ACABADOS:
        return <FinishedProductsView onOpenNewItem={() => setIsFinishedProductModalOpen(true)} />;
      case ModuleId.ESTOQUES_RETALHOS:
        return <PlaceholderTab name="Retalhos" />;
      case ModuleId.ESTOQUES_MOVIMENTACOES:
        return <PlaceholderTab name="Movimentações" />;
      case ModuleId.ESTOQUES_RESERVAS:
        return <PlaceholderTab name="Reservas" />;
      case ModuleId.ESTOQUES_INVENTARIO:
        return <PlaceholderTab name="Inventário" />;
      case ModuleId.ESTOQUES_RELATORIOS:
        return <PlaceholderTab name="Relatórios" />;
      default:
        return <StockOverview />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {renderContent()}
      
      {isRawMaterialModalOpen && (
        <Modal 
          title={editingItem ? "Editar Item - Matéria Prima" : "Novo Item - Matéria Prima"} 
          onClose={() => {
            setIsRawMaterialModalOpen(false);
            setEditingItem(null);
          }} 
          size="4xl"
        >
          <RawMaterialForm 
            onClose={() => {
              setIsRawMaterialModalOpen(false);
              setEditingItem(null);
            }} 
            onSave={handleAddRawMaterial} 
            initialData={editingItem}
          />
        </Modal>
      )}

      {isWipMovementModalOpen && (
        <Modal title="Nova Movimentação - Em Processo (WIP)" onClose={() => setIsWipMovementModalOpen(false)}>
          <WipMovementForm onClose={() => setIsWipMovementModalOpen(false)} />
        </Modal>
      )}

      {isFinishedProductModalOpen && (
        <Modal title="Novo Item - Produtos Acabados" onClose={() => setIsFinishedProductModalOpen(false)}>
          <FinishedProductForm onClose={() => setIsFinishedProductModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

const RawMaterialsView = ({ onOpenNewItem, items, onEdit, onDelete }: { 
  onOpenNewItem: () => void, 
  items: any[],
  onEdit: (item: any) => void,
  onDelete: (id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState('Todos os Itens');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [locationFilter, setLocationFilter] = useState('Todas');

  const categories = ['Todos os Itens', 'MDF', 'Ferragens', 'Fitas de Borda', 'Vidros', 'Outros'];

  // Categories present in items for the select filter
  const uniqueCategories = Array.from(new Set(items.map(item => item.cat)));
  const uniqueLocations = Array.from(new Set(items.map(item => item.loc)));

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || item.cat === categoryFilter;
    const matchesLocation = locationFilter === 'Todas' || item.loc === locationFilter;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Calculate stats based on real data
  const totalValue = items.reduce((sum, item) => sum + (item.current * item.cost), 0);
  const availableValue = items.reduce((sum, item) => sum + ((item.current - item.res) * item.cost), 0);
  const lowStockCount = items.filter(item => item.current <= item.minStock).length;
  // Using some dummy trend logic for display consistency
  const availablePercentage = totalValue > 0 ? ((availableValue / totalValue) * 100).toFixed(1) : '0';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Matéria-Prima</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
            <span>Estoque</span>
            <ChevronRight size={10} />
            <span className="text-slate-600">Matéria-Prima</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <Upload size={14} />
            Importar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <Download size={14} />
            Exportar
          </button>
          <button 
            onClick={onOpenNewItem}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-widest"
          >
            <Plus size={14} />
            Novo Item
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        {categories.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCategoryFilter(tab === 'Todos os Itens' ? 'Todas' : tab);
            }}
            className={`px-1 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard title="Valor total em estoque" value={formatCurrency(totalValue)} trend="+8,5% em relação ao mês anterior" icon={<Package size={20} className="text-indigo-600" />} bgColor="bg-indigo-50" />
        <SummaryCard title="Itens cadastrados" value={items.length.toString()} trend="+2 novos itens" icon={<Layers size={20} className="text-blue-600" />} bgColor="bg-blue-50" />
        <SummaryCard title="Estoque disponível" value={formatCurrency(availableValue)} trend={`${availablePercentage}% do total`} icon={<TrendingUp size={20} className="text-emerald-600" />} bgColor="bg-emerald-50" />
        <SummaryCard title="Estoque baixo" value={`${lowStockCount} itens`} trend="Requer atenção" icon={<AlertTriangle size={20} className="text-amber-600" />} bgColor="bg-amber-50" />
        <SummaryCard title="Sem movimentação" value="0 itens" trend="Últimos 60 dias" icon={<Package size={20} className="text-rose-600" />} bgColor="bg-rose-50" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar na tabela..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" 
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Categoria</label>
              <select 
                value={categoryFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategoryFilter(val);
                  setActiveTab(val === 'Todas' ? 'Todos os Itens' : val);
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Todas">Todas</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Localização</label>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Todas">Todas</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 mt-5">
              <Filter size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4 text-center">Categoria</th>
                <th className="px-6 py-4 text-center">SKU / Código</th>
                <th className="px-6 py-4 text-center">Unidade</th>
                <th className="px-6 py-4 text-center">Estoque Atual</th>
                <th className="px-6 py-4 text-center">Reservado</th>
                <th className="px-6 py-4 text-center">Disponível</th>
                <th className="px-6 py-4 text-center">Custo Unitário</th>
                <th className="px-6 py-4 text-center">Valor Total</th>
                <th className="px-6 py-4 text-center">Localização</th>
                <th className="px-6 py-4 text-center">Modificação</th>
                <th className="px-6 py-4 text-center">Situação</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item, i) => {
                const disp = item.current - item.res;
                const totalVal = item.current * item.cost;
                const isLowStock = item.current <= item.minStock;
                
                return (
                  <tr key={i} className="text-xs hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                           <Package size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${item.cat === 'MDF' ? 'bg-blue-50 text-blue-600' : item.cat === 'Fitas de Borda' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-600'}`}>{item.cat}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-bold font-mono">{item.sku}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-bold">{item.unit}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{item.current}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500">{item.res}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-500">{disp}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-bold">{formatCurrency(item.cost)}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{formatCurrency(totalVal)}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-bold">{item.loc}</td>
                    <td className="px-6 py-4 text-center text-slate-400 font-bold text-[10px]">
                      {item.lastModified ? new Date(item.lastModified).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isLowStock ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isLowStock ? 'Atenção' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                         <button 
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mostrando {filteredItems.length} de {items.length} itens</p>
          <div className="flex items-center gap-4">
             <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded font-bold text-xs text-slate-600">1</button>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">10 por página</span>
                <ChevronRight size={14} className="text-slate-400 rotate-90" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WipView = ({ onOpenNewMovement }: { onOpenNewMovement: () => void }) => {
  const [activeTab, setActiveTab] = useState('Tabela de Peças');
  const tabs = ['Tabela de Peças', 'Visão Kanban', 'Timeline das Peças', 'Gargalos'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Em Processo (WIP)</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
            <span>Estoque</span>
            <ChevronRight size={10} />
            <span className="text-slate-600">Em Processo</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-widest">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"><Filter size={14} /> Filtros</button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"><Plus size={14} /> Mais filtros</button>
           <button 
            onClick={onOpenNewMovement}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} /> Nova Movimentação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard title="Peças em produção" value="1.248" trend="+87 hoje" icon={<Factory size={20} className="text-indigo-600" />} bgColor="bg-indigo-50" />
        <SummaryCard title="Atrasadas" value="87" trend="Requer atenção" icon={<Clock size={20} className="text-rose-600" />} bgColor="bg-rose-50" />
        <SummaryCard title="Produção hoje" value="248" trend="+12% vs ontem" icon={<TrendingUp size={20} className="text-emerald-600" />} bgColor="bg-emerald-50" />
        <SummaryCard title="Conclusão média" value="68%" trend="Meta: 1.850 peças" icon={<CheckCircle2 size={20} className="text-blue-600" />} bgColor="bg-blue-50" />
        <SummaryCard title="Valor total em processo" value="R$ 532.450,00" trend="23,5% do estoque total" icon={<Package size={20} className="text-amber-600" />} bgColor="bg-amber-50" />
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6 overflow-hidden">
          <div className="flex border-b border-slate-200 gap-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-[1000px]">
             <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar na tabela..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="flex gap-2">
                   {['Projeto', 'Etapa', 'Ambiente', 'Responsável', 'Status'].map(filter => (
                     <select key={filter} className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 uppercase tracking-widest outline-none">
                        <option>{filter}</option>
                        <option>Todos</option>
                     </select>
                   ))}
                </div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Peça</th>
                    <th className="px-6 py-4">Projeto / Cliente</th>
                    <th className="px-6 py-4">Ambiente</th>
                    <th className="px-6 py-4">Etapa Atual</th>
                    <th className="px-6 py-4">Próxima Etapa</th>
                    <th className="px-6 py-4">Qtd.</th>
                    <th className="px-6 py-4 text-center">Responsável</th>
                    <th className="px-6 py-4 text-center">Início</th>
                    <th className="px-6 py-4 text-center">Previsão</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'LAT DIR 720x350x18', id: '#PE-000987', project: 'Cozinha João Silva', projectCode: '#PROJ-1258', env: 'Balcão Pia', current: 'Borda', next: 'Usinagem', qty: 8, resp: 'Carlos Lima', start: '20/05 08:15', eta: '20/05 14:00', status: 'Em andamento', statusColor: 'text-blue-600 bg-blue-50' },
                    { name: 'LATERAL ESQ 720x350x18', id: '#PE-000988', project: 'Cozinha João Silva', projectCode: '#PROJ-1258', env: 'Balcão Pia', current: 'Usinagem', next: 'Montagem', qty: 8, resp: 'Carlos Lima', start: '20/05 09:10', eta: '20/05 16:00', status: 'Em andamento', statusColor: 'text-blue-600 bg-blue-50' },
                    { name: 'FRENTE GAV 600x140x18', id: '#PE-000989', project: 'Dormitório Ana', projectCode: '#PROJ-1259', env: 'Cômoda', current: 'Corte', next: 'Borda', qty: 6, resp: 'João Pedro', start: '20/05 07:30', eta: '20/05 12:00', status: 'Em andamento', statusColor: 'text-blue-600 bg-blue-50' },
                    { name: 'BASE 800x560x18', id: '#PE-000990', project: 'Escritório Carlos', projectCode: '#PROJ-1260', env: 'Mesa', current: 'Pré-Montagem', next: 'Montagem', qty: 4, resp: 'Juliano Costa', start: '19/05 15:40', eta: '20/05 10:00', status: 'Atrasada', statusColor: 'text-rose-600 bg-rose-50' },
                    { name: 'PORTA 720x597x18', id: '#PE-000991', project: 'Cozinha João Silva', projectCode: '#PROJ-1258', env: 'Aéreo 02', current: 'Pintura', next: 'Finalização', qty: 10, resp: 'Marcos Paulo', start: '19/05 10:20', eta: '20/05 09:00', status: 'Atrasada', statusColor: 'text-rose-600 bg-rose-50' },
                  ].map((row, i) => (
                    <tr key={i} className="text-xs hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><Box size={18} /></div>
                           <div>
                             <p className="font-black text-slate-800 uppercase tracking-tight">{row.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{row.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 tracking-tight">{row.project}</p>
                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{row.projectCode}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold">{row.env}</td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">{row.current}</span></td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">{row.next}</span></td>
                      <td className="px-6 py-4 font-black text-slate-800">{row.qty}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-black">CL</div>
                           <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{row.resp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-400 font-bold">{row.start}</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-bold">{row.eta}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${row.statusColor}`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right"><button className="p-1.5 text-slate-400 hover:text-slate-600"><MoreVertical size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="w-80 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100"><h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Etapas da Produção</h3></div>
             <div className="p-4 space-y-4">
                {[
                  { name: 'Corte', qty: '312 peças', perc: '25%', color: 'bg-indigo-600', icon: <Box size={14} className="text-indigo-600" />, iconBg: 'bg-indigo-50' },
                  { name: 'Borda', qty: '286 peças', perc: '23%', color: 'bg-amber-600', icon: <Layers size={14} className="text-amber-600" />, iconBg: 'bg-amber-50' },
                  { name: 'Usinagem', qty: '248 peças', perc: '20%', color: 'bg-blue-600', icon: <Wrench size={14} className="text-blue-600" />, iconBg: 'bg-blue-50' },
                  { name: 'Pré-Montagem', qty: '156 peças', perc: '13%', color: 'bg-emerald-600', icon: <Box size={14} className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
                  { name: 'Montagem', qty: '132 peças', perc: '11%', color: 'bg-purple-600', icon: <Package size={14} className="text-purple-600" />, iconBg: 'bg-purple-50' },
                  { name: 'Finalização', qty: '114 peças', perc: '9%', color: 'bg-rose-600', icon: <Clock size={14} className="text-rose-600" />, iconBg: 'bg-rose-50' },
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-3 group translate-x-0 hover:translate-x-1 transition-transform">
                     <div className={`p-2 rounded-lg ${item.iconBg}`}>{item.icon}</div>
                     <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                           <span className="text-xs font-bold text-slate-700">{item.name}</span>
                           <span className="text-[10px] font-black text-slate-400">{item.perc}</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${item.color}`} style={{ width: item.perc }} />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.qty}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Gargalos</h3>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todos</button>
             </div>
             <div className="p-4 space-y-3">
                {[
                  { title: 'Usinagem', desc: 'Fila com 48 peças', icon: <AlertCircle size={14} className="text-rose-600" />, bg: 'bg-rose-50' },
                  { title: 'Borda', desc: 'Fila com 36 peças', icon: <Clock size={14} className="text-amber-600" />, bg: 'bg-amber-50' },
                  { title: 'Montagem', desc: 'Fila com 22 peças', icon: <TrendingUp size={14} className="text-orange-600" />, bg: 'bg-orange-50' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                     <div className={`p-2 h-fit rounded-lg ${item.bg}`}>{item.icon}</div>
                     <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{item.desc}</p>
                     </div>
                     <ChevronRight size={14} className="ml-auto mt-2 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Peça Selecionada</h3>
            <div className="flex gap-4">
               <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                  <Package size={40} />
               </div>
               <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">LAT DIR 720x350x18</h4>
                    <p className="text-[10px] font-bold text-slate-400 font-mono">#PE-000987</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">Em andamento</span>
                  <div className="grid grid-cols-2 gap-y-1 mt-2">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Projeto:</p>
                     <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tight">Cozinha João Silva</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Material:</p>
                     <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tight">MDF Branco 18mm</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Timeline da Peça</h3>
              <button className="p-1 hover:bg-slate-100 rounded"><Maximize2 size={14} className="text-slate-400" /></button>
            </div>
            <div className="relative pt-6">
               <div className="absolute top-8 left-4 right-4 h-0.5 bg-slate-100" />
               <div className="flex justify-between relative z-10">
                  <TimelineStep label="Corte" status="complete" time="20/05 08:15" />
                  <TimelineStep label="Borda" status="complete" time="20/05 09:45" />
                  <TimelineStep label="Usinagem" status="active" meta="Carlos Lima" />
                  <TimelineStep label="Pré-Montagem" status="pending" />
                  <TimelineStep label="Montagem" status="pending" />
                  <TimelineStep label="Finalização" status="pending" />
               </div>
            </div>
            <div className="pt-4 border-t border-slate-50 grid grid-cols-3 gap-4">
               <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Máquina:</p>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">CNC 02</p>
               </div>
               <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tempo decorrido:</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">45min</p>
               </div>
               <div className="w-full">
                  <div className="flex justify-between items-end mb-1">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Progresso:</p>
                     <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">50%</p>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600" style={{ width: '50%' }} />
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Últimas Movimentações</h3><button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todas</button></div>
            <div className="flex-1 overflow-y-auto max-h-48 pb-4">
               {[
                 { time: '20/05 09:45', action: 'Saída', desc: 'Borda concluída', user: 'Carlos Lima', type: 'out' },
                 { time: '20/05 09:45', action: 'Entrada', desc: 'Início da usinagem', user: 'Carlos Lima', type: 'in' },
                 { time: '20/05 08:15', action: 'Entrada', desc: 'Início da borda', user: 'Carlos Lima', type: 'in' },
                 { time: '20/05 07:50', action: 'Saída', desc: 'Corte concluído', user: 'João Pedro', type: 'out' },
               ].map((move, i) => (
                 <div key={i} className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-4 text-[10px]">
                    <span className="text-slate-400 font-bold font-mono tracking-tight whitespace-nowrap">{move.time}</span>
                    <div className={move.type === 'in' ? 'text-emerald-500' : 'text-rose-500'}><ArrowRight size={14} className={move.type === 'in' ? '-rotate-45' : 'rotate-45'} /></div>
                    <div className="flex-1">
                       <p className="font-black text-slate-700 uppercase tracking-tight">{move.desc}</p>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">{move.user}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const FinishedProductsView = ({ onOpenNewItem }: { onOpenNewItem: () => void }) => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Prontos', 'Em Expedição', 'Entregues', 'Instalação', 'Aguardando Conferência'];
  
  const chartData = [
    { name: 'Pronto p/ expedição', value: 142, color: '#10b981' },
    { name: 'Em expedição', value: 45, color: '#3b82f6' },
    { name: 'Instalação agendada', value: 36, color: '#f59e0b' },
    { name: 'Aguardando conferência', value: 32, color: '#94a3b8' },
    { name: 'Entregues', value: 31, color: '#6366f1' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Produtos Acabados</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
            <span>Estoque</span>
            <ChevronRight size={10} />
            <span className="text-slate-600">Produtos Acabados</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-widest">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"><Filter size={14} /> Filtros</button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"><Download size={14} /> Exportar</button>
           <button 
            onClick={onOpenNewItem}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} /> Novo Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard title="Itens prontos" value="286" trend="Aguardando expedição" icon={<CheckCircle2 size={20} className="text-emerald-600" />} bgColor="bg-emerald-50" />
        <SummaryCard title="Em expedição" value="45" trend="Em transporte" icon={<Truck size={20} className="text-blue-600" />} bgColor="bg-blue-50" />
        <SummaryCard title="Entregues (mês)" value="128" trend="+18% vs mês anterior" icon={<Package size={20} className="text-indigo-600" />} bgColor="bg-indigo-50" />
        <SummaryCard title="Instalações agendadas" value="36" trend="Próximos 7 dias" icon={<Calendar size={20} className="text-amber-600" />} bgColor="bg-amber-50" />
        <SummaryCard title="Valor total" value="R$ 1.248.750,00" trend="100% do estoque acabado" icon={<TrendingUp size={20} className="text-slate-600" />} bgColor="bg-slate-50" />
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6 overflow-hidden">
          <div className="flex border-b border-slate-200 gap-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-[900px]">
             <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar na tabela..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="flex gap-2">
                   {['Projeto', 'Ambiente', 'Localização', 'Status'].map(filter => (
                     <select key={filter} className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 uppercase tracking-widest outline-none">
                        <option>{filter}</option>
                        <option>Todos</option>
                     </select>
                   ))}
                   <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><Filter size={16} className="text-slate-500" /></button>
                </div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Móvel / Item</th>
                    <th className="px-6 py-4">Projeto / Cliente</th>
                    <th className="px-6 py-4 text-center">Ambiente</th>
                    <th className="px-6 py-4 text-center">Qtd. Volumes</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Localização</th>
                    <th className="px-6 py-4 text-center">Previsão Entrega</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Cozinha Completa', id: '#PROD-4587', project: 'Cozinha João Silva', projectCode: '#PROJ-1258', env: 'Cozinha', qty: 18, status: 'Pronto p/ expedição', statusColor: 'bg-emerald-50 text-emerald-600', loc: 'Expedição A01', date: '22/05/2024' },
                    { name: 'Dormitório Casal', id: '#PROD-4588', project: 'Dormitório Ana', projectCode: '#PROJ-1259', env: 'Dormitório', qty: 12, status: 'Em expedição', statusColor: 'bg-blue-50 text-blue-600', loc: 'Expedição B02', date: '21/05/2024' },
                    { name: 'Escritório Completo', id: '#PROD-4589', project: 'Escritório Carlos', projectCode: '#PROJ-1260', env: 'Escritório', qty: 8, status: 'Instalação agendada', statusColor: 'bg-amber-50 text-amber-600', loc: 'Expedição A03', date: '23/05/2024' },
                    { name: 'Painel e Rack', id: '#PROD-4590', project: 'Sala TV - Mariana', projectCode: '#PROJ-1261', env: 'Sala de TV', qty: 4, status: 'Aguardando conferência', statusColor: 'bg-slate-100 text-slate-600', loc: 'Conferência', date: '-' },
                    { name: 'Banheiro Planejado', id: '#PROD-4591', project: 'Banheiro Social', projectCode: '#PROJ-1262', env: 'Banheiro', qty: 6, status: 'Pronto p/ expedição', statusColor: 'bg-emerald-50 text-emerald-600', loc: 'Expedição C01', date: '20/05/2024' },
                    { name: 'Closet Master', id: '#PROD-4592', project: 'Closet - Roberto', projectCode: '#PROJ-1263', env: 'Closet', qty: 10, status: 'Em expedição', statusColor: 'bg-blue-50 text-blue-600', loc: 'Expedição B01', date: '19/05/2024' },
                    { name: 'Lavanderia', id: '#PROD-4593', project: 'Lavanderia - Juliana', projectCode: '#PROJ-1264', env: 'Lavanderia', qty: 3, status: 'Entregue', statusColor: 'bg-indigo-50 text-indigo-600', loc: 'Entregue', date: '18/05/2024' },
                    { name: 'Quarto Infantil', id: '#PROD-4594', project: 'Quarto - Lucas', projectCode: '#PROJ-1265', env: 'Quarto', qty: 7, status: 'Instalação agendada', statusColor: 'bg-amber-50 text-amber-600', loc: 'Expedição A02', date: '24/05/2024' },
                  ].map((row, i) => (
                    <tr key={i} className="text-xs hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100 group"><Store size={18} className="group-hover:scale-110 transition-transform" /></div>
                           <div>
                             <p className="font-black text-slate-800 uppercase tracking-tight">{row.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{row.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 tracking-tight">{row.project}</p>
                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{row.projectCode}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500 font-bold">{row.env}</td>
                      <td className="px-6 py-4 text-center font-black text-slate-800">{row.qty}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-current/10 ${row.statusColor}`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500 font-bold uppercase tracking-tight">{row.loc}</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-bold whitespace-nowrap">{row.date}</td>
                      <td className="px-6 py-4 text-right"><button className="p-1.5 text-slate-400 hover:text-slate-600"><MoreVertical size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
             </table>
             <div className="p-4 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mostrando 1 a 8 de 286 itens</p>
                <div className="flex gap-1">
                   <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded font-bold text-xs text-slate-600">1</button>
                   <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">2</button>
                   <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">3</button>
                   <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
                   <button className="w-10 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">36</button>
                </div>
             </div>
          </div>
        </div>

        <div className="w-80 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Status dos Itens</h3>
              <div className="h-48 w-full flex items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={chartData}
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <RechartsTooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-black text-slate-800">286</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                 </div>
              </div>
              <div className="space-y-2">
                 {chartData.map(item => (
                   <div key={item.name} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-800">{item.value} <span className="text-slate-400 font-bold">({Math.round((item.value / 286) * 100)}%)</span></span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Próximas Instalações</h3>
                 <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver agenda completa</button>
              </div>
              <div className="p-5 space-y-4 pb-6">
                 {[
                   { date: '22/05', name: 'Cozinha João Silva' },
                   { date: '22/05', name: 'Dormitório Ana' },
                   { date: '23/05', name: 'Escritório Carlos' },
                   { date: '24/05', name: 'Sala TV - Mariana' },
                   { date: '24/05', name: 'Quarto Lucas' },
                 ].map((inst, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{inst.date}</span>
                      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight flex-1">{inst.name}</p>
                      <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-500" />
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Localizações</h3>
                 <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todas</button>
              </div>
              <div className="p-4 space-y-2">
                 {[
                   { id: 'Expedição A01', qty: '12 itens', icon: <Store size={14} className="text-emerald-500" />, bg: 'bg-emerald-50' },
                   { id: 'Expedição A02', qty: '08 itens', icon: <Store size={14} className="text-blue-500" />, bg: 'bg-blue-50' },
                   { id: 'Expedição A03', qty: '06 itens', icon: <Store size={14} className="text-amber-500" />, bg: 'bg-amber-50' },
                   { id: 'Expedição B01', qty: '10 itens', icon: <Store size={14} className="text-emerald-500" />, bg: 'bg-emerald-50' },
                   { id: 'Expedição B02', qty: '09 itens', icon: <Store size={14} className="text-blue-500" />, bg: 'bg-blue-50' },
                   { id: 'Conferência', qty: '05 itens', icon: <AlertCircle size={14} className="text-slate-400" />, bg: 'bg-slate-100' },
                 ].map((loc, i) => (
                   <div key={i} className="flex items-center gap-3 p-2 rounded-xl hovr:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                      <div className={`p-2 rounded-lg ${loc.bg}`}>{loc.icon}</div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{loc.id}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{loc.qty}</p>
                      </div>
                      <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-500" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ label, status, time, meta }: any) => {
  const isComplete = status === 'complete';
  const isActive = status === 'active';
  
  return (
    <div className="flex flex-col items-center gap-2 group relative">
       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isComplete ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'bg-white border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white border-slate-200'}`}>
          {isComplete && <CheckCircle2 size={10} strokeWidth={4} />}
          {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
       </div>
       <div className="flex flex-col items-center min-w-[70px]">
          <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : isComplete ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
          {time && <span className="text-[7px] font-bold text-slate-400 mt-0.5">{time}</span>}
          {meta && <span className="text-[7px] font-black text-slate-900 mt-0.5 uppercase tracking-tighter whitespace-nowrap">{meta}</span>}
       </div>
    </div>
  );
};

const SummaryCard = ({ title, value, trend, icon, bgColor }: any) => (
  <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-xl ${bgColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-lg font-black text-slate-800 tracking-tight">{value}</h3>
      <p className="text-[9px] font-black mt-1 text-slate-500 uppercase tracking-tight">{trend}</p>
    </div>
  </div>
);

const StockOverview = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Estoques</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestão Central de Almoxarifado • VMS Móveis</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <ArrowUpRight size={14} className="text-emerald-500" />
            Entrada
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <ArrowDownRight size={14} className="text-rose-500" />
            Saída
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <ArrowRightLeft size={14} className="text-blue-500" />
            Transferência
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-widest">
            <Plus size={14} />
            Novo Item
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewStatCard 
          label="Valor total em estoque" 
          value="R$ 1.248.750,00" 
          trend="+8,5% vs mês anterior" 
          icon={<Package className="text-emerald-600" size={20} />}
          bgColor="bg-emerald-50"
          showChart
        />
         <OverviewStatCard 
          label="Matéria-Prima" 
          value="R$ 645.230,00" 
          trend="51,7% do total" 
          icon={<Box className="text-blue-600" size={20} />}
          bgColor="bg-blue-50"
        />
         <OverviewStatCard 
          label="Em Processo (WIP)" 
          value="R$ 320.150,00" 
          trend="25,6% do total" 
          icon={<Factory className="text-amber-600" size={20} />}
          bgColor="bg-amber-50"
        />
         <OverviewStatCard 
          label="Produtos Acabados" 
          value="R$ 283.370,00" 
          trend="22,7% do total" 
          icon={<Package className="text-indigo-600" size={20} />}
          bgColor="bg-indigo-50"
        />
         <OverviewStatCard 
          label="Itens com estoque baixo" 
          value="18 itens" 
          trend="Requer atenção" 
          icon={<AlertTriangle className="text-rose-600" size={20} />}
          bgColor="bg-rose-50"
          isAlert
        />
      </div>

      {/* Tables Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matéria-Prima Card */}
        <InventoryTableCard 
          title="MATÉRIA-PRIMA" 
          titleColor="text-emerald-600"
          viewAllLink="#"
          items={[
            { name: 'MDF Branco 15mm', stock: '125 chapas', min: '20', available: '105' },
            { name: 'MDF Carvalho 15mm', stock: '68 chapas', min: '15', available: '53' },
            { name: 'Fita de Borda Branca', stock: '45 rolos', min: '10', available: '35' },
            { name: 'Parafuso 4,0x40mm', stock: '2.500 un', min: '500', available: '2.000' },
            { name: 'Dobradiça 35mm', stock: '1.200 un', min: '200', available: '1.000' },
          ]}
          columns={['Item', 'Estoque', 'Mínimo', 'Disponível']}
          rowRenderer={(item: any, idx: number) => (
            <tr key={idx} className="text-xs border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-3 font-bold text-slate-700 uppercase tracking-tight">{item.name}</td>
              <td className="py-3 text-slate-500 font-bold">{item.stock}</td>
              <td className="py-3 text-slate-400 font-bold">{item.min}</td>
              <td className="py-3 font-black text-slate-700 text-right">{item.available}</td>
            </tr>
          )}
        />

        {/* Em Processo Card */}
        <InventoryTableCard 
          title="EM PROCESSO (WIP)" 
          titleColor="text-amber-600"
          viewAllLink="#"
          items={[
            { step: 'Corte', qty: '152', late: '5' },
            { step: 'Colagem de Borda', qty: '128', late: '3' },
            { step: 'Usinagem', qty: '98', late: '8' },
            { step: 'Pré-Montagem', qty: '75', late: '2' },
            { step: 'Montagem', qty: '62', late: '1' },
            { step: 'Finalização', qty: '40', late: '0' },
          ]}
          columns={['Etapa', 'Qtde. de Peças', 'Em atraso']}
          rowRenderer={(item: any, idx: number) => (
            <tr key={idx} className="text-xs border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-3 font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
                <EtapaIcon step={item.step} />
                {item.step}
              </td>
              <td className="py-3 text-slate-700 text-center font-black">{item.qty}</td>
              <td className="py-3 text-center">
                <span className={`font-black ${parseInt(item.late) > 0 ? 'text-rose-500' : 'text-slate-300'}`}>{item.late}</span>
              </td>
            </tr>
          )}
        />

        {/* Produtos Acabados Card */}
        <InventoryTableCard 
          title="PRODUTOS ACABADOS" 
          titleColor="text-indigo-600"
          viewAllLink="#"
          items={[
            { status: 'Aguardando conferência', qty: '8', value: 'R$ 28.750,00' },
            { status: 'Pronto para expedição', qty: '12', value: 'R$ 65.400,00' },
            { status: 'Em expedição', qty: '5', value: 'R$ 21.300,00' },
            { status: 'Entregue', qty: '18', value: 'R$ 94.600,00' },
          ]}
          columns={['Status', 'Qtde. de Módulos', 'Valor']}
          rowRenderer={(item: any, idx: number) => (
            <tr key={idx} className="text-xs border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-3 font-bold text-slate-700 uppercase tracking-tight">{item.status}</td>
              <td className="py-3 text-slate-700 text-center font-black">{item.qty}</td>
              <td className="py-3 text-right font-black text-slate-700">{item.value}</td>
            </tr>
          )}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 font-black">
            <h3 className="text-xs text-slate-800 uppercase tracking-widest">MOVIMENTAÇÕES RECENTES</h3>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="px-5 py-3">Data/Hora</th>
                   <th className="px-5 py-3">Tipo</th>
                   <th className="px-5 py-3">Item</th>
                   <th className="px-5 py-3 text-center">Projeto / Origem</th>
                   <th className="px-5 py-3 text-center">Quantidade</th>
                   <th className="px-5 py-3 text-right">Usuário</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {[
                   { time: '20/05 08:42', type: 'Saída', item: 'MDF Branco 15mm', origin: 'Cozinha - João Silva', qty: '-2 chapas', user: 'Marcos', flow: 'out' },
                   { time: '20/05 08:15', type: 'Entrada', item: 'Parafuso 4,0x40mm', origin: 'Compra #1258', qty: '+1.000 un', user: 'Marcos', flow: 'in' },
                   { time: '20/05 07:58', type: 'Saída', item: 'Fita de Borda Branca', origin: 'OP 12345', qty: '-5 rolos', user: 'Lucas', flow: 'out' },
                   { time: '19/05 17:32', type: 'Transferência', item: 'MDF Carvalho 15mm', origin: 'Depósito A → B', qty: '+10 chapas', user: 'Lucas', flow: 'transfer' },
                   { time: '19/05 16:20', type: 'Ajuste', item: 'Dobradiça 35mm', origin: 'Inventário', qty: '-3 un', user: 'Marcos', flow: 'out' },
                 ].map((move, i) => (
                   <tr key={i} className="text-xs hover:bg-slate-50 transition-colors">
                     <td className="px-5 py-4 text-slate-500 font-bold font-mono text-[10px]">{move.time}</td>
                     <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {move.flow === 'in' ? <ArrowUpRight size={14} className="text-emerald-500" /> : 
                           move.flow === 'out' ? <ArrowDownRight size={14} className="text-rose-500" /> :
                           <ArrowRightLeft size={14} className="text-blue-500" />}
                          <span className="font-black text-slate-700 uppercase tracking-tighter">{move.type}</span>
                        </div>
                     </td>
                     <td className="px-5 py-4 text-slate-800 font-bold uppercase tracking-tight">{move.item}</td>
                     <td className="px-5 py-4 text-slate-500 font-bold uppercase tracking-tighter text-[9px] text-center">{move.origin}</td>
                     <td className={`px-5 py-4 font-black text-center ${move.qty.startsWith('-') ? 'text-rose-600' : move.qty.startsWith('+') ? 'text-emerald-600' : 'text-blue-600'}`}>
                       {move.qty}
                     </td>
                     <td className="px-5 py-4 text-slate-500 font-bold text-right uppercase tracking-tighter text-[9px]">{move.user}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2">
              Ver todas as movimentações
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Alerts and Pendencies Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white font-black">
            <h3 className="text-xs text-slate-800 uppercase tracking-widest">ALERTAS E PENDÊNCIAS</h3>
          </div>
          <div className="p-5 space-y-4 flex-1">
             <OverviewAlertItem 
                icon={<AlertTriangle size={18} className="text-rose-600" />}
                bgColor="bg-rose-50"
                title="Estoque baixo"
                description="18 itens abaixo do estoque mínimo"
             />
             <OverviewAlertItem 
                icon={<Clock size={18} className="text-amber-600" />}
                bgColor="bg-amber-50"
                title="Materiais em atraso"
                description="5 pedidos de compra em atraso"
             />
             <OverviewAlertItem 
                icon={<TrendingUp size={18} className="text-orange-600" />}
                bgColor="bg-orange-50"
                title="Gargalos na produção"
                description="Usinagem com fila elevada"
             />
             <OverviewAlertItem 
                icon={<History size={18} className="text-blue-600" />}
                bgColor="bg-blue-50"
                title="Inventário"
                description="Inventário geral agendado para 25/05/2024"
             />
          </div>
          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2">
              Ver todos os alertas
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewStatCard = ({ label, value, trend, icon, bgColor, showChart = false, isAlert = false }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      {showChart && (
        <div className="h-8 w-16 opacity-40 group-hover:opacity-100 transition-all">
           <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-500" fill="none" stroke="currentColor">
              <path d="M0,35 Q20,30 40,20 T80,10 T100,5" strokeWidth="4" />
           </svg>
        </div>
      )}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-lg font-black text-slate-800 tracking-tight">{value}</h3>
      <p className={`text-[9px] font-black mt-1 uppercase tracking-tighter ${isAlert ? 'text-rose-500' : 'text-emerald-500'}`}>{trend}</p>
    </div>
  </div>
);

const InventoryTableCard = ({ title, titleColor, items, columns, rowRenderer }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-all">
    <div className="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 font-black">
      <h3 className={`text-[10px] uppercase tracking-widest ${titleColor}`}>{title}</h3>
      <button className="text-[10px] text-indigo-600 hover:underline uppercase tracking-widest">Ver todos</button>
    </div>
    <div className="px-5 py-0 flex-1 overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50 font-black">
            {columns.map((col: string, i: number) => (
              <th key={i} className={`py-3 ${i === columns.length - 1 ? 'text-right' : ''}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(rowRenderer)}
        </tbody>
      </table>
    </div>
    <div className="p-4 border-t border-slate-50 bg-slate-50/20">
       <button className="text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center justify-between w-full group">
          <span>Ver todos os itens</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
       </button>
    </div>
  </div>
);

const OverviewAlertItem = ({ icon, bgColor, title, description }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
    <div className={`p-2 rounded-lg ${bgColor} shadow-sm`}>
      {icon}
    </div>
    <div className="flex-1">
       <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{title}</h4>
       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{description}</p>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
  </div>
);

const EtapaIcon = ({ step }: { step: string }) => {
  switch (step) {
    case 'Corte': return <Box size={14} className="text-slate-400" />;
    case 'Colagem de Borda': return <Layers size={14} className="text-amber-400" />;
    case 'Usinagem': return <Wrench size={14} className="text-slate-400" />;
    case 'Pré-Montagem': return <Box size={14} className="text-emerald-400" />;
    case 'Montagem': return <Package size={14} className="text-indigo-400" />;
    case 'Finalização': return <Clock size={14} className="text-slate-400" />;
    default: return <Package size={14} className="text-slate-400" />;
  }
};

const PlaceholderTab = ({ name }: { name: string }) => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{name}</h1>
        <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Módulo em Desenvolvimento • Gestão de Estoque</p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
          <Download size={16} />
          Exportar
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-widest">
          <Plus size={16} />
          Novo Item
        </button>
      </div>
    </div>

    {/* Search and Filter */}
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Buscar por código, nome ou categoria..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
          <Filter size={18} />
          Filtros
        </button>
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
          <History size={18} />
          Histórico
        </button>
      </div>
    </div>

    {/* Table Example */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4 text-center">Quantidade</th>
              <th className="px-6 py-4 text-center">Unid.</th>
              <th className="px-6 py-4 text-center">Valor Unit.</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <tr key={i} className="text-xs hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-400 font-bold">#ITM-00{i}</td>
                <td className="px-6 py-4 font-black text-slate-800 uppercase tracking-tight">Exemplo de Item {i}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">MDF</span>
                </td>
                <td className="px-6 py-4 font-black text-slate-700 text-center">1{i}0</td>
                <td className="px-6 py-4 text-slate-500 uppercase font-black text-center">Un</td>
                <td className="px-6 py-4 font-black text-slate-800 text-center">R$ {i}5,00</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-widest">Disponível</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between font-black">
         <p className="text-[10px] text-slate-400 uppercase tracking-widest">Mostrando 8 de 124 itens</p>
         <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] uppercase hover:bg-slate-50 transition-colors">Anterior</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] uppercase hover:bg-slate-50 transition-colors">Próximo</button>
         </div>
      </div>
    </div>
  </div>
);

const Modal = ({ title, onClose, children, size = '2xl' }: { title: string; onClose: () => void; children: React.ReactNode, size?: '2xl' | '4xl' | '5xl' }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${size === '5xl' ? 'max-w-5xl' : size === '4xl' ? 'max-w-4xl' : 'max-w-2xl'} overflow-hidden animate-in fade-in zoom-in duration-300`}>
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[85vh]">
        {children}
      </div>
    </div>
  </div>
);

const RawMaterialForm = ({ onClose, onSave, initialData }: { onClose: () => void, onSave: (item: any) => void, initialData?: any }) => {
  const [activeTab, setActiveTab] = useState('geral');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    cat: initialData?.cat || '',
    unit: initialData?.unit || '',
    brand: initialData?.brand || '',
    fornecedor: initialData?.fornecedor || '',
    desc: initialData?.desc || '',
    barcode: initialData?.barcode || '',
    finish: initialData?.finish || '',
    minStock: initialData?.minStock || 0,
    initialStock: initialData?.initialStock || 0,
    cost: initialData?.cost?.toString() || '',
    loc: initialData?.loc || '',
    obs: initialData?.obs || '',
    image: initialData?.image || null as string | null,
  });

  const isFormValid = () => {
    return formData.name !== '' && 
           formData.cat !== '' && 
           formData.unit !== '' && 
           formData.minStock > 0 && 
           formData.cost !== '' && 
           formData.loc !== '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const newItem = {
      ...formData,
      current: Number(formData.initialStock),
      res: 0,
      cost: Number(formData.cost.replace('R$', '').replace(',', '.').trim()) || 0,
      loc: 'A01-P01', // Default location if not provided
    };

    onSave(newItem);
    onClose();
  };

  const tabs = [
    { id: 'geral', label: 'Informações Gerais', icon: <Info size={16} /> },
    { id: 'estoque', label: 'Estoque e Preço', icon: <Package size={16} /> },
    { id: 'localizacao', label: 'Localização e Observações', icon: <MapPin size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="px-6 border-b border-slate-100 bg-slate-50/30">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      <form className="p-8 space-y-8" onSubmit={handleSave}>
        {activeTab === 'geral' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-8 items-start">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Foto do Produto</label>
                <div 
                  onClick={() => document.getElementById('raw-material-image')?.click()}
                  className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group overflow-hidden"
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-2">Upload</span>
                    </>
                  )}
                  <input 
                    id="raw-material-image"
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Nome do Item <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: MDF Branco 15mm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Código (SKU)</label>
                  <input 
                    type="text" 
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: MDF0001" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Categoria <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={formData.cat}
                      onChange={(e) => setFormData({...formData, cat: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 appearance-none"
                    >
                      <option value="">Selecione...</option>
                      <option>MDF</option>
                      <option>Ferragens</option>
                      <option>Fitas de Borda</option>
                      <option>Insumos</option>
                      <option>Vidros</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Unidade de Medida <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 appearance-none"
                    >
                      <option value="">Selecione...</option>
                      <option>Chapa</option>
                      <option>Unidade</option>
                      <option>m²</option>
                      <option>Rolo</option>
                      <option>kg</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-50 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Marca</label>
                <input 
                  type="text" 
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: Duratex" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Fornecedor Padrão</label>
                <div className="relative">
                  <select 
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 appearance-none"
                  >
                    <option value="">Selecione...</option>
                    <option>Gmad</option>
                    <option>Leo Madeiras</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black text-slate-700">Descrição</label>
                  <span className="text-[10px] font-bold text-slate-400">{formData.desc.length}/200</span>
                </div>
                <textarea 
                  rows={3} 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value.slice(0, 200)})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none" placeholder="Descrição do material..." 
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Código de Barras</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: 7891234567890" 
                    />
                    <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700">Cor / Acabamento</label>
                  <input 
                    type="text" 
                    value={formData.finish}
                    onChange={(e) => setFormData({...formData, finish: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: Branco, Carvalho, Fosco..." 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Estoque Mínimo <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Estoque Inicial</label>
                <input 
                  type="number" 
                  value={formData.initialStock}
                  onChange={(e) => setFormData({...formData, initialStock: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Custo Unitário (R$) <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="0,00" 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'localizacao' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Localização Física (Corredor/Box) <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.loc}
                  onChange={(e) => setFormData({...formData, loc: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700" placeholder="Ex.: A01-P01" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-700">Observações Internas</label>
                <textarea 
                  rows={4} 
                  value={formData.obs}
                  onChange={(e) => setFormData({...formData, obs: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none" placeholder="Notas sobre o item..." 
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-8 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={!isFormValid()}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:translate-y-0 ${isFormValid() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Salvar e Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

const WipMovementForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Peça / Conjunto <span className="text-rose-500">*</span></label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                <option value="">Selecione a peça...</option>
                <option>LAT DIR 720x350x18 (#PE-000987)</option>
                <option>LAT ESQ 720x350x18 (#PE-000988)</option>
              </select>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Etapa de Destino <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                  <option>Borda</option>
                  <option>Usinagem</option>
                  <option>Pré-Montagem</option>
                  <option>Montagem</option>
                  <option>Pintura</option>
                  <option>Finalização</option>
                </select>
                <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Responsável</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                  <option>Selecione o operador...</option>
                  <option>Carlos Lima</option>
                  <option>João Pedro</option>
                  <option>Marcos Paulo</option>
                </select>
                <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Data / Hora Início</label>
              <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Previsão de Término</label>
              <input type="datetime-local" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Observações / Motivo (Opcional)</label>
            <textarea rows={3} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none" placeholder="Detalhes da movimentação..." />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-8 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Confirmar Movimentação
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

const FinishedProductForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Móvel / Item Acabado <span className="text-rose-500">*</span></label>
            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Ex: Cozinha Completa - Módulo Superior" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Projeto / Cliente <span className="text-rose-500">*</span></label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                <option value="">Selecione o projeto...</option>
                <option>Cozinha João Silva (#PROJ-1258)</option>
                <option>Dormitório Ana (#PROJ-1259)</option>
              </select>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Ambiente</label>
            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Ex: Cozinha, Sala, Suíte" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Quantidade de Volumes</label>
            <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Localização de Estoque</label>
            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Ex: Expedição A01" />
          </div>
        </div>

        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-black text-amber-900 uppercase tracking-tight mb-1">Informação Importante</p>
            <p className="text-xs text-amber-800 font-medium leading-relaxed">Ao cadastrar como item acabado, o sistema baixará automaticamente as matérias-primas e horas de WIP envolvidas na produção deste item.</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-8 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Finalizar Produto
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

