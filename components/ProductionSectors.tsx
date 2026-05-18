import React from 'react';
import { ProductionSector } from './ProductionSector';
import { Scissors, Cpu, Box, Brush, Truck, Calendar, Layers } from 'lucide-react';

export const ProductionCutting: React.FC = () => {
  return <ProductionSector name="Corte" moduleId="corte" icon={Scissors} />;
};

export const ProductionEdging: React.FC = () => {
  return <ProductionSector name="Colagem/Bordeamento" moduleId="bordeamento" icon={Layers} />;
};

export const ProductionMachining: React.FC = () => {
  return <ProductionSector name="Usinagem" moduleId="usinagem" icon={Cpu} />;
};

export const ProductionAssembly: React.FC = () => {
  return <ProductionSector name="Montagem" moduleId="montagem" icon={Box} />;
};

export const ProductionFinishing: React.FC = () => {
  return <ProductionSector name="Acabamento" moduleId="acabamento" icon={Brush} />;
};

export const ProductionInstallation: React.FC = () => {
  return <ProductionSector name="Instalação" moduleId="instalacao" icon={Truck} />;
};

export const ProductionSchedule: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Calendar className="text-orange-600" size={28} />
            Cronograma de Produção
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Gantt & Timeline de Entrega</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto sidebar-scroll">
         <div className="min-w-[800px]">
            {/* Simple Gantt Header */}
            <div className="grid grid-cols-12 border-b border-gray-100 pb-4 mb-4">
               <div className="col-span-3 font-black text-[10px] text-gray-400 uppercase tracking-widest">Projeto / OP</div>
               {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Sem 9'].map(s => (
                 <div key={s} className="text-center font-black text-[10px] text-gray-400 uppercase tracking-widest">{s}</div>
               ))}
            </div>

            {/* Mock Gantt Rows */}
            {[
              { name: 'Cozinha Gourmet Luxo', start: 1, duration: 4, color: 'bg-orange-500' },
              { name: 'Painel TV / Home', start: 2, duration: 2, color: 'bg-blue-500' },
              { name: 'Dormitório Casal', start: 4, duration: 3, color: 'bg-emerald-500' },
              { name: 'Área Gourmet Externa', start: 3, duration: 5, color: 'bg-purple-500' },
              { name: 'Closet Master', start: 6, duration: 2, color: 'bg-rose-500' },
              { name: 'Lavanderia Funcional', start: 5, duration: 3, color: 'bg-indigo-500' },
              { name: 'Home Office Tech', start: 7, duration: 2, color: 'bg-amber-500' },
              { name: 'Banheiro Suíte', start: 8, duration: 1, color: 'bg-teal-500' },
            ].map((p, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="col-span-3 font-bold text-xs text-gray-800">{p.name}</div>
                <div className="col-span-9 relative h-6 bg-gray-50/50 rounded-full">
                   <div 
                     className={`absolute h-full rounded-full ${p.color} shadow-sm flex items-center px-4 text-[9px] font-black text-white uppercase truncate`}
                     style={{ left: `${(p.start - 1) * 11.11}%`, width: `${p.duration * 11.11}%` }}
                   >
                     {p.duration > 1 && 'Em andamento'}
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
