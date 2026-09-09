import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Smartphone, AlertTriangle, Hash, 
  Filter, CheckCircle2, XCircle, ArrowUpRight, DollarSign,
  PackageCheck, Calendar, User as UserIcon
} from 'lucide-react';
import { Product, IMEIItem, Brand, Sale } from '../types';

interface StockViewProps {
  products: Product[];
  imeis: IMEIItem[];
  brands: Brand[];
  sales: Sale[];
  onSelectProduct?: (productId: string) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  products,
  imeis,
  brands,
  sales,
  onSelectProduct,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'imeis'>('geral');
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('Todas');
  const [stockStatusFilter, setStockStatusFilter] = useState('Todos');
  const [conditionFilter, setConditionFilter] = useState('Todos');
  const [imeiStatusFilter, setImeiStatusFilter] = useState('Todos');

  // Overview calculations
  const totalItemsCount = useMemo(() => {
    return products.reduce((acc, p) => acc + p.currentStock, 0);
  }, [products]);

  const totalCost = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);
  }, [products]);

  const totalSellValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.sellPrice * p.currentStock), 0);
  }, [products]);

  const projectedProfit = Math.max(0, totalSellValue - totalCost);

  // Filter products for Tab 1
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery);

      const matchesBrand = brandFilter === 'Todas' || p.brandName === brandFilter;
      const matchesCondition = conditionFilter === 'Todos' || p.condition === conditionFilter;

      let matchesStock = true;
      if (stockStatusFilter === 'baixo') matchesStock = p.currentStock > 0 && p.currentStock <= p.minStock;
      if (stockStatusFilter === 'zerado') matchesStock = p.currentStock === 0;
      if (stockStatusFilter === 'normal') matchesStock = p.currentStock > p.minStock;

      return matchesSearch && matchesBrand && matchesCondition && matchesStock;
    });
  }, [products, searchQuery, brandFilter, conditionFilter, stockStatusFilter]);

  // Filter IMEIs for Tab 2
  const filteredImeis = useMemo(() => {
    return imeis.filter((i) => {
      const matchesSearch = 
        i.imei.includes(searchQuery) ||
        (i.imei2 && i.imei2.includes(searchQuery)) ||
        i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.clientName && i.clientName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = imeiStatusFilter === 'Todos' || i.status === imeiStatusFilter;
      const matchesCondition = conditionFilter === 'Todos' || i.condition === conditionFilter;

      return matchesSearch && matchesStatus && matchesCondition;
    });
  }, [imeis, searchQuery, imeiStatusFilter, conditionFilter]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-600" />
            Controle de Estoque & Rastreamento de IMEIs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Visão patrimonial do estoque, alertas de ruptura e rastreabilidade individual de aparelhos.
          </p>
        </div>

        {/* SubTab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveSubTab('geral')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'geral' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visão Geral de Estoque
          </button>
          <button
            onClick={() => setActiveSubTab('imeis')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'imeis' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rastreamento Individual de IMEIs ({imeis.length})
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total de Peças em Estoque</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalItemsCount} unidades</p>
          <p className="text-[11px] text-slate-500 mt-1">Celulares e acessórios</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patrimônio em Custo</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Valor investido em mercadorias</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Valor de Venda Projetado</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            R$ {totalSellValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Faturamento total estimado</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lucro Bruto Projetado</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            R$ {projectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            Margem de {totalCost > 0 ? ((projectedProfit / totalCost) * 100).toFixed(1) : 0}% sobre o custo
          </p>
        </div>
      </div>

      {/* SUBTAB 1: Visão Geral de Estoque */}
      {activeSubTab === 'geral' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por modelo, código, código de barras..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
            >
              <option value="Todos">Todos os Status</option>
              <option value="normal">Estoque Normal</option>
              <option value="baixo">Estoque Baixo (Alerta)</option>
              <option value="zerado">Estoque Zerado</option>
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
            >
              <option value="Todas">Todas as Marcas</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
            >
              <option value="Todos">Todos os Estados</option>
              <option value="Novo">Novo</option>
              <option value="Seminovo">Seminovo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Código / Modelo</th>
                    <th className="py-3 px-4">Marca / Categoria</th>
                    <th className="py-3 px-4 text-center">Controle IMEI</th>
                    <th className="py-3 px-4 text-right">Preço Custo</th>
                    <th className="py-3 px-4 text-right">Preço Venda</th>
                    <th className="py-3 px-4 text-center">Estoque Atual</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Subtotal Venda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isZero = p.currentStock === 0;
                    const isLow = p.currentStock > 0 && p.currentStock <= p.minStock;
                    const subtotalVenda = p.sellPrice * p.currentStock;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{p.model}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Cód: {p.code} • {p.color} {p.storage && `• ${p.storage}`}
                          </p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{p.brandName}</p>
                          <p className="text-[10px] text-slate-400">{p.category} ({p.condition})</p>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {p.hasImei ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">
                              Sim (Rastreado)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Não (Geral)</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right text-slate-600">
                          R$ {p.costPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          R$ {p.sellPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {p.currentStock}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">/ mín {p.minStock}</span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isZero ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                              Zerado
                            </span>
                          ) : isLow ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] animate-pulse">
                              Baixo
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Normal
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                          R$ {subtotalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Rastreamento Individual de IMEIs */}
      {activeSubTab === 'imeis' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por número de IMEI (15 dígitos), cliente ou modelo..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <select
              value={imeiStatusFilter}
              onChange={(e) => setImeiStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
            >
              <option value="Todos">Todos os Status de IMEI</option>
              <option value="disponivel">Disponível em Estoque</option>
              <option value="vendido">Vendido ao Cliente</option>
              <option value="danificado">Danificado / Defeito</option>
              <option value="devolvido">Devolvido ao Fornecedor</option>
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
            >
              <option value="Todos">Todos os Estados</option>
              <option value="Novo">Novo</option>
              <option value="Seminovo">Seminovo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>

          {/* IMEIs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">IMEI Principal / IMEI 2</th>
                    <th className="py-3 px-4">Aparelho & Modelo</th>
                    <th className="py-3 px-4">Estado / Cor</th>
                    <th className="py-3 px-4">Entrada & Fornecedor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Custo</th>
                    <th className="py-3 px-4 text-right">Venda</th>
                    <th className="py-3 px-4">Histórico / Cliente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredImeis.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        Nenhum IMEI encontrado com os critérios de busca.
                      </td>
                    </tr>
                  ) : (
                    filteredImeis.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                              {item.imei}
                            </span>
                          </div>
                          {item.imei2 && (
                            <p className="text-[10px] text-slate-400 font-mono ml-5">
                              IMEI 2: {item.imei2}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{item.productName}</p>
                          {item.notes && <p className="text-[11px] text-slate-500">{item.notes}</p>}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.condition === 'Novo' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.condition}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-1.5">{item.color}</span>
                        </td>

                        <td className="py-3 px-4">
                          <p className="text-slate-700 font-medium">
                            {new Date(item.entryDate).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.supplierName || 'Fornecedor'}</p>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            item.status === 'disponivel' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : item.status === 'vendido' 
                                ? 'bg-slate-200 text-slate-800' 
                                : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right text-slate-600">
                          R$ {item.costPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          R$ {item.sellPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-4">
                          {item.status === 'vendido' ? (
                            <div>
                              <p className="font-bold text-blue-600">{item.clientName}</p>
                              <p className="text-[10px] text-slate-400">
                                Vendido em {item.soldDate ? new Date(item.soldDate).toLocaleDateString('pt-BR') : '-'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Disponível em prateleira</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
