import React, { useState, useMemo } from 'react';
import { Search, Plus, Image as ImageIcon, Share2, ExternalLink, Trash2, Edit2, Copy, Check, Filter, Grid, List, AlertCircle } from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';

interface Product {
  id: string;
  sku?: string;
  name: string;
  description: string;
  price: number; // Preço de Venda
  costPrice: number;
  profitMargin: number;
  unit: string;
  category: string;
  image: string;
  status: 'active' | 'inactive';
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'PA-001',
    name: 'Mesa de Jantar Carvalho 6 Lugares',
    description: 'Mesa de jantar elegante em madeira carvalho.',
    price: 2500.00,
    costPrice: 1800.00,
    profitMargin: 28,
    unit: 'UN',
    category: 'Móveis',
    image: 'https://picsum.photos/seed/table/400/400',
    status: 'active'
  },
  {
    id: '2',
    sku: 'PA-002',
    name: 'Cadeira Estofada Veludo Cinza',
    description: 'Cadeira confortável com acabamento em veludo.',
    price: 450.00,
    costPrice: 300.00,
    profitMargin: 33.33,
    unit: 'UN',
    category: 'Móveis',
    image: 'https://picsum.photos/seed/chair/400/400',
    status: 'active'
  }
];

export const SalesCatalog: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  const { inventory } = useProduction();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    price: 0,
    costPrice: 0,
    profitMargin: 0,
    unit: 'UN',
    category: '',
    image: '',
    status: 'active'
  });

  const getStockStatus = (product: Product) => {
    const stockItem = inventory.find(i => 
      (product.sku && i.id === product.sku) || 
      i.name.toLowerCase() === product.name.toLowerCase()
    );
    
    if (!stockItem || stockItem.type !== 'pa' || stockItem.category !== 'pronta_entrega' || stockItem.quantity <= 0) {
      return { available: false, quantity: 0 };
    }
    
    return { available: true, quantity: stockItem.quantity };
  };

  const calculateMargin = (cost: number, sell: number) => {
    if (!sell || sell === 0) return 0;
    return ((sell - cost) / sell) * 100;
  };

  const handleCopyLink = () => {
    const catalogUrl = `${window.location.origin}/catalogo-publico`;
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name!,
        description: newProduct.description || '',
        price: Number(newProduct.price),
        costPrice: Number(newProduct.costPrice) || 0,
        profitMargin: Number(newProduct.profitMargin) || 0,
        unit: newProduct.unit || 'UN',
        category: newProduct.category || 'Geral',
        image: newProduct.image || `https://picsum.photos/seed/${newProduct.name}/400/400`,
        status: 'active'
      };
      setProducts([...products, product]);
      setShowAddModal(false);
      setNewProduct({ 
        name: '', 
        description: '', 
        price: 0, 
        costPrice: 0, 
        profitMargin: 0, 
        unit: 'UN', 
        category: '', 
        image: '', 
        status: 'active' 
      });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo & Preços</h1>
          <p className="text-gray-500 text-sm">Gerencie seus produtos e compartilhe com seus clientes</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {!isPublic && (
            <>
              <button 
                onClick={handleCopyLink}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                {copied ? 'Link Copiado!' : 'Compartilhar Link'}
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Plus size={18} />
                Novo Produto
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, categoria ou descrição..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {!isPublic && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-emerald-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="bg-emerald-600/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {product.unit}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                  {(() => {
                    const stock = getStockStatus(product);
                    return stock.available ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                        Em Estoque ({stock.quantity})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                        <AlertCircle size={10} /> Sem Estoque
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{product.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <span className="text-lg font-bold text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </span>
                  <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Custo</th>
                <th className="px-6 py-4">Venda</th>
                <th className="px-6 py-4">Margem</th>
                <th className="px-6 py-4">Status</th>
                {!isPublic && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.costPrice)}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${product.profitMargin < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {product.profitMargin.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const stock = getStockStatus(product);
                      return stock.available ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          Em Estoque ({stock.quantity})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-600 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          Sem Estoque
                        </span>
                      );
                    })()}
                  </td>
                  {!isPublic && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"><Edit2 size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Novo Produto no Catálogo</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-all cursor-pointer overflow-hidden">
                  {newProduct.image ? (
                    <img src={newProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload Imagem</span>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU / Código (Para Sincronizar com Estoque PA)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: PA-001"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unidade de Medida</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="UN">UN (unidade)</option>
                    <option value="M">M (metro)</option>
                    <option value="M²">M² (metro quadrado)</option>
                    <option value="PAR">PAR</option>
                    <option value="KIT">KIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço de Custo (R$)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.costPrice || ''}
                    onChange={(e) => {
                      const cost = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      const margin = calculateMargin(cost, newProduct.price || 0);
                      setNewProduct({...newProduct, costPrice: cost, profitMargin: margin});
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço de Venda (R$)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.price || ''}
                    onChange={(e) => {
                      const sell = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      const margin = calculateMargin(newProduct.costPrice || 0, sell);
                      setNewProduct({...newProduct, price: sell, profitMargin: margin});
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Margem de Lucro Estimada:</span>
                    <span className={`text-sm font-bold ${newProduct.profitMargin! < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {newProduct.profitMargin?.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
