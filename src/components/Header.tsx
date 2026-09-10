import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, ShoppingCart, UserCheck, Bell, 
  Smartphone, Hash, User as UserIcon, Receipt, 
  ArrowRight, X, Layers
} from 'lucide-react';
import { User, Product, IMEIItem, Client, Sale } from '../types';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSaleDetail?: (saleId: string) => void;
  onSelectProductDetail?: (productId: string) => void;
  onSelectClientDetail?: (clientId: string) => void;
  products: Product[];
  imeis: IMEIItem[];
  clients: Client[];
  sales: Sale[];
  lowStockCount: number;
  overdueReceivablesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentUser,
  onSwitchUser,
  allUsers,
  setActiveTab,
  onOpenSaleDetail,
  onSelectProductDetail,
  onSelectClientDetail,
  products,
  imeis,
  clients,
  sales,
  lowStockCount,
  overdueReceivablesCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter global search results
  const q = searchQuery.toLowerCase().trim();
  const searchResults = React.useMemo(() => {
    if (!q || q.length < 2) return null;

    const matchedProducts = products.filter((p) => 
      p.model.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.brandName.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedImeis = imeis.filter((i) => 
      i.imei.includes(q) || (i.imei2 && i.imei2.includes(q))
    ).slice(0, 4);

    const matchedClients = clients.filter((c) => 
      c.name.toLowerCase().includes(q) ||
      c.cpfCnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
      c.phone.includes(q) ||
      c.code.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedSales = sales.filter((s) => 
      s.code.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.items.some((it) => it.imei && it.imei.includes(q))
    ).slice(0, 4);

    return {
      products: matchedProducts,
      imeis: matchedImeis,
      clients: matchedClients,
      sales: matchedSales,
      total: matchedProducts.length + matchedImeis.length + matchedClients.length + matchedSales.length
    };
  }, [q, products, imeis, clients, sales]);

  const totalNotifications = (lowStockCount > 0 ? 1 : 0) + (overdueReceivablesCount > 0 ? 1 : 0);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090e1a]/95 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 flex items-center justify-between shadow-lg text-slate-100">
      {/* Left: Mobile Menu Toggle & App Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box (Trigger or Input) */}
        <div ref={searchRef} className="relative w-64 sm:w-80 md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Buscar por IMEI, código, produto, cliente, venda..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-all text-slate-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isSearchOpen && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c1424] rounded-2xl shadow-2xl border border-slate-700/80 p-3 max-h-[80vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Resultados da Busca</span>
                <span>{searchResults.total} encontrados</span>
              </div>

              {searchResults.total === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Nenhum resultado encontrado para "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Products */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Smartphone className="w-3 h-3" /> Produtos
                      </span>
                      <div className="space-y-1">
                        {searchResults.products.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setActiveTab('produtos');
                              if (onSelectProductDetail) onSelectProductDetail(p.id);
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between cursor-pointer group text-xs transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                                {p.model}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {p.brandName} • Cód: {p.code} • Estoque: <span className={p.currentStock > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-bold'}>{p.currentStock} un</span>
                              </p>
                            </div>
                            <span className="font-semibold text-slate-100">
                              R$ {p.sellPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IMEIs */}
                  {searchResults.imeis.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Hash className="w-3 h-3" /> IMEIs Rastreados
                      </span>
                      <div className="space-y-1">
                        {searchResults.imeis.map((i) => (
                          <div
                            key={i.id}
                            onClick={() => {
                              setActiveTab('estoque');
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <p className="font-mono font-bold text-slate-100 text-xs">
                                IMEI: {i.imei}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {i.productName} ({i.condition})
                              </p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              i.status === 'disponivel' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {i.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clients */}
                  {searchResults.clients.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <UserIcon className="w-3 h-3" /> Clientes
                      </span>
                      <div className="space-y-1">
                        {searchResults.clients.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setActiveTab('clientes');
                              if (onSelectClientDetail) onSelectClientDetail(c.id);
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-100">{c.name}</p>
                              <p className="text-[11px] text-slate-400">CPF: {c.cpfCnpj} • Tel: {c.phone}</p>
                            </div>
                            {c.openBalance > 0 && (
                              <span className="text-[11px] text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-md">
                                Débito: R$ {c.openBalance.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sales */}
                  {searchResults.sales.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Receipt className="w-3 h-3" /> Vendas
                      </span>
                      <div className="space-y-1">
                        {searchResults.sales.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => {
                              setActiveTab('vendas');
                              if (onOpenSaleDetail) onOpenSaleDetail(s.id);
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <p className="font-mono font-bold text-slate-100">{s.code}</p>
                              <p className="text-[11px] text-slate-400">{s.clientName} • {new Date(s.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <span className="font-semibold text-slate-100">
                              R$ {s.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Action, Alerts, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick PDV Button */}
        <button
          id="btn-quick-pdv"
          onClick={() => setActiveTab('pdv')}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-950/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>PDV Venda Rápida</span>
        </button>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 relative transition-colors cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#090e1a] animate-pulse" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0c1424] rounded-2xl shadow-2xl border border-slate-700/80 p-3 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-100">Alertas do Sistema</span>
                <span className="text-[11px] text-slate-400">{totalNotifications} alertas</span>
              </div>
              <div className="py-2 space-y-2">
                {lowStockCount > 0 ? (
                  <div 
                    onClick={() => { setActiveTab('estoque'); setIsNotificationsOpen(false); }}
                    className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/70 text-amber-200 flex items-start gap-2.5 cursor-pointer hover:bg-amber-900/60 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-200">{lowStockCount} produto(s) com estoque crítico</p>
                      <p className="text-[11px] text-amber-400/90">Produtos no estoque mínimo ou zerados.</p>
                    </div>
                  </div>
                ) : null}

                {overdueReceivablesCount > 0 ? (
                  <div 
                    onClick={() => { setActiveTab('receber'); setIsNotificationsOpen(false); }}
                    className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/70 text-rose-200 flex items-start gap-2.5 cursor-pointer hover:bg-rose-900/60 transition-colors"
                  >
                    <Receipt className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-rose-200">{overdueReceivablesCount} parcela(s) vencida(s)</p>
                      <p className="text-[11px] text-rose-400/90">Contas a receber com prazo expirado.</p>
                    </div>
                  </div>
                ) : null}

                {totalNotifications === 0 && (
                  <p className="text-center py-4 text-slate-400">Tudo em dia! Sem alertas pendentes.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-100 leading-tight truncate max-w-[140px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-blue-400 font-medium">
                {currentUser.jobTitle || (currentUser.role === 'admin' ? 'Técnico TI' : currentUser.role)}
              </p>
            </div>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0c1424] rounded-2xl shadow-2xl border border-slate-700/80 p-2 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-top-1">
              <div className="p-2 border-b border-slate-800 mb-1">
                <p className="font-bold text-slate-100 text-sm">{currentUser.name}</p>
                <p className="text-slate-400 text-[11px]">{currentUser.email}</p>
                {(currentUser.phone || '(11) 98765-4321') && (
                  <p className="text-slate-400 text-[11px]">{currentUser.phone || '(11) 98765-4321'}</p>
                )}
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-300 bg-blue-950/70 border border-blue-800/70 px-2 py-0.5 rounded-md w-fit">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentUser.jobTitle || (currentUser.role === 'admin' ? 'Técnico TI' : currentUser.role)}</span>
                </div>
              </div>

              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Alternar Usuário para Testes
              </div>

              <div className="space-y-1">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      currentUser.id === user.id ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {user.jobTitle || (user.role === 'admin' ? 'Técnico TI' : user.role)}
                      </p>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
