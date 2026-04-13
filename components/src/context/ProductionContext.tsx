import React, { createContext, useContext, useState, useEffect } from 'react';
import { StockAgingConfig, InventoryItem, ProductionOrder, StockConfigItem, StockMovement, Supplier } from '../../types';
import { supabase } from '../lib/supabase';

interface ProductionContextType {
  stockAgingConfigs: StockAgingConfig[];
  addStockAgingConfig: (config: StockAgingConfig) => void;
  updateStockAgingConfig: (config: StockAgingConfig) => void;
  deleteStockAgingConfig: (id: string) => void;
  stockConfigItems: StockConfigItem[];
  addStockConfigItem: (item: Omit<StockConfigItem, 'id'>) => void;
  updateStockConfigItem: (item: StockConfigItem) => void;
  deleteStockConfigItem: (id: string) => void;
  inventory: InventoryItem[];
  updateInventoryItem: (item: InventoryItem) => void;
  addInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  finalizeProcess: (id: string) => void;
  stockMovements: StockMovement[];
  addStockMovement: (movement: Partial<StockMovement>) => Promise<void>;
  productionOrders: ProductionOrder[];
  addProductionOrder: (order: ProductionOrder) => void;
  updateProductionOrder: (order: ProductionOrder) => void;
  deleteProductionOrder: (id: string) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
}

const MOCK_INVENTORY: InventoryItem[] = [
  // PA - Pronta Entrega
  { 
    id: 'PA-001', 
    code: 'PA001',
    name: 'Mesa de Jantar Carvalho 6 Lugares', 
    description: 'Mesa de jantar em MDF com acabamento carvalho',
    category: 'Mesa', 
    stockCategory: 'pronta_entrega',
    type: 'pa', 
    quantity: 5, 
    unit: 'UN', 
    entryDate: '2025-12-10', 
    location: 'A-01', 
    value: 2500,
    estimatedCost: 1200
  },
  { 
    id: 'PA-002', 
    code: 'PA002',
    name: 'Cadeira Estofada Veludo Cinza', 
    description: 'Cadeira estofada com tecido veludo cinza',
    category: 'Cadeira', 
    stockCategory: 'pronta_entrega',
    type: 'pa', 
    quantity: 24, 
    unit: 'UN', 
    entryDate: '2026-01-15', 
    location: 'A-02', 
    value: 450,
    estimatedCost: 180
  },
  { 
    id: 'PA-003', 
    code: 'PA003',
    name: 'Aparador Retrô Off White', 
    description: 'Aparador estilo retrô na cor off white',
    category: 'Aparador', 
    stockCategory: 'pronta_entrega',
    type: 'pa', 
    quantity: 3, 
    unit: 'UN', 
    entryDate: '2025-11-20', 
    location: 'B-05', 
    value: 890,
    estimatedCost: 350
  },
  
  // PA - Sob Medida
  { 
    id: 'PA-SM-001', 
    code: 'PASM001',
    name: 'Cozinha Planejada - Cliente João', 
    description: 'Projeto de cozinha planejada completa',
    category: 'Cozinha', 
    stockCategory: 'sob_medida',
    type: 'pa', 
    quantity: 1, 
    unit: 'KIT', 
    entryDate: '2026-03-01', 
    location: 'Expedição', 
    value: 15000,
    estimatedCost: 8000
  },
  { 
    id: 'PA-SM-002', 
    code: 'PASM002',
    name: 'Painel TV Ripado - Cliente Maria', 
    description: 'Painel de TV ripado sob medida',
    category: 'Painel', 
    stockCategory: 'sob_medida',
    type: 'pa', 
    quantity: 1, 
    unit: 'UN', 
    entryDate: '2026-03-05', 
    location: 'Expedição', 
    value: 3200,
    estimatedCost: 1500
  },

  // Processo - Pronta Entrega
  { 
    id: 'PR-001', 
    code: 'PR001',
    name: 'Sofá 3 Lugares Retrátil (Estrutura)', 
    description: 'Estrutura de sofá 3 lugares retrátil',
    category: 'Sofá', 
    stockCategory: 'pronta_entrega',
    type: 'processo', 
    quantity: 10, 
    unit: 'UN', 
    entryDate: '2026-03-08', 
    location: 'Tapeçaria', 
    value: 1200,
    estimatedCost: 600
  },
  
  // Processo - Sob Medida
  { 
    id: 'PR-SM-001', 
    code: 'PRSM001',
    name: 'Dormitório Casal - Cliente Carlos', 
    description: 'Estrutura de dormitório de casal sob medida',
    category: 'Dormitório', 
    stockCategory: 'sob_medida',
    type: 'processo', 
    quantity: 1, 
    unit: 'KIT', 
    entryDate: '2026-03-09', 
    location: 'Montagem', 
    value: 8500,
    estimatedCost: 4000
  },

  // MP
  { 
    id: 'MP-001', 
    code: 'MP001',
    name: 'Chapa MDF 18mm Carvalho', 
    description: 'Chapa de MDF 18mm com acabamento carvalho',
    category: 'MDF', 
    stockCategory: 'pronta_entrega',
    type: 'mp', 
    quantity: 45, 
    unit: 'CH', 
    entryDate: '2026-02-10', 
    location: 'Almoxarifado', 
    value: 280,
    estimatedCost: 280
  },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S-001', name: 'Madeireira Central', cnpj: '12.345.678/0001-90', email: 'vendas@central.com', phone: '(11) 4002-8922', status: 'active', category: 'Madeiras' },
  { id: 'S-002', name: 'Ferragens & Cia', cnpj: '98.765.432/0001-10', email: 'contato@ferragens.com', phone: '(11) 5555-4444', status: 'active', category: 'Ferragens' },
];

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const ProductionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockAgingConfigs, setStockAgingConfigs] = useState<StockAgingConfig[]>([]);
  const [stockConfigItems, setStockConfigItems] = useState<StockConfigItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<any[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    if (!supabase) return;
    try {
      // Determine table based on category or context (default to mp if not specified)
      const isMercadoria = supplier.category?.toLowerCase().includes('revenda') || supplier.notes?.toLowerCase().includes('mercadoria');
      const table = isMercadoria ? 'suppliers_mercadoria' : 'suppliers_mp';

      const { error } = await supabase
        .from(table)
        .insert([{
          name: supplier.name,
          cnpj: supplier.cnpj || null,
          contact_name: supplier.contactName || null,
          email: supplier.email || null,
          phone: supplier.phone || null,
          address: supplier.address || null,
          city: supplier.city || null,
          state: supplier.state || null,
          zip_code: supplier.zipCode || null,
          category: supplier.category || null,
          status: supplier.status,
          notes: supplier.notes || null,
          rating: supplier.rating || 0,
          last_order_date: supplier.lastOrderDate || null
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const updateSupplier = async (supplier: Supplier) => {
    if (!supabase) return;
    try {
      // Try both tables or use a flag if we added it
      const isMercadoria = suppliers.find(s => s.id === supplier.id && (s as any).supplier_type === 'mercadoria');
      const table = isMercadoria ? 'suppliers_mercadoria' : 'suppliers_mp';

      const { error } = await supabase
        .from(table)
        .update({
          name: supplier.name,
          cnpj: supplier.cnpj || null,
          contact_name: supplier.contactName || null,
          email: supplier.email || null,
          phone: supplier.phone || null,
          address: supplier.address || null,
          city: supplier.city || null,
          state: supplier.state || null,
          zip_code: supplier.zipCode || null,
          category: supplier.category || null,
          status: supplier.status,
          notes: supplier.notes || null,
          rating: supplier.rating || 0,
          last_order_date: supplier.lastOrderDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', supplier.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const deleteSupplier = async (id: string) => {
    if (!supabase) return;
    try {
      const isMercadoria = suppliers.find(s => s.id === id && (s as any).supplier_type === 'mercadoria');
      const table = isMercadoria ? 'suppliers_mercadoria' : 'suppliers_mp';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await Promise.all([
        supabase.from('stock_aging_configs').select('*'),
        // Fetch from independent config tables
        supabase.from('stock_config_items_mp').select('*'),
        supabase.from('stock_config_items_pa').select('*'),
        supabase.from('stock_config_items_mercadoria').select('*'),
        // Fetch from independent inventory tables
        supabase.from('inventory_mp').select('*'),
        supabase.from('inventory_pa').select('*'),
        supabase.from('inventory_processo').select('*'),
        supabase.from('inventory_mercadoria').select('*'),
        // Fetch from production orders
        supabase.from('production_orders').select('*').order('deadline', { ascending: true }),
        // Fetch from independent movement tables
        supabase.from('stock_movements_mp').select('*').order('date', { ascending: false }),
        supabase.from('stock_movements_pa').select('*').order('date', { ascending: false }),
        supabase.from('stock_movements_mercadoria').select('*').order('date', { ascending: false }),
        // Fetch from independent supplier tables
        supabase.from('suppliers_mp').select('*').order('name'),
        supabase.from('suppliers_mercadoria').select('*').order('name')
      ]);

      const configsData = results[0].data;
      
      // Merge config items
      const stockItemsData = [
        ...(results[1].data || []),
        ...(results[2].data || []),
        ...(results[3].data || [])
      ];

      // Merge inventory items with type tagging
      const inventoryData = [
        ...(results[4].data || []).map(i => ({ ...i, type: 'mp' })),
        ...(results[5].data || []).map(i => ({ ...i, type: 'pa' })),
        ...(results[6].data || []).map(i => ({ ...i, type: 'processo' })),
        ...(results[7].data || []).map(i => ({ ...i, type: 'mercadoria' }))
      ];

      const ordersData = results[8].data;

      // Merge movements
      const movementsData = [
        ...(results[9].data || []),
        ...(results[10].data || []),
        ...(results[11].data || [])
      ];

      // Merge suppliers with type tagging (optional, but helps if needed)
      const suppliersData = [
        ...(results[12].data || []).map(s => ({ ...s, supplier_type: 'mp' })),
        ...(results[13].data || []).map(s => ({ ...s, supplier_type: 'mercadoria' }))
      ];

      if (configsData) setStockAgingConfigs(configsData);
      if (stockItemsData) setStockConfigItems(stockItemsData);
      if (movementsData) setStockMovements(movementsData);
      if (suppliersData) setSuppliers(suppliersData.map(s => ({
        id: s.id,
        name: s.name,
        cnpj: s.cnpj,
        contactName: s.contact_name,
        email: s.email,
        phone: s.phone,
        address: s.address,
        city: s.city,
        state: s.state,
        zipCode: s.zip_code,
        category: s.category,
        status: s.status as any,
        notes: s.notes,
        rating: Number(s.rating || 0),
        lastOrderDate: s.last_order_date
      })));
      
      if (inventoryData) setInventory(inventoryData.map(i => ({
        id: i.id,
        code: i.code || '',
        name: i.name,
        description: i.description || '',
        type: i.type as any,
        category: i.category || '',
        stockCategory: i.stock_category as any,
        brand: i.brand || '',
        model: i.model || '',
        quantity: Number(i.quantity),
        unit: i.unit,
        location: i.location || '',
        value: Number(i.value),
        estimatedCost: Number(i.estimated_cost),
        minStock: Number(i.min_stock || 0),
        maxStock: Number(i.max_stock || 0),
        margin: Number(i.margin || 0),
        markup: Number(i.markup || 0),
        commission: Number(i.commission || 0),
        warranty: i.warranty || '',
        productionLeadTime: Number(i.production_lead_time || 0),
        ncm: i.ncm || '',
        cfop: i.cfop || '',
        cst_csosn: i.cst_csosn || '',
        entryDate: i.entry_date,
        trackStock: i.track_stock,
        averageCost: Number(i.average_cost || 0),
        lastPurchaseCost: Number(i.last_purchase_cost || 0),
        standardCost: Number(i.standard_cost || 0),
        defaultSupplierId: i.default_supplier_id,
        purchaseLeadTime: Number(i.purchase_lead_time || 0),
        minPurchaseQuantity: Number(i.min_purchase_quantity || 0),
        purchaseUnit: i.purchase_unit || '',
        consumptionUnit: i.consumption_unit || '',
        conversionFactor: Number(i.conversion_factor || 1),
        thickness: i.thickness ? Number(i.thickness) : undefined,
        color: i.color || '',
        length: i.length ? Number(i.length) : undefined,
        width: i.width ? Number(i.width) : undefined,
        baseMaterial: i.base_material || '',
        productOrigin: i.product_origin || '',
        status: i.status as any,
        updatedAt: i.updated_at
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
        quoteId: o.quote_id,
        orderNumber: o.order_number,
        startDate: o.start_date,
        responsible: o.responsible
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

  const addStockConfigItem = async (item: Omit<StockConfigItem, 'id'>) => {
    if (!supabase) return;
    try {
      let table = 'stock_config_items_mp';
      if (item.type.startsWith('pa_')) table = 'stock_config_items_pa';
      else if (item.type.startsWith('mercadoria_')) table = 'stock_config_items_mercadoria';

      const { error } = await supabase
        .from(table)
        .insert([{
          id: Math.random().toString(36).substr(2, 9),
          name: item.name,
          type: item.type
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding stock config item:', error);
    }
  };

  const updateStockConfigItem = async (item: StockConfigItem) => {
    if (!supabase) return;
    try {
      let table = 'stock_config_items_mp';
      if (item.type.startsWith('pa_')) table = 'stock_config_items_pa';
      else if (item.type.startsWith('mercadoria_')) table = 'stock_config_items_mercadoria';

      const { error } = await supabase
        .from(table)
        .update({
          name: item.name,
          type: item.type
        })
        .eq('id', item.id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating stock config item:', error);
    }
  };

  const deleteStockConfigItem = async (id: string) => {
    if (!supabase) return;
    try {
      // Try to find which table it belongs to
      const item = stockConfigItems.find(i => i.id === id);
      if (!item) return;

      let table = 'stock_config_items_mp';
      if (item.type.startsWith('pa_')) table = 'stock_config_items_pa';
      else if (item.type.startsWith('mercadoria_')) table = 'stock_config_items_mercadoria';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting stock config item:', error);
    }
  };

  const updateInventoryItem = async (item: InventoryItem) => {
    if (!supabase) return;
    try {
      let table = 'inventory_mp';
      if (item.type === 'pa') table = 'inventory_pa';
      else if (item.type === 'processo') table = 'inventory_processo';
      else if (item.type === 'mercadoria') table = 'inventory_mercadoria';

      const { error } = await supabase
        .from(table)
        .update({
          code: item.code,
          name: item.name,
          description: item.description,
          category: item.category,
          stock_category: item.stockCategory,
          brand: item.brand,
          model: item.model,
          quantity: item.quantity,
          unit: item.unit,
          location: item.location,
          value: item.value,
          estimated_cost: item.estimatedCost,
          min_stock: item.minStock,
          max_stock: item.maxStock,
          margin: item.margin,
          markup: item.markup,
          commission: item.commission,
          warranty: item.warranty,
          production_lead_time: item.productionLeadTime,
          ncm: item.ncm,
          cfop: item.cfop,
          cst_csosn: item.cst_csosn,
          entry_date: item.entryDate || null,
          track_stock: item.trackStock,
          average_cost: item.averageCost,
          last_purchase_cost: item.lastPurchaseCost,
          standard_cost: item.standardCost,
          default_supplier_id: item.defaultSupplierId || null,
          purchase_lead_time: item.purchaseLeadTime,
          min_purchase_quantity: item.minPurchaseQuantity,
          purchase_unit: item.purchaseUnit,
          consumption_unit: item.consumptionUnit,
          conversion_factor: item.conversionFactor,
          thickness: item.thickness,
          color: item.color,
          length: item.length,
          width: item.width,
          base_material: item.baseMaterial,
          product_origin: item.productOrigin,
          status: item.status,
          updated_at: new Date().toISOString()
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
      let table = 'inventory_mp';
      if (item.type === 'pa') table = 'inventory_pa';
      else if (item.type === 'processo') table = 'inventory_processo';
      else if (item.type === 'mercadoria') table = 'inventory_mercadoria';

      const { error } = await supabase
        .from(table)
        .insert([{
          code: item.code,
          name: item.name,
          description: item.description,
          category: item.category,
          stock_category: item.stockCategory,
          brand: item.brand,
          model: item.model,
          quantity: item.quantity,
          unit: item.unit,
          location: item.location,
          value: item.value,
          estimated_cost: item.estimatedCost,
          min_stock: item.minStock,
          max_stock: item.maxStock,
          margin: item.margin,
          markup: item.markup,
          commission: item.commission,
          warranty: item.warranty,
          production_lead_time: item.productionLeadTime,
          ncm: item.ncm,
          cfop: item.cfop,
          cst_csosn: item.cst_csosn,
          entry_date: item.entryDate || null,
          track_stock: item.trackStock,
          average_cost: item.averageCost,
          last_purchase_cost: item.lastPurchaseCost,
          standard_cost: item.standardCost,
          default_supplier_id: item.defaultSupplierId || null,
          purchase_lead_time: item.purchaseLeadTime,
          min_purchase_quantity: item.minPurchaseQuantity,
          purchase_unit: item.purchaseUnit,
          consumption_unit: item.consumptionUnit,
          conversion_factor: item.conversionFactor,
          thickness: item.thickness,
          color: item.color,
          length: item.length,
          width: item.width,
          base_material: item.baseMaterial,
          product_origin: item.productOrigin,
          status: item.status || 'active'
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    if (!supabase) return;
    try {
      const item = inventory.find(i => i.id === id);
      if (!item) return;

      let table = 'inventory_mp';
      if (item.type === 'pa') table = 'inventory_pa';
      else if (item.type === 'processo') table = 'inventory_processo';
      else if (item.type === 'mercadoria') table = 'inventory_mercadoria';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const finalizeProcess = async (id: string) => {
    if (!supabase) return;
    try {
      // Finalizing process means moving from inventory_processo to inventory_pa
      const item = inventory.find(i => i.id === id && i.type === 'processo');
      if (!item) return;

      // 1. Add to inventory_pa
      const { error: insertError } = await supabase
        .from('inventory_pa')
        .insert([{
          code: item.code,
          name: item.name,
          description: item.description,
          category: item.category,
          stock_category: item.stockCategory,
          quantity: item.quantity,
          unit: item.unit,
          location: item.location,
          value: item.value,
          estimated_cost: item.estimatedCost,
          status: 'active'
        }]);

      if (insertError) throw insertError;

      // 2. Remove from inventory_processo
      const { error: deleteError } = await supabase
        .from('inventory_processo')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchData();
    } catch (error) {
      console.error('Error finalizing process:', error);
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
          deadline: order.deadline || null,
          status: order.status,
          priority: order.priority,
          progress: order.progress,
          quote_id: order.quoteId || null,
          order_number: order.orderNumber || null,
          start_date: order.startDate || null,
          responsible: order.responsible || null
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
          deadline: order.deadline || null,
          status: order.status,
          priority: order.priority,
          progress: order.progress,
          quote_id: order.quoteId || null,
          order_number: order.orderNumber || null,
          start_date: order.startDate || null,
          responsible: order.responsible || null
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

  const addStockMovement = async (movement: Partial<StockMovement>) => {
    if (!supabase) return;
    try {
      const item = inventory.find(i => i.id === movement.inventory_id);
      if (!item) return;

      let table = 'stock_movements_mp';
      if (item.type === 'pa') table = 'stock_movements_pa';
      else if (item.type === 'processo') table = 'stock_movements_processo';
      else if (item.type === 'mercadoria') table = 'stock_movements_mercadoria';

      const { error } = await supabase
        .from(table)
        .insert([{
          inventory_id: movement.inventory_id || null,
          type: movement.type,
          quantity: movement.quantity,
          unit_cost: movement.unit_cost,
          total_value: movement.total_value,
          reason: movement.reason,
          reference_id: movement.reference_id,
          responsible: movement.responsible,
          date: movement.date || new Date().toISOString(),
          supplier: movement.supplier,
          item_code: movement.item_code,
          discount: movement.discount
        }]);
      
      if (error) throw error;

      // Update inventory quantity
      if (item) {
        const newQuantity = movement.type === 'entry' 
          ? item.quantity + (movement.quantity || 0) 
          : item.quantity - (movement.quantity || 0);
        
        await updateInventoryItem({
          ...item,
          quantity: newQuantity,
          lastPurchaseCost: movement.type === 'entry' ? (movement.unit_cost || item.lastPurchaseCost) : item.lastPurchaseCost,
          averageCost: movement.type === 'entry' 
            ? (item.averageCost * item.quantity + (movement.total_value || 0)) / (item.quantity + (movement.quantity || 0))
            : item.averageCost
        });
      }

      await fetchData();
    } catch (error) {
      console.error('Error adding stock movement:', error);
    }
  };

  return (
    <ProductionContext.Provider value={{ 
      stockAgingConfigs, 
      addStockAgingConfig, 
      updateStockAgingConfig, 
      deleteStockAgingConfig,
      stockConfigItems,
      addStockConfigItem,
      updateStockConfigItem,
      deleteStockConfigItem,
      inventory,
      updateInventoryItem,
      addInventoryItem,
      deleteInventoryItem,
      finalizeProcess,
      stockMovements,
      addStockMovement,
      productionOrders,
      addProductionOrder,
      updateProductionOrder,
      deleteProductionOrder,
      suppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier
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
