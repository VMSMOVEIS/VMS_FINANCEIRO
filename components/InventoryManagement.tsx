import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ArrowRight,
  History,
  Tag,
  Calendar,
  Layers,
  Box,
  X,
  Trash2,
  CheckCircle,
  Edit2,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Truck
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { InventoryItem, Supplier } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

interface ProductionInventoryProps {
  activeSubItem?: string | null;
}

export const InventoryManagement: React.FC<ProductionInventoryProps> = ({ activeSubItem }) => {
  const { 
    stockAgingConfigs, 
    stockConfigItems,
    inventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem,
    finalizeProcess,
    addStockConfigItem,
    productionOrders,
    stockMovements,
    addStockMovement,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
  } = useProduction();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<any>(null);
  const [quickAddName, setQuickAddName] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sob_medida' | 'pronta_entrega'>('sob_medida');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [activeMainTab, setActiveMainTab] = useState<'cadastro' | 'entrada' | 'dashboard' | 'fornecedores'>('cadastro');

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierFormData, setSupplierFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    category: '',
    status: 'active',
    notes: '',
    rating: 0,
    lastOrderDate: ''
  });

  const [newItem, setNewItem] = useState({
    inventoryId: '',
    quantity: 0,
    unitCost: 0,
    itemCode: '',
    reason: 'purchase'
  });

  const [entryFormData, setEntryFormData] = useState({
    supplier: '',
    discount: 0,
    date: new Date().toISOString().split('T')[0],
    responsible: '',
    items: [
      { inventoryId: '', quantity: 0, unitCost: 0, itemCode: '', reason: 'purchase' }
    ]
  });

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    code: '',
    name: '',
    description: '',
    type: 'mp',
    category: '',
    stockCategory: 'pronta_entrega',
    brand: '',
    model: '',
    quantity: 0,
    unit: 'UN',
    location: '',
    value: 0,
    estimatedCost: 0,
    minStock: 0,
    maxStock: 0,
    margin: 0,
    markup: 0,
    commission: 0,
    warranty: '',
    productionLeadTime: 0,
    ncm: '',
    cfop: '',
    cst_csosn: '',
    entryDate: new Date().toISOString().split('T')[0],
    trackStock: true,
    averageCost: 0,
    lastPurchaseCost: 0,
    standardCost: 0,
    defaultSupplierId: '',
    purchaseLeadTime: 0,
    minPurchaseQuantity: 0,
    purchaseUnit: '',
    consumptionUnit: '',
    conversionFactor: 1,
    thickness: undefined,
    color: '',
    length: undefined,
    width: undefined,
    baseMaterial: '',
    productOrigin: '',
    productionTimePerUnit: 0,
    status: 'active'
  });

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeSubItem === 'estoque_mp') return matchesSearch && item.type === 'mp';
      if (activeSubItem === 'estoque_pa') {
        return matchesSearch && item.type === 'pa' && item.stockCategory === activeTab;
      }
      if (activeSubItem === 'estoque_processo') return false; // Handled by filteredOrders
      
      return matchesSearch;
    });
  }, [activeSubItem, searchTerm, inventory, activeTab]);

  const filteredOrders = useMemo(() => {
    if (activeSubItem !== 'estoque_processo') return [];
    return productionOrders.filter(order => {
      const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isInProcess = order.status === 'in_production' || order.status === 'waiting';
      
      // Filter by activeTab (sob_medida vs pronta_entrega)
      // We look up the corresponding PA item to determine its category
      const paItem = inventory.find(item => item.name === order.productName && item.type === 'pa');
      const matchesTab = paItem ? paItem.stockCategory === activeTab : true;

      return matchesSearch && isInProcess && matchesTab;
    });
  }, [activeSubItem, searchTerm, productionOrders, inventory, activeTab]);

  const getStockStatus = (item: InventoryItem) => {
    const hasActiveOP = productionOrders.some(op => 
      op.productName === item.name && (op.status === 'in_production' || op.status === 'waiting')
    );

    if (item.quantity === 0) return { label: 'Sem estoque', color: 'bg-red-100 text-red-700' };
    if (hasActiveOP) return { label: 'Em produção', color: 'bg-blue-100 text-blue-700' };
    if (item.quantity <= (item.minStock || 0)) return { label: 'Estoque está baixo', color: 'bg-orange-100 text-orange-700' };
    if (item.quantity <= (item.maxStock || Infinity)) return { label: 'Estoque confortável', color: 'bg-emerald-100 text-emerald-700' };
    return { label: 'Estoque excessivo', color: 'bg-purple-100 text-purple-700' };
  };

  const calculateDiscount = (entryDate: string) => {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const applicableConfig = [...stockAgingConfigs]
      .filter(c => c.active && diffDays >= c.days)
      .sort((a, b) => b.days - a.days)[0];

    return applicableConfig ? applicableConfig.discount : 0;
  };

  const getTitle = () => {
    switch (activeSubItem) {
      case 'estoque_mp': return 'Estoque de Matéria-Prima';
      case 'estoque_pa': return 'Estoque de Produtos Acabados (PA)';
      case 'estoque_processo': return 'Estoque de Produtos em Processo';
      case 'vendas_estoque_pa': return 'Estoque de Vendas (Produtos Acabados)';
      case 'vendas_estoque_kits': return 'Estoque de Vendas (Kits)';
      case 'compras_estoque_mp': return 'Estoque de Compras (Matéria-Prima)';
      case 'compras_estoque_insumos': return 'Estoque de Compras (Insumos)';
      default: return 'Gestão de Estoques';
    }
  };

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code || '',
        name: item.name,
        description: item.description || '',
        type: item.type,
        category: item.category || '',
        stockCategory: item.stockCategory || 'pronta_entrega',
        brand: item.brand || '',
        model: item.model || '',
        quantity: item.quantity,
        unit: item.unit,
        location: item.location || '',
        value: item.value,
        estimatedCost: item.estimatedCost || 0,
        minStock: item.minStock || 0,
        maxStock: item.maxStock || 0,
        margin: item.margin || 0,
        markup: item.markup || 0,
        commission: item.commission || 0,
        warranty: item.warranty || '',
        productionLeadTime: item.productionLeadTime || 0,
        ncm: item.ncm || '',
        cfop: item.cfop || '',
        cst_csosn: item.cst_csosn || '',
        entryDate: item.entryDate,
        trackStock: item.trackStock ?? true,
        averageCost: item.averageCost || 0,
        lastPurchaseCost: item.lastPurchaseCost || 0,
        standardCost: item.standardCost || 0,
        defaultSupplierId: item.defaultSupplierId || '',
        purchaseLeadTime: item.purchaseLeadTime || 0,
        minPurchaseQuantity: item.minPurchaseQuantity || 0,
        purchaseUnit: item.purchaseUnit || '',
        consumptionUnit: item.consumptionUnit || '',
        conversionFactor: item.conversionFactor || 1,
        thickness: item.thickness,
        color: item.color || '',
        length: item.length,
        width: item.width,
        baseMaterial: item.baseMaterial || '',
        productOrigin: item.productOrigin || '',
        productionTimePerUnit: item.productionTimePerUnit || 0,
        status: item.status || 'active'
      });
    } else {
      setEditingItem(null);
      // Auto-set type based on activeSubItem
      let defaultType: 'mp' | 'pa' | 'processo' = 'mp';
      let defaultStockCategory: 'pronta_entrega' | 'sob_medida' = 'pronta_entrega';
      
      if (activeSubItem === 'estoque_mp' || activeSubItem === 'compras_estoque_mp') {
        defaultType = 'mp';
        defaultStockCategory = 'pronta_entrega';
      } else if (activeSubItem === 'estoque_pa' || activeSubItem === 'vendas_estoque_pa') {
        defaultType = 'pa';
        defaultStockCategory = activeTab;
      } else if (activeSubItem === 'estoque_processo') {
        defaultType = 'processo';
        defaultStockCategory = activeTab;
      } else if (activeSubItem === 'vendas_estoque_kits') {
        defaultType = 'pa';
        defaultStockCategory = 'pronta_entrega';
      } else if (activeSubItem === 'compras_estoque_insumos') {
        defaultType = 'mp';
        defaultStockCategory = 'pronta_entrega';
      }

      setFormData({
        code: '',
        name: '',
        description: '',
        type: defaultType,
        category: '',
        stockCategory: defaultStockCategory,
        brand: '',
        model: '',
        quantity: 0,
        unit: 'UN',
        location: '',
        value: 0,
        estimatedCost: 0,
        minStock: 0,
        maxStock: 0,
        margin: 0,
        markup: 0,
        commission: 0,
        warranty: '',
        productionLeadTime: 0,
        ncm: '',
        cfop: '',
        cst_csosn: '',
        entryDate: new Date().toISOString().split('T')[0],
        trackStock: true,
        averageCost: 0,
        lastPurchaseCost: 0,
        standardCost: 0,
        defaultSupplierId: '',
        purchaseLeadTime: 0,
        minPurchaseQuantity: 0,
        purchaseUnit: '',
        consumptionUnit: '',
        conversionFactor: 1,
        thickness: undefined,
        color: '',
        length: undefined,
        width: undefined,
        baseMaterial: '',
        productOrigin: '',
        productionTimePerUnit: 0,
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleQuickAdd = () => {
    if (quickAddName && quickAddType) {
      addStockConfigItem({
        name: quickAddName,
        type: quickAddType
      });
      setQuickAddName('');
      setIsQuickAddOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateInventoryItem({ ...formData, id: editingItem.id });
    } else {
      await addInventoryItem({ ...formData, id: '' });
    }
    setIsModalOpen(false);
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalItemsValue = entryFormData.items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
    
    for (const item of entryFormData.items) {
      const itemValue = item.quantity * item.unitCost;
      const proratedDiscount = totalItemsValue > 0 
        ? (itemValue / totalItemsValue) * entryFormData.discount 
        : 0;
      
      const finalTotalValue = itemValue - proratedDiscount;

      await addStockMovement({
        inventory_id: item.inventoryId,
        type: 'entry',
        quantity: Number(item.quantity),
        unit_cost: Number(item.unitCost),
        total_value: finalTotalValue,
        reason: item.reason,
        responsible: entryFormData.responsible,
        date: entryFormData.date,
        supplier: entryFormData.supplier,
        item_code: item.itemCode,
        discount: proratedDiscount
      });
    }
    
    setIsEntryModalOpen(false);
    setEntryFormData({
      supplier: '',
      discount: 0,
      date: new Date().toISOString().split('T')[0],
      responsible: '',
      items: [{ inventoryId: '', quantity: 0, unitCost: 0, itemCode: '', reason: 'purchase' }]
    });
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier({ ...supplierFormData, id: editingSupplier.id });
    } else {
      addSupplier(supplierFormData);
    }
    setIsSupplierModalOpen(false);
  };

  const addItemToEntry = () => {
    if (!newItem.inventoryId || newItem.quantity <= 0) return;
    
    setEntryFormData({
      ...entryFormData,
      items: [...entryFormData.items, { ...newItem }]
    });
    
    setNewItem({
      inventoryId: '',
      quantity: 0,
      unitCost: 0,
      itemCode: '',
      reason: 'purchase'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
      await deleteInventoryItem(id);
      setShowActions(null);
    }
  };

  // Dashboard Data
  const dashboardStats = useMemo(() => {
    const lowStock = inventory.filter(item => item.quantity <= (item.minStock || 0));
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const agingItems = inventory.filter(item => new Date(item.entryDate) < thirtyDaysAgo);

    const movementsByType = stockMovements.reduce((acc: any, m) => {
      const itemName = inventory.find(i => i.id === m.inventory_id)?.name || 'Desconhecido';
      if (!acc[itemName]) acc[itemName] = { name: itemName, entries: 0, exits: 0 };
      if (m.type === 'entry') acc[itemName].entries += Number(m.quantity);
      else acc[itemName].exits += Number(m.quantity);
      return acc;
    }, {});

    const topEntries = Object.values(movementsByType)
      .sort((a: any, b: any) => b.entries - a.entries)
      .slice(0, 5);

    const topExits = Object.values(movementsByType)
      .sort((a: any, b: any) => b.exits - a.exits)
      .slice(0, 5);

    // Cost evolution (last 10 movements)
    const costEvolution = stockMovements
      .filter(m => m.type === 'entry')
      .slice(0, 10)
      .reverse()
      .map(m => ({
        date: new Date(m.date).toLocaleDateString('pt-BR'),
        cost: Number(m.unit_cost)
      }));

    return {
      lowStock,
      agingItems,
      topEntries,
      topExits,
      costEvolution
    };
  }, [inventory, stockMovements]);

  const isMP = activeSubItem === 'estoque_mp' || activeSubItem === 'compras_estoque_mp';

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-orange-600" size={28} />
            {getTitle()}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Controle de saldos, localizações e envelhecimento de produtos</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEntryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ArrowDownCircle size={18} /> Dar Entrada
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> {isMP ? 'Novo Cadastro' : 'Novo Produto'}
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveMainTab('cadastro')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeMainTab === 'cadastro' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cadastro & Listagem
          {activeMainTab === 'cadastro' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveMainTab('entrada')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeMainTab === 'entrada' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Almoxarifado (Movimentações)
          {activeMainTab === 'entrada' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveMainTab('dashboard')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeMainTab === 'dashboard' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dashboard & BI
          {activeMainTab === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveMainTab('fornecedores')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeMainTab === 'fornecedores' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Fornecedores
          {activeMainTab === 'fornecedores' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />}
        </button>
      </div>

      {activeMainTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Em Baixa</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.lowStock.length}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-400">Itens abaixo do estoque mínimo</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Aging (+30 dias)</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.agingItems.length}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-400">Itens sem movimentação recente</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <ArrowDownCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Entradas (Mês)</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stockMovements.filter(m => m.type === 'entry').length}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-gray-400">Total de entradas registradas</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <ArrowUpCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saídas (Mês)</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stockMovements.filter(m => m.type === 'exit').length}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-gray-400">Total de saídas registradas</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" size={20} />
                Maiores Entradas (Top 5)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.topEntries}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="entries" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ArrowUpCircle className="text-blue-600" size={20} />
                Maiores Saídas (Top 5)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.topExits}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="exits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-orange-600" size={20} />
                Evolução de Custos (Valores)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats.costEvolution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} tickFormatter={(val) => `R$ ${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="cost" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : activeMainTab === 'fornecedores' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="text-orange-600" size={20} />
              Lista de Fornecedores
            </h2>
            <button 
              onClick={() => {
                setEditingSupplier(null);
                setSupplierFormData({
                  name: '',
                  cnpj: '',
                  contactName: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  category: '',
                  status: 'active',
                  notes: '',
                  rating: 0,
                  lastOrderDate: ''
                });
                setIsSupplierModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm text-sm"
            >
              <Plus size={18} /> Novo Fornecedor
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fornecedor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{s.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{s.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.cnpj || '-'}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{s.contactName || '-'}</p>
                      <p className="text-xs text-gray-500">{s.email}</p>
                      <p className="text-[10px] text-gray-400">{s.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                        {s.category || 'Geral'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingSupplier(s);
                            setSupplierFormData({ ...s });
                            setIsSupplierModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteSupplier(s.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeMainTab === 'entrada' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Histórico de Movimentações</h3>
            <button 
              onClick={() => setIsEntryModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              <Plus size={14} /> Nova Entrada
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Custo Unit.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Desconto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockMovements.map(m => {
                  const item = inventory.find(i => i.id === m.inventory_id);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(m.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{item?.name || 'Item Excluído'}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{m.inventory_id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          m.type === 'entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {m.type === 'entry' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {m.quantity} {item?.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.unit_cost || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.total_value || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">
                        {m.discount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.discount) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {m.reason === 'purchase' ? 'Compra' : m.reason === 'sale' ? 'Venda' : m.reason === 'adjustment' ? 'Ajuste' : m.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs for PA and Processo */}
      {(activeSubItem === 'estoque_pa' || activeSubItem === 'estoque_processo') && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('sob_medida')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'sob_medida' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sob Medida
            </button>
            <button
              onClick={() => setActiveTab('pronta_entrega')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'pronta_entrega' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pronta Entrega
            </button>
          </div>

          {activeSubItem === 'estoque_processo' && (
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lista
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white transition-colors">
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeSubItem === 'estoque_processo' && viewMode === 'kanban' ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50">
              {['waiting', 'in_production'].map(status => (
                <div key={status} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status === 'waiting' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      {status === 'waiting' ? 'Aguardando' : 'Em Produção'}
                    </h3>
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {filteredOrders.filter(o => o.status === status).length}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {filteredOrders.filter(o => o.status === status).map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">#{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.priority === 'high' ? 'bg-red-100 text-red-600' : 
                            order.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {order.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{order.productName}</h4>
                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                          <Tag size={12} /> {order.client}
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                            <Calendar size={12} />
                            {new Date(order.deadline).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900">
                            <Box size={12} />
                            {order.quantity} UN
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : activeSubItem === 'estoque_processo' && viewMode === 'list' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">OP ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Previsão</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-bold">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.productName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.client}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.quantity} UN</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.deadline).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.status === 'in_production' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status === 'in_production' ? 'Em Produção' : 'Aguardando'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{isMP ? 'Material' : 'Produto'}</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  {isMP && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Modelo</th>
                    </>
                  )}
                  {!isMP && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo</th>
                  {isMP && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">T. Produção</th>
                  )}
                  {!isMP && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço de Venda</th>
                  )}
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => {
                  const discount = calculateDiscount(item.entryDate);
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                      onClick={() => handleOpenModal(item)}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600 font-bold">{item.code || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                            {item.type === 'mp' ? <Layers size={20} /> : item.type === 'pa' ? <Box size={20} /> : <History size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono uppercase truncate max-w-[100px]">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                          {item.category || '-'}
                        </span>
                      </td>
                      {isMP && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.brand || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.model || '-'}</td>
                        </>
                      )}
                      {!isMP && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.brand || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                        </>
                      )}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                            <span className="text-[10px] font-bold text-gray-400">{item.unit}</span>
                          </div>
                          {discount > 0 && (item.type === 'pa' || item.type === 'processo') && (
                            <div className="flex items-center gap-1 mt-1">
                              <History size={10} className="text-orange-500" />
                              <span className="text-[10px] font-bold text-orange-600">-{discount}% aging</span>
                            </div>
                          )}
                        </td>
                      {isMP && (
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{item.productionTimePerUnit || 0} min/{item.unit}</span>
                        </td>
                      )}
                      {!isMP && (
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setShowActions(showActions === item.id ? null : item.id)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {showActions === item.id && (
                          <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                            <button 
                              onClick={() => {
                                handleOpenModal(item);
                                setShowActions(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              <Edit2 size={16} /> Editar Item
                            </button>
                            {item.type === 'processo' && (
                              <button 
                                onClick={() => {
                                  finalizeProcess(item.id);
                                  setShowActions(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <CheckCircle size={16} /> Finalizar
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Excluir Item
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nenhum item encontrado no estoque selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </>
      )}

      {/* Modal de Entrada de Estoque */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {isMP ? <Layers size={24} /> : <Box size={24} />}
                {editingItem ? 'Editar Item' : isMP ? 'Cadastrar Matéria-Prima' : 'Cadastrar Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-100px)] max-h-[900px]">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Identificação */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Tag size={16} /> Identificação
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          placeholder={isMP ? "Ex: Chapa MDF 18mm Carvalho" : "Ex: Mesa de Jantar 6 Lugares"} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código</label>
                        <input 
                          type="text" 
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          placeholder="Ex: MP001" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-500 uppercase">Categoria</label>
                          <button 
                            type="button"
                            onClick={() => {
                              setQuickAddType(isMP ? 'mp_category' : 'pa_category');
                              setIsQuickAddOpen(true);
                            }}
                            className="text-orange-600 hover:text-orange-700 p-1"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                        >
                          <option value="">Selecione...</option>
                          {stockConfigItems
                            .filter(i => i.type === (isMP ? 'mp_category' : 'pa_category'))
                            .map(i => (
                              <option key={i.id} value={i.name}>{i.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      {!isMP && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destino</label>
                          <select 
                            value={formData.stockCategory}
                            onChange={(e) => setFormData({...formData, stockCategory: e.target.value as any})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                          >
                            <option value="sob_medida">Sob medida</option>
                            <option value="pronta_entrega">A pronta entrega</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marca</label>
                        <input 
                          type="text" 
                          value={formData.brand}
                          onChange={(e) => setFormData({...formData, brand: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo</label>
                        <input 
                          type="text" 
                          value={formData.model}
                          onChange={(e) => setFormData({...formData, model: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm h-20 resize-none" 
                        />
                      </div>
                    </div>
                  </section>

                  {isMP && (
                    <>
                      {/* Especificações Técnicas */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Filter size={16} /> Especificações Técnicas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Espessura (mm)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.thickness || ''}
                              onChange={(e) => setFormData({...formData, thickness: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor / Padrão</label>
                            <input 
                              type="text" 
                              value={formData.color}
                              onChange={(e) => setFormData({...formData, color: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Material Base</label>
                            <select 
                              value={formData.baseMaterial}
                              onChange={(e) => setFormData({...formData, baseMaterial: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="MDF">MDF</option>
                              <option value="MDP">MDP</option>
                              <option value="Metal">Metal</option>
                              <option value="Plástico">Plástico</option>
                              <option value="Madeira">Madeira Maciça</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comprimento (mm)</label>
                            <input 
                              type="number" 
                              value={formData.length || ''}
                              onChange={(e) => setFormData({...formData, length: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Largura (mm)</label>
                            <input 
                              type="number" 
                              value={formData.width || ''}
                              onChange={(e) => setFormData({...formData, width: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo de Produção (min/{formData.unit})</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.productionTimePerUnit || ''}
                              onChange={(e) => setFormData({...formData, productionTimePerUnit: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Controle de Estoque */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Box size={16} /> Controle de Estoque
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Atual</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.quantity}
                              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Mínimo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.minStock}
                              onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Máximo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.maxStock}
                              onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('uom');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.unit}
                              onChange={(e) => setFormData({...formData, unit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'uom')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                              {stockConfigItems.filter(i => i.type === 'uom').length === 0 && (
                                <>
                                  <option value="UN">Unidade (UN)</option>
                                  <option value="CH">Chapa (CH)</option>
                                  <option value="MT">Metro (MT)</option>
                                  <option value="M2">Metro Quadrado (M2)</option>
                                  <option value="KG">Quilo (KG)</option>
                                  <option value="KIT">Kit (KIT)</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Localização</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('location');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'location')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <input 
                              type="checkbox" 
                              id="trackStock"
                              checked={formData.trackStock}
                              onChange={(e) => setFormData({...formData, trackStock: e.target.checked})}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="trackStock" className="text-xs font-bold text-gray-500 uppercase cursor-pointer">Controla Estoque</label>
                          </div>
                        </div>
                      </section>

                      {/* Informações de Custos */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <History size={16} /> Informações de Custos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Médio (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.averageCost}
                              onChange={(e) => setFormData({...formData, averageCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Último Custo (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.lastPurchaseCost}
                              onChange={(e) => setFormData({...formData, lastPurchaseCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Padrão (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.standardCost}
                              onChange={(e) => setFormData({...formData, standardCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Informações de Compra */}
                      {!isMP && (
                        <section>
                          <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Plus size={16} /> Informações de Compra
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor Padrão</label>
                              <input 
                                type="text" 
                                value={formData.defaultSupplierId}
                                onChange={(e) => setFormData({...formData, defaultSupplierId: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                                placeholder="ID ou Nome do Fornecedor"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo Entrega (dias)</label>
                              <input 
                                type="number" 
                                value={formData.purchaseLeadTime}
                                onChange={(e) => setFormData({...formData, purchaseLeadTime: Number(e.target.value)})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qtd Mínima Compra</label>
                              <input 
                                type="number" 
                                step="0.01"
                                value={formData.minPurchaseQuantity}
                                onChange={(e) => setFormData({...formData, minPurchaseQuantity: Number(e.target.value)})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Compra</label>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setQuickAddType('purchase_unit');
                                    setIsQuickAddOpen(true);
                                  }}
                                  className="text-orange-600 hover:text-orange-700 p-1"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <select 
                                value={formData.purchaseUnit}
                                onChange={(e) => setFormData({...formData, purchaseUnit: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                              >
                                <option value="">Selecione...</option>
                                {stockConfigItems
                                  .filter(i => i.type === 'purchase_unit')
                                  .map(i => (
                                    <option key={i.id} value={i.name}>{i.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Conversão de Unidades */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ArrowRight size={16} /> Conversão de Unidades
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Consumo</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('consumption_unit');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.consumptionUnit}
                              onChange={(e) => setFormData({...formData, consumptionUnit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'consumption_unit')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fator de Conversão</label>
                            <input 
                              type="number" 
                              step="0.0001"
                              value={formData.conversionFactor}
                              onChange={(e) => setFormData({...formData, conversionFactor: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                              placeholder="Ex: 5.5"
                            />
                          </div>
                          <p className="md:col-span-2 text-[10px] text-gray-400 italic">
                            Exemplo: 1 {formData.unit || 'unidade'} = {formData.conversionFactor} {formData.consumptionUnit || 'unidade de consumo'}
                          </p>
                        </div>
                      </section>
                    </>
                  )}

                  {!isMP && (
                    <>
                      {/* Preço e Custo (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <History size={16} /> Preço e Custo
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo de Produção (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.estimatedCost}
                              onChange={(e) => setFormData({...formData, estimatedCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço de Venda (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.value}
                              onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Margem (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.margin}
                              onChange={(e) => setFormData({...formData, margin: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Markup (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.markup}
                              onChange={(e) => setFormData({...formData, markup: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Controle de Estoque (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Box size={16} /> Controle de Estoque
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Atual</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.quantity}
                              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Mínimo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.minStock}
                              onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Máximo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.maxStock}
                              onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Medida</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('uom');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.unit}
                              onChange={(e) => setFormData({...formData, unit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'uom')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                              {stockConfigItems.filter(i => i.type === 'uom').length === 0 && (
                                <>
                                  <option value="UN">Unidade (UN)</option>
                                  <option value="M2">Metro Quadrado (M2)</option>
                                  <option value="MT">Metro Linear (MT)</option>
                                  <option value="KG">Quilo (KG)</option>
                                  <option value="KIT">Kit (KIT)</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Localização</label>
                            <select 
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'location')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </section>

                      {/* Informações Comerciais (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Plus size={16} /> Informações Comerciais
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comissão (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.commission}
                              onChange={(e) => setFormData({...formData, commission: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Garantia</label>
                            <input 
                              type="text" 
                              value={formData.warranty}
                              onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo Produção (dias)</label>
                            <input 
                              type="number" 
                              value={formData.productionLeadTime}
                              onChange={(e) => setFormData({...formData, productionLeadTime: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  {/* Informações Fiscais (Comum) */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Filter size={16} /> Informações Fiscais
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NCM</label>
                        <input 
                          type="text" 
                          value={formData.ncm}
                          onChange={(e) => setFormData({...formData, ncm: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CFOP Padrão</label>
                        <input 
                          type="text" 
                          value={formData.cfop}
                          onChange={(e) => setFormData({...formData, cfop: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      {isMP ? (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origem do Produto</label>
                          <select 
                            value={formData.productOrigin}
                            onChange={(e) => setFormData({...formData, productOrigin: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                          >
                            <option value="">Selecione...</option>
                            <option value="0">0 - Nacional</option>
                            <option value="1">1 - Estrangeira (Importação Direta)</option>
                            <option value="2">2 - Estrangeira (Adquirida no Mercado Interno)</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CST/CSOSN</label>
                          <input 
                            type="text" 
                            value={formData.cst_csosn}
                            onChange={(e) => setFormData({...formData, cst_csosn: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Controle do Sistema */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar size={16} /> Controle do Sistema
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Cadastro</label>
                        <input 
                          type="date" 
                          disabled
                          value={formData.entryDate}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm" 
                        />
                      </div>
                      {editingItem && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Última Atualização</label>
                          <input 
                            type="text" 
                            disabled
                            value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString('pt-BR') : '-'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm" 
                          />
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                {editingItem?.type === 'processo' && (
                  <button 
                    type="button"
                    onClick={() => {
                      finalizeProcess(editingItem.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Finalizar Produção
                  </button>
                )}
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                  {editingItem ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Entrada de Estoque */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ArrowDownCircle size={24} />
                Dar Entrada no Estoque
              </h3>
              <button onClick={() => setIsEntryModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEntrySubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Cabeçalho da Entrada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor</label>
                  <select 
                    required
                    value={entryFormData.supplier}
                    onChange={(e) => setEntryFormData({...entryFormData, supplier: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-sm"
                  >
                    <option value="">Selecione o fornecedor...</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desconto Total (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={entryFormData.discount || ''}
                      onChange={(e) => setEntryFormData({...entryFormData, discount: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-bold text-red-600" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                  <input 
                    type="date" 
                    value={entryFormData.date}
                    onChange={(e) => setEntryFormData({...entryFormData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                  <input 
                    type="text" 
                    value={entryFormData.responsible}
                    onChange={(e) => setEntryFormData({...entryFormData, responsible: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                    placeholder="Quem está recebendo"
                  />
                </div>
              </div>

              {/* Mini Formulário de Adição */}
              <div className="p-4 border border-emerald-100 rounded-xl bg-emerald-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Adicionar Item à Lista</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Item</label>
                    <select 
                      value={newItem.inventoryId}
                      onChange={(e) => {
                        const selectedItem = inventory.find(i => i.id === e.target.value);
                        setNewItem({ 
                          ...newItem, 
                          inventoryId: e.target.value,
                          itemCode: selectedItem?.code || '',
                          unitCost: selectedItem?.averageCost || 0
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-sm"
                    >
                      <option value="">Selecione o item...</option>
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.name} ({inv.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade</label>
                    <input 
                      type="number" 
                      min="0.01"
                      step="0.01"
                      value={newItem.quantity || ''}
                      onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Custo Unitário</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={newItem.unitCost || ''}
                        onChange={(e) => setNewItem({...newItem, unitCost: Number(e.target.value)})}
                        className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-bold" 
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={addItemToEntry}
                  disabled={!newItem.inventoryId || newItem.quantity <= 0}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Adicionar à Lista
                </button>
              </div>

              {/* Mini Tabela de Itens Adicionados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Itens na Lista ({entryFormData.items.length})</h4>
                  {entryFormData.items.length > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600">
                      Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        entryFormData.items.reduce((acc, i) => acc + (i.quantity * i.unitCost), 0)
                      )}
                    </span>
                  )}
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-inner bg-gray-50/50">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 font-bold text-gray-500 uppercase">Item</th>
                        <th className="px-3 py-2 font-bold text-gray-500 uppercase">Qtd</th>
                        <th className="px-3 py-2 font-bold text-gray-500 uppercase">Custo</th>
                        <th className="px-3 py-2 font-bold text-gray-500 uppercase text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {entryFormData.items.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-3 py-6 text-center text-gray-400 italic bg-white">Nenhum item na lista</td>
                        </tr>
                      ) : (
                        entryFormData.items.map((item, index) => {
                          const invItem = inventory.find(i => i.id === item.inventoryId);
                          return (
                            <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2">
                                <p className="font-bold text-gray-900">{invItem?.name}</p>
                                <p className="text-[9px] text-gray-400">{item.itemCode}</p>
                              </td>
                              <td className="px-3 py-2 font-medium">{item.quantity} {invItem?.unit}</td>
                              <td className="px-3 py-2 font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitCost)}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...entryFormData.items];
                                    newItems.splice(index, 1);
                                    setEntryFormData({...entryFormData, items: newItems});
                                  }}
                                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={entryFormData.items.length === 0}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Fornecedor */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Truck size={20} /> {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
              <button onClick={() => setIsSupplierModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Razão Social</label>
                  <input 
                    type="text" 
                    required
                    value={supplierFormData.name}
                    onChange={(e) => setSupplierFormData({...supplierFormData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CNPJ</label>
                  <input 
                    type="text" 
                    value={supplierFormData.cnpj}
                    onChange={(e) => setSupplierFormData({...supplierFormData, cnpj: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato Responsável</label>
                  <input 
                    type="text" 
                    value={supplierFormData.contactName}
                    onChange={(e) => setSupplierFormData({...supplierFormData, contactName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={supplierFormData.email}
                    onChange={(e) => setSupplierFormData({...supplierFormData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                  <input 
                    type="text" 
                    value={supplierFormData.phone}
                    onChange={(e) => setSupplierFormData({...supplierFormData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                  <input 
                    type="text" 
                    value={supplierFormData.category}
                    onChange={(e) => setSupplierFormData({...supplierFormData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                    placeholder="Ex: Madeiras, Ferragens"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                  <input 
                    type="text" 
                    value={supplierFormData.zipCode}
                    onChange={(e) => setSupplierFormData({...supplierFormData, zipCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço</label>
                  <input 
                    type="text" 
                    value={supplierFormData.address}
                    onChange={(e) => setSupplierFormData({...supplierFormData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={supplierFormData.city}
                    onChange={(e) => setSupplierFormData({...supplierFormData, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                  <input 
                    type="text" 
                    value={supplierFormData.state}
                    onChange={(e) => setSupplierFormData({...supplierFormData, state: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select 
                    value={supplierFormData.status}
                    onChange={(e) => setSupplierFormData({...supplierFormData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avaliação (0-5)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="5"
                    step="0.1"
                    value={supplierFormData.rating}
                    onChange={(e) => setSupplierFormData({...supplierFormData, rating: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                  <textarea 
                    value={supplierFormData.notes}
                    onChange={(e) => setSupplierFormData({...supplierFormData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm resize-none" 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                >
                  {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Adicionar Opção
              </h3>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Opção</label>
                <input 
                  type="text" 
                  autoFocus
                  value={quickAddName}
                  onChange={(e) => setQuickAddName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  placeholder="Digite o nome..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleQuickAdd}
                  disabled={!quickAddName}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
