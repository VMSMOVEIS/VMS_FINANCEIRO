import React, { createContext, useContext, useState, useEffect } from 'react';
import { SalesPaymentMethod, Quote, Sale } from '../../types';

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  updateSaleStatus: (id: string, status: Sale['status']) => void;
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  paymentMethods: SalesPaymentMethod[];
  addPaymentMethod: (method: SalesPaymentMethod) => void;
  updatePaymentMethod: (method: SalesPaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('vms_sales');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PV-2026-001',
        customer: 'Tech Solutions Ltda',
        date: '2026-03-05',
        value: 45000,
        status: 'completed',
        items: 5,
        salesperson: 'João Silva',
        paymentStatus: 'paid',
        origin: 'order'
      },
      {
        id: 'PV-2026-002',
        customer: 'Indústria Metalúrgica Silva',
        date: '2026-03-07',
        value: 120000,
        status: 'processing',
        items: 12,
        salesperson: 'Maria Costa',
        paymentStatus: 'pending',
        origin: 'order'
      }
    ];
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('vms_quotes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ORC-2026-001', client: 'Empresa Alpha Ltda', productName: 'Mesa de Jantar Carvalho', date: '2026-03-01', expiryDate: '2026-03-15', value: 12500.00, status: 'approved', bomItems: [], profitMargin: 30, discount: 0 },
      { id: 'ORC-2026-002', client: 'João Silva ME', productName: 'Cadeira Estofada', date: '2026-03-03', expiryDate: '2026-03-17', value: 4890.50, status: 'sent', bomItems: [], profitMargin: 25, discount: 5 },
    ];
  });

  const [paymentMethods, setPaymentMethods] = useState<SalesPaymentMethod[]>(() => {
    const saved = localStorage.getItem('vms_sales_payment_methods');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Pix', discount: 10, active: true },
      { id: '2', name: 'Dinheiro', discount: 5, active: true },
      { id: '3', name: 'Cartão de Débito', discount: 0, active: true },
      { id: '4', name: 'Cartão de Crédito', discount: 0, active: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vms_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('vms_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('vms_sales_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  const addSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
  };

  const updateSaleStatus = (id: string, status: Sale['status']) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addQuote = (quote: Quote) => {
    setQuotes(prev => [quote, ...prev]);
  };

  const updateQuote = (quote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const addPaymentMethod = (method: SalesPaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
  };

  const updatePaymentMethod = (method: SalesPaymentMethod) => {
    setPaymentMethods(prev => prev.map(m => m.id === method.id ? method : m));
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  return (
    <SalesContext.Provider value={{ 
      sales, 
      addSale, 
      updateSaleStatus, 
      quotes,
      addQuote,
      updateQuote,
      deleteQuote,
      paymentMethods, 
      addPaymentMethod, 
      updatePaymentMethod, 
      deletePaymentMethod 
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
