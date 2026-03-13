import React, { createContext, useContext, useState, useEffect } from 'react';
import { SalesPaymentMethod, Quote, Sale, Lead, Customer } from '../../types';
import { supabase } from '../lib/supabase';

interface SalesContextType {
  sales: Sale[];
  quotes: Quote[];
  leads: Lead[];
  customers: Customer[];
  paymentMethods: SalesPaymentMethod[];
  addSale: (sale: Sale) => Promise<void>;
  updateSale: (sale: Sale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  updateSaleStatus: (id: string, status: Sale['status'], extraData?: Partial<Sale>) => Promise<void>;
  addQuote: (quote: Quote) => Promise<void>;
  updateQuote: (quote: Quote) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SalesPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!leadsError) {
        setLeads(leadsData.map(l => ({
          id: l.id,
          company: l.company,
          contactName: l.contact_name,
          email: l.email,
          phone: l.phone,
          value: Number(l.value),
          status: l.status,
          lastContact: l.last_contact,
          date: l.date,
          source: l.source,
          probability: l.probability,
          expectedCloseDate: l.expected_close_date,
          orderDescription: l.order_description
        })));
      }

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

  const addLead = async (lead: Lead) => {
    if (!supabase) {
      setLeads(prev => [lead, ...prev]);
      return;
    }
    try {
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert([{
          company: lead.company,
          contact_name: lead.contactName,
          email: lead.email,
          phone: lead.phone,
          value: lead.value,
          status: lead.status,
          source: lead.source,
          probability: lead.probability,
          expected_close_date: lead.expectedCloseDate?.trim() || null,
          order_description: lead.orderDescription,
          date: lead.date || new Date().toISOString().split('T')[0],
          last_contact: lead.lastContact?.trim() || null,
          street: lead.street,
          number: lead.number,
          neighborhood: lead.neighborhood,
          city: lead.city,
          state: lead.state
        }])
        .select()
        .single();
      
      if (error) throw error;

      // Automatically create a customer record
      const { error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: lead.company,
          document_type: 'CNPJ', // Default to CNPJ for company, can be changed later
          document: '',
          contact_name: lead.contactName,
          email: lead.email,
          phone: lead.phone,
          status: 'finalizar_cadastro',
          lead_id: leadData.id,
          street: lead.street,
          number: lead.number,
          neighborhood: lead.neighborhood,
          city: lead.city,
          state: lead.state
        }]);

      if (customerError) {
        console.warn('Error creating customer from lead:', customerError.message);
      }

      await fetchData();
    } catch (error: any) {
      console.error('Error adding lead:', error);
    }
  };

  const updateLead = async (lead: Lead) => {
    if (!supabase) {
      setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
      return;
    }
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          company: lead.company,
          contact_name: lead.contactName,
          email: lead.email,
          phone: lead.phone,
          value: lead.value,
          status: lead.status,
          source: lead.source,
          probability: lead.probability,
          expected_close_date: lead.expectedCloseDate?.trim() || null,
          order_description: lead.orderDescription,
          last_contact: lead.lastContact?.trim() || new Date().toISOString(),
          street: lead.street,
          number: lead.number,
          neighborhood: lead.neighborhood,
          city: lead.city,
          state: lead.state
        })
        .eq('id', lead.id);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!supabase) {
      setLeads(prev => prev.filter(l => l.id !== id));
      return;
    }
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (error: any) {
      console.error('Error deleting lead:', error);
    }
  };

  const addCustomer = async (customer: Customer) => {
    if (!supabase) return;
    try {
      const customerData: any = {
        type: customer.type,
        document_type: customer.documentType,
        name: customer.name,
        business_name: customer.businessName,
        document: customer.document,
        contact_name: customer.contactName,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        address: customer.address,
        street: customer.street,
        number: customer.number,
        neighborhood: customer.neighborhood,
        city: customer.city,
        state: customer.state,
        zip_code: customer.zipCode,
        lead_id: customer.lead_id
      };

      // Only include ID if it's provided and not empty
      if (customer.id && customer.id.trim() !== "") {
        customerData.id = customer.id;
      }

      const { error } = await supabase
        .from('customers')
        .insert([customerData]);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding customer:', error);
    }
  };

  const updateCustomer = async (customer: Customer) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          type: customer.type,
          document_type: customer.documentType,
          name: customer.name,
          business_name: customer.businessName,
          document: customer.document,
          contact_name: customer.contactName,
          email: customer.email,
          phone: customer.phone,
          status: customer.status,
          address: customer.address,
          street: customer.street,
          number: customer.number,
          neighborhood: customer.neighborhood,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zipCode
        })
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
      leads,
      addLead,
      updateLead,
      deleteLead,
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
