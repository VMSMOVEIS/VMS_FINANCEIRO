import React from 'react';
import { 
  Settings2, 
  Users, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Mail, 
  MessageSquare,
  Save,
  Trash2,
  Plus,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

const ProjectSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* General Settings */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          Configurações Gerais do Setor
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Setor</label>
              <input type="text" defaultValue="Gestão de Projetos" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Responsável Padrão</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option>Ricardo Silva</option>
                <option>Ana Paula</option>
                <option>Carlos Eduardo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição do Setor</label>
            <textarea 
              rows={3} 
              defaultValue="Setor responsável pelo planejamento, execução e monitoramento de todos os projetos estratégicos da VMS."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          Notificações e Alertas
        </h3>
        
        <div className="space-y-4">
          {[
            { label: 'Novas tarefas atribuídas', desc: 'Receber notificação quando uma nova tarefa for atribuída a você.' },
            { label: 'Prazos próximos (24h)', desc: 'Alertar sobre tarefas que vencem nas próximas 24 horas.' },
            { label: 'Comentários em tarefas', desc: 'Notificar quando alguém comentar em uma tarefa que você participa.' },
            { label: 'Resumo semanal por e-mail', desc: 'Enviar um relatório de progresso de todos os projetos ativos.' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-all">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={idx < 3} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Team Access */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Acesso da Equipe
          </h3>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Convidar Membro
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Ricardo Silva', role: 'Gerente de Projetos', access: 'Admin' },
            { name: 'Ana Paula', role: 'Coordenadora Técnica', access: 'Editor' },
            { name: 'Carlos Eduardo', role: 'Desenvolvedor Senior', access: 'Editor' },
            { name: 'Juliana Costa', role: 'UX/UI Designer', access: 'Viewer' },
          ].map((member, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  member.access === 'Admin' ? 'bg-rose-100 text-rose-700' :
                  member.access === 'Editor' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {member.access}
                </span>
                <button className="p-1 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all font-medium text-sm">
          <Trash2 className="w-4 h-4" />
          <span>Excluir Setor</span>
        </button>
        <div className="flex gap-3">
          <button className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all font-medium text-sm">
            Cancelar
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm">
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
