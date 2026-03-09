import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Plus, Trash2, CreditCard, Banknote, QrCode, User, Package, Printer, X, CheckCircle2, UserCheck } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { useEmployees } from '../src/context/EmployeeContext';

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', code: 'PRD001', name: 'Produto A', price: 150.00, stock: 25, category: 'Eletrônicos' },
  { id: '2', code: 'PRD002', name: 'Produto B', price: 89.90, stock: 12, category: 'Acessórios' },
  { id: '3', code: 'PRD003', name: 'Produto C', price: 210.00, stock: 8, category: 'Hardware' },
  { id: '4', code: 'PRD004', name: 'Produto D', price: 45.00, stock: 45, category: 'Cabos' },
  { id: '5', code: 'PRD005', name: 'Produto E', price: 320.00, stock: 5, category: 'Periféricos' },
];

export const SalesPDV: React.FC = () => {
  const { companyProfile } = useTransactions();
  const { fetchEmployeesByRole } = useEmployees();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'money' | 'card' | 'pix' | null>(null);
  const [selectedSalespersonId, setSelectedSalespersonId] = useState<string>('');
  const [customerCPF, setCustomerCPF] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  const salespeople = useMemo(() => fetchEmployeesByRole('Vendedor'), [fetchEmployeesByRole]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFinalizeSale = () => {
    const salesperson = salespeople.find(s => s.id === selectedSalespersonId);
    const saleData = {
      id: `VND-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('pt-BR'),
      items: cart,
      total,
      paymentMethod,
      salesperson: salesperson?.name || 'Não informado',
      customerCPF: customerCPF || 'Não informado',
      change: 0 // Simplificado para este exemplo
    };
    setLastSale(saleData);
    setShowReceipt(true);
    // Reset cart after sale
    setCart([]);
    setPaymentMethod(null);
    setSelectedSalespersonId('');
    setCustomerCPF('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden relative">
      {/* Products Selection */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">PDV - Venda Rápida</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produto por nome, código ou categoria..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-6">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                <Package size={32} />
              </div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-800 truncate flex-1">{product.name}</h3>
                <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 ml-2">
                  {product.code}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">
                  Estoque: {product.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800 mb-1">
            <ShoppingCart size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold">Carrinho de Vendas</h2>
          </div>
          <p className="text-xs text-gray-500">Adicione itens para iniciar a venda</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <ShoppingCart size={48} className="mb-2" />
              <p className="text-sm">Carrinho vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                    <span className="text-[10px] text-gray-400 font-mono">{item.product.code}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.quantity}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
          {/* Salesperson Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <UserCheck size={12} /> Vendedor
            </label>
            <select
              value={selectedSalespersonId}
              onChange={(e) => setSelectedSalespersonId(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecione o Vendedor</option>
              {salespeople.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* CPF Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <User size={12} /> CPF do Cliente (Opcional)
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={customerCPF}
              onChange={(e) => setCustomerCPF(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Desconto</span>
              <span className="text-red-500">- R$ 0,00</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('money')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                paymentMethod === 'money' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
              }`}
            >
              <Banknote size={20} />
              <span className="text-[10px] font-bold">Dinheiro</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                paymentMethod === 'card' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
              }`}
            >
              <CreditCard size={20} />
              <span className="text-[10px] font-bold">Cartão</span>
            </button>
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                paymentMethod === 'pix' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
              }`}
            >
              <QrCode size={20} />
              <span className="text-[10px] font-bold">PIX</span>
            </button>
          </div>

          <button
            onClick={handleFinalizeSale}
            disabled={cart.length === 0 || !paymentMethod || !selectedSalespersonId}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:bg-gray-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            Finalizar Venda
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 size={20} />
                <span className="font-bold">Venda Finalizada!</span>
              </div>
              <button onClick={() => setShowReceipt(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8" id="printable-receipt">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">{companyProfile.name}</h2>
                <p className="text-xs text-gray-600">CNPJ: {companyProfile.cnpj}</p>
                <p className="text-[10px] text-gray-500">{companyProfile.address}</p>
                <p className="text-[10px] text-gray-500">Tel: {companyProfile.phone}</p>
              </div>

              <div className="border-t border-b border-dashed border-gray-300 py-3 mb-4 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>VENDA: {lastSale.id}</span>
                  <span>{lastSale.date}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>VENDEDOR:</span>
                  <span className="uppercase">{lastSale.salesperson}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>CPF CLIENTE:</span>
                  <span>{lastSale.customerCPF}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-bold border-b border-gray-100 pb-1">
                  <span>ITEM / QTD</span>
                  <span>TOTAL</span>
                </div>
                {lastSale.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <div className="flex flex-col">
                      <span className="uppercase font-medium">{item.product.name}</span>
                      <span className="text-gray-500">{item.quantity}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}</span>
                    </div>
                    <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 space-y-1 mb-6">
                <div className="flex justify-between text-xs">
                  <span>SUBTOTAL:</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastSale.total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>DESCONTO:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1">
                  <span>TOTAL FINAL:</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastSale.total)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg space-y-1 mb-6">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>FORMA PAGTO:</span>
                  <span className="uppercase">{lastSale.paymentMethod === 'money' ? 'Dinheiro' : lastSale.paymentMethod === 'card' ? 'Cartão' : 'PIX'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>VALOR PAGO:</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastSale.total)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>TROCO:</span>
                  <span>R$ 0,00</span>
                </div>
              </div>

              <div className="text-center space-y-2 text-[9px] text-gray-500 italic">
                <p>Garantia de 90 dias para defeitos de fabricação.</p>
                <p>Política de troca: 7 dias com embalagem original.</p>
                <p className="font-bold not-italic text-gray-800">OBRIGADO PELA PREFERÊNCIA!</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-white transition-all"
              >
                Fechar
              </button>
              <button 
                onClick={handlePrint}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standard thermal printer width */
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
