import React, { createContext, useContext, useState, useEffect } from 'react';
import { StockAgingConfig, InventoryItem, ProductionOrder } from '../../types';

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
  const [stockAgingConfigs, setStockAgingConfigs] = useState<StockAgingConfig[]>(() => {
    const saved = localStorage.getItem('vms_production_stock_aging');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', days: 90, discount: 3, active: true },
      { id: '2', days: 180, discount: 7, active: true },
      { id: '3', days: 365, discount: 15, active: true },
    ];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vms_production_inventory');
    if (saved) return JSON.parse(saved);
    return MOCK_INVENTORY;
  });

  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => {
    const saved = localStorage.getItem('vms_production_orders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'OP-2026-001', productName: 'Mesa de Jantar Carvalho', client: 'Empresa Alpha Ltda', quantity: 2, deadline: '2026-03-25', status: 'in_production', priority: 'high', progress: 45 },
      { id: 'OP-2026-002', productName: 'Cadeira Estofada', client: 'João Silva ME', quantity: 12, deadline: '2026-03-20', status: 'waiting', priority: 'medium', progress: 0 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vms_production_stock_aging', JSON.stringify(stockAgingConfigs));
  }, [stockAgingConfigs]);

  useEffect(() => {
    localStorage.setItem('vms_production_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('vms_production_orders', JSON.stringify(productionOrders));
  }, [productionOrders]);

  const addStockAgingConfig = (config: StockAgingConfig) => {
    setStockAgingConfigs(prev => [...prev, config]);
  };

  const updateStockAgingConfig = (config: StockAgingConfig) => {
    setStockAgingConfigs(prev => prev.map(c => c.id === config.id ? config : c));
  };

  const deleteStockAgingConfig = (id: string) => {
    setStockAgingConfigs(prev => prev.filter(c => c.id !== id));
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  };

  const addProductionOrder = (order: ProductionOrder) => {
    setProductionOrders(prev => [order, ...prev]);
  };

  const updateProductionOrder = (order: ProductionOrder) => {
    setProductionOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const deleteProductionOrder = (id: string) => {
    setProductionOrders(prev => prev.filter(o => o.id !== id));
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
