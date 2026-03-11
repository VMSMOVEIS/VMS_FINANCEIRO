import React, { createContext, useContext, useState, useEffect } from 'react';
import { SalesPaymentMethod, Quote, Sale } from '../../types';
import { supabase } from '../lib/supabase';

interface SalesContextType {
  sales: Sale[];
  quotes: Quote[];
  customers: any[];
  paymentMethods: SalesPaymentMethod[];
  addSale: (sale: Sale) => Promise<void>;
  updateSale: (sale: Sale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  updateSaleStatus: (id: string, status: Sale['status'], extraData?: Partial<Sale>) => Promise<void>;
  addQuote: (quote: Quote) => Promise<void>;
  updateQuote: (quote: Quote) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  addCustomer: (customer: any) => Promise<void>;
  updateCustomer: (customer: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addPaymentMethod: (method: SalesPaymentMethod) => Promise<void>;
  updatePaymentMethod: (method: SalesPaymentMethod) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SalesPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (quotesError) throw quotesError;
      setQuotes(quotesData.map(q => ({
        id: q.id,
        client: q.client_name,
        productName: q.product_name,
        date: q.date,
        expiryDate: q.expiry_date,
        value: Number(q.value),
        status: q.status,
        items: q.items || [],
        bomItems: q.bom_items || [],
        profitMargin: Number(q.profit_margin),
        discount: Number(q.discount)
      })));

      // Fetch Sales Orders
      const { data: salesData, error: salesError } = await supabase
        .from('sales_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (salesError) throw salesError;
      setSales(salesData.map(s => ({
        id: s.id,
        customer: s.customer_name,
        salesperson: s.salesperson_name,
        store: s.store,
        date: s.date,
        effectiveDate: s.effective_date,
        dueDate: s.due_date,
        value: Number(s.value),
        status: s.status,
        items: s.items || [],
        itemCount: s.item_count || (s.items?.length || 0),
        totalQuantity: s.total_quantity,
        totalDiscount: Number(s.total_discount),
        otherExpenses: Number(s.other_expenses || 0),
        commission: Number(s.commission),
        paymentStatus: s.payment_status,
        origin: s.origin,
        notes: s.notes
      })));

      // Fetch Customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });
      
      if (customersError) {
        console.warn('Customers table might not exist yet:', customersError.message);
      } else {
        setCustomers(customersData);
      }

      // Fetch Payment Methods
      const { data: methodsData, error: methodsError } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name', { ascending: true });
      
      if (methodsError) {
        console.warn('Payment methods table might not exist yet:', methodsError.message);
        const savedPM = localStorage.getItem('vms_sales_payment_methods');
        if (savedPM) {
          setPaymentMethods(JSON.parse(savedPM));
        } else {
          setPaymentMethods([
            { id: '1', name: 'Pix', discount: 10, active: true },
            { id: '2', name: 'Dinheiro', discount: 5, active: true },
            { id: '3', name: 'Cartão de Débito', discount: 0, active: true },
            { id: '4', name: 'Cartão de Crédito', discount: 0, active: true },
            { id: '5', name: 'A Definir', discount: 0, active: true },
            { id: '6', name: 'Parcelado', discount: 0, active: true },
          ]);
        }
      } else if (methodsData && methodsData.length > 0) {
        setPaymentMethods(methodsData.map(m => ({
          id: m.id,
          name: m.name,
          discount: Number(m.discount),
          active: m.active
        })));
      } else {
        setPaymentMethods([
          { id: '1', name: 'Pix', discount: 10, active: true },
          { id: '2', name: 'Dinheiro', discount: 5, active: true },
          { id: '3', name: 'Cartão de Débito', discount: 0, active: true },
          { id: '4', name: 'Cartão de Crédito', discount: 0, active: true },
          { id: '5', name: 'A Definir', discount: 0, active: true },
          { id: '6', name: 'Parcelado', discount: 0, active: true },
        ]);
      }

    } catch (error: any) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSale = async (sale: Sale) => {
    if (!supabase) {
      setSales(prev => [sale, ...prev]);
      return;
    }
    try {
      const { error } = await supabase
        .from('sales_orders')
        .insert([{
          id: sale.id,
          customer_name: sale.customer,
          salesperson_name: sale.salesperson,
          store: sale.store,
          date: sale.date,
          effective_date: sale.effectiveDate,
          due_date: sale.dueDate,
          value: sale.value,
          status: sale.status,
          payment_status: sale.paymentStatus,
          origin: sale.origin,
          items: sale.items,
          total_quantity: sale.totalQuantity,
          total_discount: sale.totalDiscount,
          commission: sale.commission,
          notes: sale.notes
        }]);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding sale:', error);
      alert(`Erro ao salvar venda: ${error.message}`);
    }
  };

  const updateSale = async (sale: Sale) => {
    if (!supabase) {
      setSales(prev => prev.map(s => s.id === sale.id ? sale : s));
      return;
    }
    try {
      const { error } = await supabase
        .from('sales_orders')
        .update({
          customer_name: sale.customer,
          salesperson_name: sale.salesperson,
          store: sale.store,
          date: sale.date,
          effective_date: sale.effectiveDate,
          due_date: sale.dueDate,
          value: sale.value,
          status: sale.status,
          payment_status: sale.paymentStatus,
          origin: sale.origin,
          items: sale.items,
          total_quantity: sale.totalQuantity,
          total_discount: sale.totalDiscount,
          commission: sale.commission,
          notes: sale.notes
        })
        .eq('id', sale.id);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error updating sale:', error);
    }
  };

  const deleteSale = async (id: string) => {
    if (!supabase) {
      setSales(prev => prev.filter(s => s.id !== id));
      return;
    }
    try {
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      console.error('Error deleting sale:', error);
    }
  };

  const updateSaleStatus = async (id: string, status: Sale['status'], extraData?: Partial<Sale>) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    const updatedSale = { 
      ...sale, 
      status, 
      effectiveDate: status === 'completed' ? new Date().toISOString() : sale.effectiveDate,
      ...extraData
    };

    await updateSale(updatedSale);
  };

  const addQuote = async (quote: Quote) => {
    if (!supabase) {
      setQuotes(prev => [quote, ...prev]);
      return;
    }
    try {
      const { error } = await supabase
        .from('quotes')
        .insert([{
          id: quote.id,
          client_name: quote.client,
          product_name: quote.productName || (quote.items?.[0]?.name),
          date: quote.date,
          expiry_date: quote.expiryDate,
          value: quote.value,
          status: quote.status,
          items: quote.items,
          bom_items: quote.bomItems,
          profit_margin: quote.profitMargin,
          discount: quote.discount,
          notes: quote.notes
        }]);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding quote:', error);
      alert(`Erro ao salvar orçamento: ${error.message}`);
    }
  };

  const updateQuote = async (quote: Quote) => {
    if (!supabase) {
      setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
      return;
    }
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          client_name: quote.client,
          product_name: quote.productName || (quote.items?.[0]?.name),
          date: quote.date,
          expiry_date: quote.expiryDate,
          value: quote.value,
          status: quote.status,
          items: quote.items,
          bom_items: quote.bomItems,
          profit_margin: quote.profitMargin,
          discount: quote.discount,
          notes: quote.notes
        })
        .eq('id', quote.id);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error updating quote:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!supabase) {
      setQuotes(prev => prev.filter(q => q.id !== id));
      return;
    }
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (error: any) {
      console.error('Error deleting quote:', error);
    }
  };

  const addCustomer = async (customer: any) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('customers')
        .insert([customer]);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding customer:', error);
    }
  };

  const updateCustomer = async (customer: any) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', customer.id);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
    }
  };

  const addPaymentMethod = async (method: SalesPaymentMethod) => {
    if (!supabase) {
      const newMethods = [...paymentMethods, method];
      setPaymentMethods(newMethods);
      localStorage.setItem('vms_sales_payment_methods', JSON.stringify(newMethods));
      return;
    }
    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          id: method.id,
          name: method.name,
          discount: method.discount,
          active: method.active
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding payment method:', error);
    }
  };

  const updatePaymentMethod = async (method: SalesPaymentMethod) => {
    if (!supabase) {
      const newMethods = paymentMethods.map(m => m.id === method.id ? method : m);
      setPaymentMethods(newMethods);
      localStorage.setItem('vms_sales_payment_methods', JSON.stringify(newMethods));
      return;
    }
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          name: method.name,
          discount: method.discount,
          active: method.active
        })
        .eq('id', method.id);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error updating payment method:', error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!supabase) {
      const newMethods = paymentMethods.filter(m => m.id !== id);
      setPaymentMethods(newMethods);
      localStorage.setItem('vms_sales_payment_methods', JSON.stringify(newMethods));
      return;
    }
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
    }
  };

  return (
    <SalesContext.Provider value={{ 
      sales, 
      addSale, 
      updateSale,
      deleteSale,
      updateSaleStatus, 
      quotes,
      addQuote,
      updateQuote,
      deleteQuote,
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      paymentMethods, 
      addPaymentMethod, 
      updatePaymentMethod, 
      deletePaymentMethod,
      isLoading,
      refreshData: fetchData
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
