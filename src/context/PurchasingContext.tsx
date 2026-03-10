import React, { createContext, useContext, useState, useEffect } from 'react';
import { PurchaseOrder } from '../../types';

interface PurchasingContextType {
  purchases: PurchaseOrder[];
  addPurchase: (order: PurchaseOrder) => void;
  updatePurchase: (order: PurchaseOrder) => void;
  deletePurchase: (id: string) => void;
  updatePurchaseStatus: (id: string, status: PurchaseOrder['status'], extraData?: Partial<PurchaseOrder>) => void;
}

const PurchasingContext = createContext<PurchasingContextType | undefined>(undefined);

export const PurchasingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('vms_purchases');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PC-2026-001',
        supplier: 'Madeiras Nobres S.A.',
        date: '2026-03-01',
        value: 15000,
        status: 'completed',
        items: 5,
        buyer: 'Carlos Gerente',
        paymentStatus: 'paid'
      },
      {
        id: 'PC-2026-002',
        supplier: 'Ferragens Central',
        date: '2026-03-05',
        value: 2500,
        status: 'processing',
        items: 10,
        buyer: 'Carlos Gerente',
        paymentStatus: 'pending'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vms_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (order: PurchaseOrder) => {
    setPurchases(prev => [order, ...prev]);
  };

  const updatePurchase = (order: PurchaseOrder) => {
    setPurchases(prev => prev.map(p => p.id === order.id ? order : p));
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const updatePurchaseStatus = (id: string, status: PurchaseOrder['status'], extraData?: Partial<PurchaseOrder>) => {
    setPurchases(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            status, 
            effectiveDate: status === 'completed' ? new Date().toISOString() : p.effectiveDate,
            ...extraData
          } 
        : p
    ));
  };

  return (
    <PurchasingContext.Provider value={{ 
      purchases, 
      addPurchase, 
      updatePurchase, 
      deletePurchase, 
      updatePurchaseStatus 
    }}>
      {children}
    </PurchasingContext.Provider>
  );
};

export const usePurchasing = () => {
  const context = useContext(PurchasingContext);
  if (context === undefined) {
    throw new Error('usePurchasing must be used within a PurchasingProvider');
  }
  return context;
};
