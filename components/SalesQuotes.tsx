import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  User, 
  DollarSign,
  Trash2,
  Edit2,
  Send,
  Check,
  X,
  AlertTriangle,
  FileJson,
  PlusCircle,
  Package,
  Layers,
  Maximize2,
  MapPin,
  Upload,
  FileCode
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { useSales } from '../src/context/SalesContext';
import { useProduction } from '../src/context/ProductionContext';
import { useTransactions } from '../src/context/TransactionContext';
import { Quote, BOMItem, ProductionOrder, Sale, SaleItem } from '../types';

const STORES = ['Loja Principal', 'Showroom Centro', 'Loja Online', 'Filial Sul'];

export const SalesQuotes: React.FC = () => {
  const { quotes, addQuote, updateQuote, deleteQuote, addSale, isLoading } = useSales();
  const { addProductionOrder, inventory } = useProduction();
  const { accountPlans } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Effect to handle lead data from LeadsManagement
  useEffect(() => {
    const leadData = localStorage.getItem('vms_lead_to_quote');
    if (leadData) {
      try {
        const lead = JSON.parse(leadData);
        localStorage.removeItem('vms_lead_to_quote');
        
        setFormData({
          id: Math.random().toString(36).substr(2, 9),
          client: lead.company || '',
          contactName: lead.contactName || '',
          email: lead.email || '',
          phone: lead.phone || '',
          street: lead.street || '',
          number: lead.number || '',
          neighborhood: lead.neighborhood || '',
          city: lead.city || '',
          state: lead.state || '',
          productName: lead.orderDescription || '',
          date: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 0,
          status: 'waiting_approval',
          items: [],
          bomItems: [],
          profitMargin: 30,
          discount: 0,
          notes: `Lead original: ${lead.company}\nDescrição: ${lead.orderDescription || ''}`
        });
        setEditingQuote(null);
        setShowModal(true);
      } catch (error) {
        console.error('Error parsing lead data:', error);
      }
    }
  }, []);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractedPieces, setExtractedPieces] = useState<any[]>([]);

  const handleObjUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const loader = new OBJLoader();
      const object = loader.parse(contents);
      
      const pieces: any[] = [];
      const meshes: THREE.Mesh[] = [];

      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      });

      meshes.forEach((mesh, index) => {
        mesh.geometry.computeBoundingBox();
        const bbox = mesh.geometry.boundingBox!;
        
        // Get world dimensions
        const size = new THREE.Vector3();
        bbox.getSize(size);
        
        // Sort dimensions to identify thickness (usually smallest)
        const dims = [size.x, size.y, size.z].sort((a, b) => a - b);
        const thickness = dims[0];
        const width = dims[2];
        const height = dims[1];

        // Identify which axis is the thickness axis
        let thicknessAxis: 'x' | 'y' | 'z' = 'x';
        if (size.y === thickness) thicknessAxis = 'y';
        else if (size.z === thickness) thicknessAxis = 'z';

        // Identify the 4 edge faces
        // If thickness is Z, edges are along X and Y
        // We need to check if these edges touch any other mesh
        
        // Simplified logic: 
        // For each of the 4 edges, check if there's another mesh whose face is at the same position
        const tape = [true, true, true, true]; // Default: all edges have tape

        // Get world position of the mesh
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        // Check each edge
        // This is a simplified intersection check
        meshes.forEach((otherMesh, otherIdx) => {
          if (index === otherIdx) return;

          otherMesh.geometry.computeBoundingBox();
          const otherBbox = otherMesh.geometry.boundingBox!.clone().applyMatrix4(otherMesh.matrixWorld);
          const thisBbox = bbox.clone().applyMatrix4(mesh.matrixWorld);

          // Check if any face of otherMesh touches an edge of thisMesh
          // For simplicity, we'll check if the bounding boxes are adjacent
          // and if the "touching" area is significant.
          
          // This is a complex geometric task. 
          // For now, we'll implement a proximity check for the 4 edges.
          // Edges are: minX, maxX, minY, maxY (assuming Z is thickness)
          
          const epsilon = 1.0; // 1mm tolerance

          // Check Left Edge (minX)
          if (Math.abs(thisBbox.min.x - otherBbox.max.x) < epsilon) {
            // Check if they overlap in Y and Z
            const overlapY = Math.max(0, Math.min(thisBbox.max.y, otherBbox.max.y) - Math.max(thisBbox.min.y, otherBbox.min.y));
            const overlapZ = Math.max(0, Math.min(thisBbox.max.z, otherBbox.max.z) - Math.max(thisBbox.min.z, otherBbox.min.z));
            if (overlapY > 5 && overlapZ > 5) tape[0] = false;
          }
          // Check Right Edge (maxX)
          if (Math.abs(thisBbox.max.x - otherBbox.min.x) < epsilon) {
            const overlapY = Math.max(0, Math.min(thisBbox.max.y, otherBbox.max.y) - Math.max(thisBbox.min.y, otherBbox.min.y));
            const overlapZ = Math.max(0, Math.min(thisBbox.max.z, otherBbox.max.z) - Math.max(thisBbox.min.z, otherBbox.min.z));
            if (overlapY > 5 && overlapZ > 5) tape[1] = false;
          }
          // Check Bottom Edge (minY)
          if (Math.abs(thisBbox.min.y - otherBbox.max.y) < epsilon) {
            const overlapX = Math.max(0, Math.min(thisBbox.max.x, otherBbox.max.x) - Math.max(thisBbox.min.x, otherBbox.min.x));
            const overlapZ = Math.max(0, Math.min(thisBbox.max.z, otherBbox.max.z) - Math.max(thisBbox.min.z, otherBbox.min.z));
            if (overlapX > 5 && overlapZ > 5) tape[2] = false;
          }
          // Check Top Edge (maxY)
          if (Math.abs(thisBbox.max.y - otherBbox.min.y) < epsilon) {
            const overlapX = Math.max(0, Math.min(thisBbox.max.x, otherBbox.max.x) - Math.max(thisBbox.min.x, otherBbox.min.x));
            const overlapZ = Math.max(0, Math.min(thisBbox.max.z, otherBbox.max.z) - Math.max(thisBbox.min.z, otherBbox.min.z));
            if (overlapX > 5 && overlapZ > 5) tape[3] = false;
          }
        });

        pieces.push({
          name: mesh.name || `Peça ${index + 1}`,
          width: width,
          height: height,
          thickness: thickness,
          tape: tape
        });
      });

      setExtractedPieces(pieces);
    };
    reader.readAsText(file);
  };

  const initialQuoteState: Partial<Quote> = {
    client: '',
    contactName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    salesperson: '',
    store: STORES[0],
    bomItems: [],
    items: [],
    profitMargin: 30,
    discount: 0,
    status: 'waiting_approval',
    saleType: 'encomenda',
    deliveryTime: '',
    commission: 0,
    otherExpenses: 0,
    notes: ''
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Quote>>(initialQuoteState);

  const [currentItem, setCurrentItem] = useState<Partial<SaleItem>>({
    productId: '',
    code: '',
    name: '',
    unit: 'un',
    quantity: 1,
    listPrice: 0,
    discount: 0,
    unitPrice: 0,
    totalPrice: 0
  });

  const handleAddItem = () => {
    if (currentItem.name && currentItem.quantity && currentItem.unitPrice) {
      const newItem = {
        ...currentItem,
        totalPrice: (currentItem.unitPrice || 0) * (currentItem.quantity || 0)
      } as SaleItem;
      
      const updatedItems = [...(formData.items || []), newItem];
      updateQuoteTotals(updatedItems);
      
      setCurrentItem({
        productId: '',
        code: '',
        name: '',
        unit: 'un',
        quantity: 1,
        listPrice: 0,
        discount: 0,
        unitPrice: 0,
        totalPrice: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = (formData.items || []).filter((_, i) => i !== index);
    updateQuoteTotals(updatedItems);
  };

  const updateQuoteTotals = (items: SaleItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.listPrice - item.unitPrice) * item.quantity, 0);
    
    const finalValue = subtotal + (formData.otherExpenses || 0);
    
    setFormData({
      ...formData,
      items,
      itemCount: items.length,
      totalQuantity,
      totalDiscount,
      value: finalValue
    });
  };

  const handleOpenModal = (quote?: Quote) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        ...initialQuoteState,
        ...quote
      });
    } else {
      setEditingQuote(null);
      setFormData(initialQuoteState);
    }
    setShowModal(true);
  };

  const handleAddBOMItem = () => {
    const newItem: BOMItem = {
      id: Math.random().toString(36).substr(2, 9),
      materialName: '',
      quantity: 1,
      unit: 'UN',
      cost: 0
    };
    setFormData(prev => ({
      ...prev,
      bomItems: [...(prev.bomItems || []), newItem]
    }));
  };

  const handleRemoveBOMItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      bomItems: prev.bomItems?.filter(item => item.id !== id)
    }));
  };

  const handleBOMItemChange = (id: string, field: keyof BOMItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      bomItems: prev.bomItems?.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const calculateTotalCost = () => {
    return formData.bomItems?.reduce((acc, item) => acc + (item.quantity * item.cost), 0) || 0;
  };

  const calculateFinalPrice = () => {
    const cost = calculateTotalCost();
    const margin = formData.profitMargin || 0;
    const discount = formData.discount || 0;
    
    if (cost === 0) return 0;
    
    const priceWithMargin = cost / (1 - (margin / 100));
    const finalPrice = priceWithMargin * (1 - (discount / 100));
    return finalPrice;
  };

  const handleSave = () => {
    if (!formData.client) {
      alert('Por favor, preencha o cliente.');
      return;
    }

    const quoteData: Quote = {
      ...formData as Quote,
      id: editingQuote?.id || `ORC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      client: formData.client!,
      date: editingQuote?.date || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bomItems: formData.bomItems || [],
      items: formData.items || [],
      profitMargin: formData.profitMargin || 0,
      discount: formData.discount || 0,
      value: formData.value || 0,
      status: formData.status as any || 'waiting_approval'
    };

    if (editingQuote) {
      updateQuote(quoteData);
    } else {
      addQuote(quoteData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteQuote(id);
    setShowDeleteConfirm(null);
  };

  const handleApprove = (quote: Quote) => {
    // 1. Update Quote Status
    updateQuote({ ...quote, status: 'approved' });

    // 2. Create Sales Order
    const salesOrder: Sale = {
      ...quote,
      id: quote.id, // Keeping the same ID but it already has ORC prefix
      customer: quote.client,
      salesperson: quote.salesperson || 'Sistema',
      date: new Date().toISOString(),
      value: quote.value,
      status: 'waiting_production',
      items: quote.items || [{
        productId: 'quote-item',
        code: 'ORC',
        name: 'Item de Orçamento',
        unit: 'un',
        quantity: 1,
        listPrice: quote.value,
        discount: 0,
        unitPrice: quote.value,
        totalPrice: quote.value
      }],
      itemCount: quote.itemCount || 1,
      totalQuantity: quote.totalQuantity || 1,
      totalDiscount: quote.totalDiscount || 0,
      otherExpenses: quote.otherExpenses || 0,
      commission: quote.commission || 0,
      paymentStatus: 'pending',
      origin: 'order'
    };
    addSale(salesOrder);

    // 3. Create Production Order
    const productionOrder: ProductionOrder = {
      id: `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: quote.items?.[0]?.name || 'Item de Orçamento',
      client: quote.client,
      quantity: quote.totalQuantity || 1,
      deadline: quote.expiryDate, // Using expiry date as deadline for now
      status: 'waiting',
      priority: 'medium',
      progress: 0,
      quoteId: quote.id
    };
    addProductionOrder(productionOrder);

    alert('Orçamento aprovado! Pedido de venda e Ordem de produção criados.');
  };

  const handleReject = (quote: Quote) => {
    updateQuote({ ...quote, status: 'rejected' });
  };

  const handleSend = (quote: Quote) => {
    updateQuote({ ...quote, status: 'sent' });
  };

  const getStatusBadge = (status: Quote['status'], expiryDate?: string) => {
    const isExpired = expiryDate && new Date(expiryDate) < new Date() && status !== 'approved';
    const effectiveStatus = isExpired ? 'expired' : status;

    switch (effectiveStatus) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Aprovado</span>;
      case 'sent': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Send size={12} /> Enviado</span>;
      case 'waiting_approval': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Aguardando Aprovação</span>;
      case 'draft': return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Rascunho</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12} /> Rejeitado</span>;
      case 'expired': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Calendar size={12} /> Expirado</span>;
    }
  };

  const filteredQuotes = quotes.filter(q => 
    (statusFilter === 'all' || q.status === statusFilter) &&
    (q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Analytics Data
  const PERFORMANCE_DATA = [
    { month: 'Jan', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-01-')).reduce((acc, q) => acc + q.value, 0) || 45000, sent: quotes.filter(q => q.date.includes('-01-')).reduce((acc, q) => acc + q.value, 0) || 60000 },
    { month: 'Feb', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-02-')).reduce((acc, q) => acc + q.value, 0) || 52000, sent: quotes.filter(q => q.date.includes('-02-')).reduce((acc, q) => acc + q.value, 0) || 75000 },
    { month: 'Mar', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-03-')).reduce((acc, q) => acc + q.value, 0) || 38000, sent: quotes.filter(q => q.date.includes('-03-')).reduce((acc, q) => acc + q.value, 0) || 90000 },
  ];

  const STATUS_DATA = [
    { name: 'Aprovados', value: quotes.filter(q => q.status === 'approved').length, color: '#10b981' },
    { name: 'Enviados', value: quotes.filter(q => q.status === 'sent').length, color: '#3b82f6' },
    { name: 'Em Aberto', value: quotes.filter(q => q.status === 'draft').length, color: '#f59e0b' },
    { name: 'Rejeitados', value: quotes.filter(q => q.status === 'rejected').length, color: '#ef4444' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Orçamentos
            {isLoading && <Clock className="animate-spin text-blue-500" size={20} />}
          </h1>
          <p className="text-gray-500 text-sm">Gestão de propostas e performance de conversão</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Orçamento
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" />
              Performance de Vendas (Orçado vs Aprovado)
            </h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Enviado</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Aprovado</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sent" name="Enviado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Aprovado" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-emerald-600" />
            Status das Propostas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orçado (Mês)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.reduce((acc, q) => acc + q.value, 0)), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Taxa de Conversão', value: `${((quotes.filter(q => q.status === 'approved').length / (quotes.length || 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ticket Médio', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.reduce((acc, q) => acc + q.value, 0) / (quotes.length || 1)), icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Aprovado', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.filter(q => q.status === 'approved').reduce((acc, q) => acc + q.value, 0)), icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar orçamento ou cliente..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="waiting_approval">Aguardando Aprovação</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors border border-gray-200 rounded-lg">
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID / Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Data Emissão</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map(quote => (
                <tr 
                  key={quote.id} 
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => handleOpenModal(quote)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-800">{quote.id}</p>
                      <p className="text-xs text-gray-500">{quote.client}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {quote.items?.[0]?.name || 'Item de Orçamento'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.expiryDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.value)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(quote.status, quote.expiryDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quote.status !== 'approved' && quote.status !== 'rejected' && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleApprove(quote); }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                            title="Aprovar"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleReject(quote); }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Rejeitar"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSend(quote); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Enviar"
                          >
                            <Send size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(quote); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(quote.id); }}
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
      </div>

      {/* Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingQuote ? `Editar Orçamento ${editingQuote.id}` : 'Novo Orçamento'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cliente / Empresa</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="Nome do cliente ou empresa"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contato</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="Nome do contato"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Telefone</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">E-mail</label>
                    <input 
                      type="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vendedor</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={formData.salesperson}
                        onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Loja</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                        value={formData.store}
                        onChange={(e) => setFormData({...formData, store: e.target.value})}
                      >
                        {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data de Emissão</label>
                      <input 
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data de Validade</label>
                      <input 
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Venda</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                        value={formData.saleType}
                        onChange={(e) => setFormData({...formData, saleType: e.target.value as any})}
                      >
                        <option value="pronta_entrega">A pronta entrega</option>
                        <option value="encomenda">Por encomenda</option>
                        <option value="prazo">A prazo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Prazo de Entrega</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="Ex: 15 dias"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  Endereço de Entrega / Cobrança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Rua / Logradouro</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Número</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bairro</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cidade</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Estado (UF)</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Itens do Orçamento</h3>
                  <button 
                    type="button"
                    onClick={() => setShowExtractModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-200"
                  >
                    <FileJson size={14} />
                    Extrair Peças OBJ
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Produto</label>
                    <div className="relative">
                      <input 
                        list="inventory-products"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm bg-white"
                        placeholder="Selecione ou digite o nome..."
                        value={currentItem.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const prod = inventory.find(p => p.name === val);
                          if (prod) {
                            setCurrentItem({
                              ...currentItem,
                              productId: prod.id,
                              code: prod.id,
                              name: prod.name,
                              unit: prod.unit,
                              listPrice: prod.value,
                              unitPrice: prod.value,
                              totalPrice: prod.value * (currentItem.quantity || 1)
                            });
                          } else {
                            setCurrentItem({...currentItem, name: val, productId: 'custom'});
                          }
                        }}
                      />
                      <datalist id="inventory-products">
                        {inventory.map(p => (
                          <option key={p.id} value={p.name}>{p.category}</option>
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Qtd</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                      value={currentItem.quantity}
                      onChange={(e) => {
                        const qty = parseFloat(e.target.value) || 0;
                        setCurrentItem({...currentItem, quantity: qty, totalPrice: qty * (currentItem.unitPrice || 0)});
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">P. Unit</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                      value={currentItem.unitPrice}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        setCurrentItem({...currentItem, unitPrice: price, totalPrice: price * (currentItem.quantity || 0)});
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={handleAddItem}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3">Produto</th>
                        <th className="px-4 py-3 text-center">Qtd</th>
                        <th className="px-4 py-3 text-right">P. Unit</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-center">{item.quantity} {item.unit}</td>
                          <td className="px-4 py-3 text-right">R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleRemoveItem(idx)} className="text-gray-400 hover:text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!formData.items || formData.items.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">Nenhum produto adicionado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOM List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Lista BOM (Matéria-prima)</h3>
                  <button 
                    onClick={handleAddBOMItem}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar Item
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2 text-left">Material</th>
                        <th className="px-4 py-2 text-center w-24">Qtd</th>
                        <th className="px-4 py-2 text-center w-24">Unid</th>
                        <th className="px-4 py-2 text-right w-32">Custo Unit.</th>
                        <th className="px-4 py-2 text-right w-32">Total</th>
                        <th className="px-4 py-2 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.bomItems?.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <input 
                              type="text"
                              className="w-full bg-transparent outline-none focus:text-emerald-600"
                              placeholder="Nome do material"
                              value={item.materialName}
                              onChange={(e) => handleBOMItemChange(item.id, 'materialName', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-transparent outline-none text-center focus:text-emerald-600"
                              value={item.quantity}
                              onChange={(e) => handleBOMItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="text"
                              className="w-full bg-transparent outline-none text-center focus:text-emerald-600"
                              value={item.unit}
                              onChange={(e) => handleBOMItemChange(item.id, 'unit', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-transparent outline-none text-right focus:text-emerald-600"
                              value={item.cost}
                              onChange={(e) => handleBOMItemChange(item.id, 'cost', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-gray-700">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.cost)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button 
                              onClick={() => handleRemoveBOMItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!formData.bomItems || formData.bomItems.length === 0) && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">
                            Nenhum item adicionado à lista BOM.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right uppercase text-gray-500">Custo Total de Materiais:</td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotalCost())}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Margem de Lucro (%)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({ ...formData, profitMargin: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desconto (%)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Preço Final Estimado</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateFinalPrice())}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extract Pieces Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileJson size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Extrair Peças do Projeto OBJ</h2>
                  <p className="text-xs text-blue-600 font-medium">Defina as dimensões e acabamentos das peças</p>
                </div>
              </div>
              <button onClick={() => setShowExtractModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Material</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Nome da Peça</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Comp (mm)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Larg (mm)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Esp (mm)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Qtd</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase text-center">Fitas (C)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase text-center">Fitas (L)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Tipo Fita</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Total Fita (m)</th>
                      <th className="px-3 py-3 font-bold text-gray-600 uppercase">Chapas (m²)</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {extractedPieces.map((piece, idx) => (
                      <tr key={idx} className="bg-white hover:bg-blue-50/30 transition-colors">
                        <td className="px-2 py-2">
                          <input 
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.material}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].material = e.target.value;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.name}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].name = e.target.value;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="number" 
                            className="w-16 px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.length}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].length = parseFloat(e.target.value) || 0;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="number" 
                            className="w-16 px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.width}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].width = parseFloat(e.target.value) || 0;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="number" 
                            className="w-12 px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.thickness}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].thickness = parseFloat(e.target.value) || 0;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="number" 
                            className="w-12 px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.quantity}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].quantity = parseInt(e.target.value) || 0;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex justify-center gap-1">
                            <input 
                              type="checkbox" 
                              checked={piece.edgeC1}
                              onChange={(e) => {
                                const newPieces = [...extractedPieces];
                                newPieces[idx].edgeC1 = e.target.checked;
                                setExtractedPieces(newPieces);
                              }}
                            />
                            <input 
                              type="checkbox" 
                              checked={piece.edgeC2}
                              onChange={(e) => {
                                const newPieces = [...extractedPieces];
                                newPieces[idx].edgeC2 = e.target.checked;
                                setExtractedPieces(newPieces);
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex justify-center gap-1">
                            <input 
                              type="checkbox" 
                              checked={piece.edgeL1}
                              onChange={(e) => {
                                const newPieces = [...extractedPieces];
                                newPieces[idx].edgeL1 = e.target.checked;
                                setExtractedPieces(newPieces);
                              }}
                            />
                            <input 
                              type="checkbox" 
                              checked={piece.edgeL2}
                              onChange={(e) => {
                                const newPieces = [...extractedPieces];
                                newPieces[idx].edgeL2 = e.target.checked;
                                setExtractedPieces(newPieces);
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            value={piece.edgeType}
                            onChange={(e) => {
                              const newPieces = [...extractedPieces];
                              newPieces[idx].edgeType = e.target.value;
                              setExtractedPieces(newPieces);
                            }}
                          />
                        </td>
                        <td className="px-2 py-2 font-mono text-gray-500">
                          {(( (piece.edgeC1 ? piece.length : 0) + (piece.edgeC2 ? piece.length : 0) + (piece.edgeL1 ? piece.width : 0) + (piece.edgeL2 ? piece.width : 0) ) * piece.quantity / 1000).toFixed(2)}m
                        </td>
                        <td className="px-2 py-2 font-mono text-gray-500">
                          {(piece.length * piece.width * piece.quantity / 1000000).toFixed(2)}m²
                        </td>
                        <td className="px-2 py-2">
                          <button 
                            onClick={() => setExtractedPieces(prev => prev.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button 
                onClick={() => setExtractedPieces([...extractedPieces, { material: '', name: '', length: 0, width: 0, thickness: 15, quantity: 1, edgeC1: false, edgeC2: false, edgeL1: false, edgeL2: false, edgeType: '' }])}
                className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs hover:text-blue-700 transition-all"
              >
                <PlusCircle size={16} />
                Adicionar Peça
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase font-bold">Total Fitas</span>
                  <span className="text-gray-800 font-bold">
                    {extractedPieces.reduce((sum, p) => sum + (( (p.edgeC1 ? p.length : 0) + (p.edgeC2 ? p.length : 0) + (p.edgeL1 ? p.width : 0) + (p.edgeL2 ? p.width : 0) ) * p.quantity / 1000), 0).toFixed(2)}m
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 uppercase font-bold">Total Chapas</span>
                  <span className="text-gray-800 font-bold">
                    {extractedPieces.reduce((sum, p) => sum + (p.length * p.width * p.quantity / 1000000), 0).toFixed(2)}m²
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExtractModal(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-white transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    // Logic to add to BOM
                    const bomItemsToAdd: BOMItem[] = extractedPieces.map(p => ({
                      id: Math.random().toString(36).substr(2, 9),
                      materialName: `${p.material} - ${p.name} (${p.length}x${p.width}x${p.thickness})`,
                      quantity: p.quantity,
                      unit: 'UN',
                      cost: 0
                    }));
                    setFormData({
                      ...formData,
                      bomItems: [...(formData.bomItems || []), ...bomItemsToAdd]
                    });
                    setShowExtractModal(false);
                    setExtractedPieces([]);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Importar para BOM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-500">
                Tem certeza que deseja apagar este orçamento? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Extract Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileCode size={24} />
                Extração de Peças OBJ
              </h2>
              <button onClick={() => setShowExtractModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {!extractedPieces.length ? (
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.name.endsWith('.obj')) {
                      handleObjUpload(file);
                    } else {
                      alert('Por favor, envie um arquivo .obj');
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.obj';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleObjUpload(file);
                    };
                    input.click();
                  }}
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Arraste seu arquivo .obj aqui</p>
                    <p className="text-sm text-gray-500">Ou clique para selecionar do seu computador</p>
                  </div>
                  <div className="pt-4">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Apenas arquivos .obj</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Peças Extraídas ({extractedPieces.length})</h3>
                    <button 
                      onClick={() => setExtractedPieces([])}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Limpar e tentar outro arquivo
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Peça</th>
                          <th className="px-4 py-3 text-center">Dimensões (mm)</th>
                          <th className="px-4 py-3 text-center">Fitas</th>
                          <th className="px-4 py-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {extractedPieces.map((piece, idx) => (
                          <tr key={idx} className="hover:bg-white transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">{piece.name}</td>
                            <td className="px-4 py-3 text-center text-gray-500 tabular-nums">
                              {Math.round(piece.width)} x {Math.round(piece.height)} x {Math.round(piece.thickness)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-1">
                                {piece.tape.map((t: boolean, i: number) => (
                                  <div 
                                    key={i} 
                                    className={`w-2 h-2 rounded-full ${t ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                    title={`Borda ${i + 1}: ${t ? 'Com fita' : 'Sem fita'}`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => {
                                  const newItem: SaleItem = {
                                    productId: `EXT-${idx}`,
                                    code: `EXT-${idx}`,
                                    name: piece.name,
                                    unit: 'un',
                                    quantity: 1,
                                    listPrice: 0,
                                    discount: 0,
                                    unitPrice: 0,
                                    totalPrice: 0,
                                    notes: `Dim: ${Math.round(piece.width)}x${Math.round(piece.height)}x${Math.round(piece.thickness)}mm | Fitas: ${piece.tape.map((t: boolean) => t ? 'S' : 'N').join('')}`
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    items: [...(prev.items || []), newItem]
                                  }));
                                  alert(`Peça ${piece.name} adicionada ao orçamento.`);
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-bold text-xs"
                              >
                                Adicionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button 
                    onClick={() => {
                      const newItems = extractedPieces.map((piece, idx) => ({
                        productId: `EXT-${idx}`,
                        code: `EXT-${idx}`,
                        name: piece.name,
                        unit: 'un',
                        quantity: 1,
                        listPrice: 0,
                        discount: 0,
                        unitPrice: 0,
                        totalPrice: 0,
                        notes: `Dim: ${Math.round(piece.width)}x${Math.round(piece.height)}x${Math.round(piece.thickness)}mm | Fitas: ${piece.tape.map((t: boolean) => t ? 'S' : 'N').join('')}`
                      }));
                      setFormData(prev => ({
                        ...prev,
                        items: [...(prev.items || []), ...newItems]
                      }));
                      setShowExtractModal(false);
                      setExtractedPieces([]);
                    }}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    Adicionar Todas as Peças ({extractedPieces.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
