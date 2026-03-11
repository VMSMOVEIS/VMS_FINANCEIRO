import React, { createContext, useContext, useState, useEffect } from 'react';
import { PurchaseOrder } from '../../types';
import { supabase } from '../lib/supabase';

interface PurchasingContextType {
  purchases: PurchaseOrder[];
  addPurchase: (order: PurchaseOrder) => void;
  updatePurchase: (order: PurchaseOrder) => void;
  deletePurchase: (id: string) => void;
  updatePurchaseStatus: (id: string, status: PurchaseOrder['status'], extraData?: Partial<PurchaseOrder>) => void;
}

const PurchasingContext = createContext<PurchasingContextType | undefined>(undefined);

export const PurchasingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setPurchases(data.map(p => ({
        id: p.id,
        supplier: p.supplier_name,
        date: p.date,
        dueDate: p.due_date,
        effectiveDate: p.effective_date,
        value: Number(p.value),
        status: p.status as any,
        items: p.items,
        buyer: p.buyer_name,
        paymentStatus: p.payment_status as any,
        purchaseType: p.purchase_type,
        paymentMethod: p.payment_method,
        accountPlanId: p.account_plan_id
      })));
    } catch (error) {
      console.error('Error fetching purchasing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPurchase = async (order: PurchaseOrder) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .insert([{
          id: order.id,
          supplier_name: order.supplier,
          date: order.date,
          due_date: order.dueDate,
          effective_date: order.effectiveDate,
          value: order.value,
          status: order.status,
          items: order.items,
          buyer_name: order.buyer,
          payment_status: order.paymentStatus,
          purchase_type: order.purchaseType,
          payment_method: order.paymentMethod,
          account_plan_id: order.accountPlanId
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const updatePurchase = async (order: PurchaseOrder) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .update({
          supplier_name: order.supplier,
          date: order.date,
          due_date: order.dueDate,
          effective_date: order.effectiveDate,
          value: order.value,
          status: order.status,
          items: order.items,
          buyer_name: order.buyer,
          payment_status: order.paymentStatus,
          purchase_type: order.purchaseType,
          payment_method: order.paymentMethod,
          account_plan_id: order.accountPlanId
        })
        .eq('id', order.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating purchase:', error);
    }
  };

  const deletePurchase = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const updatePurchaseStatus = async (id: string, status: PurchaseOrder['status'], extraData?: Partial<PurchaseOrder>) => {
    const purchase = purchases.find(p => p.id === id);
    if (!purchase) return;

    const updatedPurchase = { 
      ...purchase, 
      status, 
      effectiveDate: status === 'completed' ? new Date().toISOString().split('T')[0] : purchase.effectiveDate,
      ...extraData
    };

    await updatePurchase(updatedPurchase);
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
