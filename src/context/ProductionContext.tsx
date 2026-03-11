import React, { createContext, useContext, useState, useEffect } from 'react';
import { StockAgingConfig, InventoryItem, ProductionOrder } from '../../types';
import { supabase } from '../lib/supabase';

interface ProductionContextType {
  stockAgingConfigs: StockAgingConfig[];
  addStockAgingConfig: (config: StockAgingConfig) => void;
  updateStockAgingConfig: (config: StockAgingConfig) => void;
  deleteStockAgingConfig: (id: string) => void;
  inventory: InventoryItem[];
  updateInventoryItem: (item: InventoryItem) => void;
  addInventoryItem: (item: InventoryItem) => void;
  productionOrders: ProductionOrder[];
  addProductionOrder: (order: ProductionOrder) => void;
  updateProductionOrder: (order: ProductionOrder) => void;
  deleteProductionOrder: (id: string) => void;
}

const MOCK_INVENTORY: InventoryItem[] = [
  // PA - Pronta Entrega
  { id: 'PA-001', name: 'Mesa de Jantar Carvalho 6 Lugares', category: 'pronta_entrega', type: 'pa', quantity: 5, unit: 'UN', entryDate: '2025-12-10', location: 'A-01', value: 2500 },
  { id: 'PA-002', name: 'Cadeira Estofada Veludo Cinza', category: 'pronta_entrega', type: 'pa', quantity: 24, unit: 'UN', entryDate: '2026-01-15', location: 'A-02', value: 450 },
  { id: 'PA-003', name: 'Aparador Retrô Off White', category: 'pronta_entrega', type: 'pa', quantity: 3, unit: 'UN', entryDate: '2025-11-20', location: 'B-05', value: 890 },
  
  // PA - Sob Medida
  { id: 'PA-SM-001', name: 'Cozinha Planejada - Cliente João', category: 'sob_medida', type: 'pa', quantity: 1, unit: 'KIT', entryDate: '2026-03-01', location: 'Expedição', value: 15000 },
  { id: 'PA-SM-002', name: 'Painel TV Ripado - Cliente Maria', category: 'sob_medida', type: 'pa', quantity: 1, unit: 'UN', entryDate: '2026-03-05', location: 'Expedição', value: 3200 },

  // Processo - Pronta Entrega
  { id: 'PR-001', name: 'Sofá 3 Lugares Retrátil (Estrutura)', category: 'pronta_entrega', type: 'processo', quantity: 10, unit: 'UN', entryDate: '2026-03-08', location: 'Tapeçaria', value: 1200 },
  
  // Processo - Sob Medida
  { id: 'PR-SM-001', name: 'Dormitório Casal - Cliente Carlos', category: 'sob_medida', type: 'processo', quantity: 1, unit: 'KIT', entryDate: '2026-03-09', location: 'Montagem', value: 8500 },

  // MP
  { id: 'MP-001', name: 'Chapa MDF 18mm Carvalho', category: 'pronta_entrega', type: 'mp', quantity: 45, unit: 'CH', entryDate: '2026-02-10', location: 'Almoxarifado', value: 280 },
];

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const ProductionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockAgingConfigs, setStockAgingConfigs] = useState<StockAgingConfig[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [
        { data: configsData },
        { data: inventoryData },
        { data: ordersData }
      ] = await Promise.all([
        supabase.from('stock_aging_configs').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('production_orders').select('*').order('deadline', { ascending: true })
      ]);

      if (configsData) setStockAgingConfigs(configsData);
      if (inventoryData) setInventory(inventoryData.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category as any,
        type: i.type as any,
        quantity: Number(i.quantity),
        unit: i.unit,
        entryDate: i.entry_date,
        location: i.location,
        value: Number(i.value),
        estimatedCost: Number(i.estimated_cost)
      })));
      if (ordersData) setProductionOrders(ordersData.map(o => ({
        id: o.id,
        productName: o.product_name,
        client: o.client_name,
        quantity: Number(o.quantity),
        deadline: o.deadline,
        status: o.status as any,
        priority: o.priority as any,
        progress: o.progress,
        quoteId: o.quote_id
      })));

    } catch (error) {
      console.error('Error fetching production data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStockAgingConfig = async (config: StockAgingConfig) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('stock_aging_configs')
        .insert([{
          days: config.days,
          discount: config.discount,
          active: config.active
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding stock aging config:', error);
    }
  };

  const updateStockAgingConfig = async (config: StockAgingConfig) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('stock_aging_configs')
        .update({
          days: config.days,
          discount: config.discount,
          active: config.active
        })
        .eq('id', config.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating stock aging config:', error);
    }
  };

  const deleteStockAgingConfig = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('stock_aging_configs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting stock aging config:', error);
    }
  };

  const updateInventoryItem = async (item: InventoryItem) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: item.name,
          category: item.category,
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          entry_date: item.entryDate,
          location: item.location,
          value: item.value,
          estimated_cost: item.estimatedCost
        })
        .eq('id', item.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const addInventoryItem = async (item: InventoryItem) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('inventory')
        .insert([{
          id: item.id,
          name: item.name,
          category: item.category,
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          entry_date: item.entryDate,
          location: item.location,
          value: item.value,
          estimated_cost: item.estimatedCost
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const addProductionOrder = async (order: ProductionOrder) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('production_orders')
        .insert([{
          id: order.id,
          product_name: order.productName,
          client_name: order.client,
          quantity: order.quantity,
          deadline: order.deadline,
          status: order.status,
          priority: order.priority,
          progress: order.progress,
          quote_id: order.quoteId
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding production order:', error);
    }
  };

  const updateProductionOrder = async (order: ProductionOrder) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('production_orders')
        .update({
          product_name: order.productName,
          client_name: order.client,
          quantity: order.quantity,
          deadline: order.deadline,
          status: order.status,
          priority: order.priority,
          progress: order.progress,
          quote_id: order.quoteId
        })
        .eq('id', order.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating production order:', error);
    }
  };

  const deleteProductionOrder = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('production_orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting production order:', error);
    }
  };

  return (
    <ProductionContext.Provider value={{ 
      stockAgingConfigs, 
      addStockAgingConfig, 
      updateStockAgingConfig, 
      deleteStockAgingConfig,
      inventory,
      updateInventoryItem,
      addInventoryItem,
      productionOrders,
      addProductionOrder,
      updateProductionOrder,
      deleteProductionOrder
    }}>
      {children}
    </ProductionContext.Provider>
  );
};

export const useProduction = () => {
  const context = useContext(ProductionContext);
  if (context === undefined) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};
