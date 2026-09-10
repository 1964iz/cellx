import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Users, Layers, Smartphone, 
  PackageCheck, ArrowDownRight, ArrowUpRight, History, 
  CreditCard, DollarSign, Wallet, ShieldCheck, ArrowLeftRight, 
  Activity, BarChart3, ShieldAlert, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { User, CashRegister } from '../types';

export type ActiveTab = 
  | 'dashboard'
  | 'pdv'
  | 'produtos'
  | 'estoque'
  | 'entradas'
  | 'saidas'
  | 'vendas'
  | 'clientes'
  | 'marcas'
  | 'receber'
  | 'pagar'
  | 'caixa'
  | 'garantias'
  | 'trocas'
  | 'movimentacoes'
  | 'relatorios'
  | 'usuarios'
  | 'configuracoes';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cashRegister?: CashRegister;
  lowStockCount: number;
  overdueReceivablesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isOpen,
  setIsOpen,
  cashRegister,
  lowStockCount,
  overdueReceivablesCount
}) => {
  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'pdv' as ActiveTab, label: 'PDV - Venda Rápida', icon: ShoppingCart, highlight: true },
      ]
    },
    {
      title: 'Operacional & Estoque',
      items: [
        { id: 'produtos' as ActiveTab, label: 'Produtos e Modelos', icon: Smartphone },
        { id: 'estoque' as ActiveTab, label: 'Estoque & IMEIs', icon: Layers, badge: lowStockCount > 0 ? `${lowStockCount} alertas` : null, badgeColor: 'bg-amber-500' },
        { id: 'entradas' as ActiveTab, label: 'Entradas de Produtos', icon: ArrowDownRight },
        { id: 'saidas' as ActiveTab, label: 'Saídas & Ajustes', icon: ArrowUpRight },
        { id: 'marcas' as ActiveTab, label: 'Marcas', icon: PackageCheck },
      ]
    },
    {
      title: 'Vendas & Clientes',
      items: [
        { id: 'vendas' as ActiveTab, label: 'Histórico de Vendas', icon: History },
        { id: 'clientes' as ActiveTab, label: 'Clientes', icon: Users },
        { id: 'garantias' as ActiveTab, label: 'Garantias', icon: ShieldCheck },
        { id: 'trocas' as ActiveTab, label: 'Trocas e Devoluções', icon: ArrowLeftRight },
      ]
    },
    {
      title: 'Financeiro & Caixa',
      items: [
        { id: 'caixa' as ActiveTab, label: 'Controle de Caixa', icon: Wallet, badge: cashRegister?.status === 'aberto' ? 'Aberto' : 'Fechado', badgeColor: cashRegister?.status === 'aberto' ? 'bg-emerald-600' : 'bg-rose-500' },
        { id: 'receber' as ActiveTab, label: 'Contas a Receber', icon: DollarSign, badge: overdueReceivablesCount > 0 ? `${overdueReceivablesCount} vencidas` : null, badgeColor: 'bg-rose-500' },
        { id: 'pagar' as ActiveTab, label: 'Contas a Pagar', icon: CreditCard },
        { id: 'movimentacoes' as ActiveTab, label: 'Auditoria & Logs', icon: Activity },
        { id: 'relatorios' as ActiveTab, label: 'Relatórios Completos', icon: BarChart3 },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { id: 'usuarios' as ActiveTab, label: 'Usuários & Acesso', icon: ShieldAlert },
        { id: 'configuracoes' as ActiveTab, label: 'Configurações Loja', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Aside container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#080d19] text-slate-100 flex flex-col border-r border-slate-800/90
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/90 bg-[#050811]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                CellStore <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Gestão & PDV de Celulares</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Cash Register Quick Banner */}
        <div className="px-4 pt-3 pb-1">
          <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
            cashRegister?.status === 'aberto' 
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${cashRegister?.status === 'aberto' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className="font-semibold">Caixa {cashRegister?.status === 'aberto' ? 'Aberto' : 'Fechado'}</span>
            </div>
            <button 
              onClick={() => { setActiveTab('caixa'); setIsOpen(false); }}
              className="text-[11px] font-medium underline underline-offset-2 hover:opacity-80 cursor-pointer"
            >
              {cashRegister?.status === 'aberto' ? `Saldo: R$ ${cashRegister.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Abrir Caixa'}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-sm scrollbar-thin scrollbar-thumb-slate-700">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all text-left group cursor-pointer
                        ${item.highlight 
                          ? isActive 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                            : 'bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 border border-blue-500/20' 
                          : isActive
                            ? 'bg-slate-800 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white ${item.badgeColor || 'bg-slate-700'}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? 'opacity-100 translate-x-0 text-white' : 'text-slate-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer User Info & Role Switcher */}
        <div className="p-3 border-t border-slate-800/90 bg-[#050811]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#090e1a] border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-blue-400 font-medium truncate">
                  {currentUser.jobTitle || (currentUser.role === 'admin' ? 'Técnico e Vendedor' : currentUser.role)}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setActiveTab('usuarios'); }}
              title="Trocar perfil ou gerenciar usuários"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
