import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Smartphone, 
  Package, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  Calendar, ShoppingBag, Clock, CheckCircle2, ChevronRight,
  Layers, CreditCard, ShieldCheck, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { Sale, Product, IMEIItem, AccountReceivable, StockMovement, CashRegister } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  sales: Sale[];
  products: Product[];
  imeis: IMEIItem[];
  receivables: AccountReceivable[];
  movements: StockMovement[];
  cashRegister?: CashRegister;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSaleDetail: (saleId: string) => void;
}

type PeriodFilter = 'hoje' | 'ontem' | '7dias' | 'este_mes' | 'mes_anterior' | 'personalizado';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  sales,
  products,
  imeis,
  receivables,
  movements,
  cashRegister,
  setActiveTab,
  onOpenSaleDetail,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('este_mes');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Date Filtering Logic
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return sales.filter((sale) => {
      if (sale.status === 'cancelada') return false;
      const saleDate = sale.date.split('T')[0];

      if (period === 'hoje') return saleDate === todayStr;
      if (period === 'ontem') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return saleDate === yesterday.toISOString().split('T')[0];
      }
      if (period === '7dias') {
        const d7 = new Date(now);
        d7.setDate(now.getDate() - 7);
        return saleDate >= d7.toISOString().split('T')[0] && saleDate <= todayStr;
      }
      if (period === 'este_mes') {
        const currentMonth = now.toISOString().substring(0, 7);
        return saleDate.startsWith(currentMonth);
      }
      if (period === 'mes_anterior') {
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthStr = prevMonthDate.toISOString().substring(0, 7);
        return saleDate.startsWith(prevMonthStr);
      }
      if (period === 'personalizado' && customStartDate && customEndDate) {
        return saleDate >= customStartDate && saleDate <= customEndDate;
      }
      return true;
    });
  }, [sales, period, customStartDate, customEndDate]);

  // Key KPI Metrics Calculations
  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = now.toISOString().substring(0, 7);

    // Vendas hoje
    const salesToday = sales.filter((s) => s.status === 'concluida' && s.date.startsWith(todayStr));
    const totalToday = salesToday.reduce((acc, s) => acc + s.total, 0);

    // Vendas este mês
    const salesMonth = sales.filter((s) => s.status === 'concluida' && s.date.startsWith(currentMonthStr));
    const totalMonth = salesMonth.reduce((acc, s) => acc + s.total, 0);

    // Lucro estimado (Receita - Custo dos itens vendidos)
    const totalCostPeriod = filteredSales.reduce((acc, s) => {
      const saleCost = s.items.reduce((iAcc, item) => iAcc + (item.costPrice * item.quantity), 0);
      return acc + saleCost;
    }, 0);
    const totalRevenuePeriod = filteredSales.reduce((acc, s) => acc + s.total, 0);
    const estimatedProfitPeriod = Math.max(0, totalRevenuePeriod - totalCostPeriod);
    const marginPercent = totalRevenuePeriod > 0 ? ((estimatedProfitPeriod / totalRevenuePeriod) * 100) : 0;

    // Estoque: Celulares vs Acessórios
    const totalPhonesStock = products
      .filter((p) => p.category === 'Celular' || p.category === 'Smartphone')
      .reduce((acc, p) => acc + p.currentStock, 0);

    const totalAccessoriesStock = products
      .filter((p) => p.category !== 'Celular' && p.category !== 'Smartphone')
      .reduce((acc, p) => acc + p.currentStock, 0);

    const totalStockValueCost = products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);
    const totalStockValueSell = products.reduce((acc, p) => acc + (p.sellPrice * p.currentStock), 0);

    // Alertas de estoque
    const lowStockProducts = products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minStock);
    const zeroStockProducts = products.filter((p) => p.currentStock === 0);

    // Contas a Receber
    const totalReceivablePending = receivables
      .filter((r) => r.status !== 'Pago')
      .reduce((acc, r) => acc + r.balance, 0);

    const totalReceivableOverdue = receivables
      .filter((r) => r.status === 'Vencido')
      .reduce((acc, r) => acc + r.balance, 0);

    // Entradas e saídas de caixa hoje
    const todayMovements = movements.filter((m) => m.date.startsWith(todayStr));
    const todayEntriesCount = todayMovements.filter((m) => m.type === 'entrada').reduce((acc, m) => acc + m.quantity, 0);
    const todayExitsCount = todayMovements.filter((m) => m.type === 'saida' || m.type === 'venda').reduce((acc, m) => acc + m.quantity, 0);

    return {
      totalToday,
      countToday: salesToday.length,
      totalMonth,
      countMonth: salesMonth.length,
      totalRevenuePeriod,
      estimatedProfitPeriod,
      marginPercent,
      totalPhonesStock,
      totalAccessoriesStock,
      totalStockValueCost,
      totalStockValueSell,
      lowStockProducts,
      zeroStockProducts,
      totalReceivablePending,
      totalReceivableOverdue,
      todayEntriesCount,
      todayExitsCount,
    };
  }, [sales, products, filteredSales, receivables, movements]);

  // Chart Data 1: Sales over days
  const salesByDayData = useMemo(() => {
    const dayMap: { [key: string]: { date: string; total: number; lucro: number } } = {};
    
    // Sort chronological
    const sorted = [...filteredSales].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach((sale) => {
      const day = new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const saleCost = sale.items.reduce((acc, it) => acc + (it.costPrice * it.quantity), 0);
      const profit = Math.max(0, sale.total - saleCost);

      if (!dayMap[day]) {
        dayMap[day] = { date: day, total: 0, lucro: 0 };
      }
      dayMap[day].total += sale.total;
      dayMap[day].lucro += profit;
    });

    const result = Object.values(dayMap);
    if (result.length === 0) {
      return [{ date: 'Hoje', total: metrics.totalToday, lucro: metrics.totalToday * 0.25 }];
    }
    return result;
  }, [filteredSales, metrics.totalToday]);

  // Chart Data 2: Top Selling Products
  const topProductsData = useMemo(() => {
    const prodMap: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    filteredSales.forEach((s) => {
      s.items.forEach((it) => {
        if (!prodMap[it.productName]) {
          prodMap[it.productName] = { name: it.productName, quantity: 0, revenue: 0 };
        }
        prodMap[it.productName].quantity += it.quantity;
        prodMap[it.productName].revenue += it.total;
      });
    });

    return Object.values(prodMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredSales]);

  // Chart Data 3: Payment Methods Share
  const paymentMethodsData = useMemo(() => {
    const methodMap: { [key: string]: number } = {};
    filteredSales.forEach((s) => {
      s.payments.forEach((p) => {
        methodMap[p.method] = (methodMap[p.method] || 0) + p.amount;
      });
    });

    return Object.entries(methodMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [filteredSales]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Title & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Painel Geral da Loja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Métricas de desempenho, estoque de celulares, financeiro e fluxo de vendas em tempo real.
          </p>
        </div>

        {/* Period Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 text-xs font-semibold">
          {[
            { id: 'hoje', label: 'Hoje' },
            { id: 'ontem', label: 'Ontem' },
            { id: '7dias', label: '7 Dias' },
            { id: 'este_mes', label: 'Este Mês' },
            { id: 'mes_anterior', label: 'Mês Anterior' },
            { id: 'personalizado', label: 'Personalizado' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as PeriodFilter)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === item.id 
                  ? 'bg-white text-blue-600 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs */}
      {period === 'personalizado' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center gap-3 text-xs text-blue-900">
          <span className="font-semibold flex items-center gap-1">
            <Filter className="w-4 h-4" /> Intervalo de Datas:
          </span>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="px-3 py-1 bg-white border border-blue-300 rounded-lg"
          />
          <span>até</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="px-3 py-1 bg-white border border-blue-300 rounded-lg"
          />
        </div>
      )}

      {/* Row 1: Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vendas Hoje */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendas Hoje</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-light text-[#0f2b5c] tracking-tight">
              R$ {metrics.totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-normal text-[#1e3a8a]">{metrics.countToday} venda(s)</span> hoje
            </p>
          </div>
        </div>

        {/* Vendas no Mês */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendas no Mês</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-light text-[#0f2b5c] tracking-tight">
              R$ {metrics.totalMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-normal text-[#1e3a8a]">{metrics.countMonth} pedidos</span> no mês atual
            </p>
          </div>
        </div>

        {/* Lucro Estimado no Período */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lucro Estimado</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-light text-[#0f2b5c] tracking-tight">
              R$ {metrics.estimatedProfitPeriod.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              Margem média de <span className="font-normal text-[#1e3a8a]">{metrics.marginPercent.toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Contas a Receber (Crediário / Fiado) */}
        <div 
          onClick={() => setActiveTab('receber')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total a Receber</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-light text-[#0f2b5c] tracking-tight">
              R$ {metrics.totalReceivablePending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs mt-1 flex items-center justify-between">
              <span className={metrics.totalReceivableOverdue > 0 ? 'text-rose-600 font-normal' : 'text-slate-500'}>
                {metrics.totalReceivableOverdue > 0 ? `R$ ${metrics.totalReceivableOverdue.toFixed(2)} vencidos` : 'Nenhum vencido'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Celulares em Estoque */}
        <div 
          onClick={() => setActiveTab('estoque')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Celulares em Estoque</p>
              <p className="text-lg font-light text-[#0f2b5c]">{metrics.totalPhonesStock} aparelhos</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">IMEI</span>
        </div>

        {/* Acessórios em Estoque */}
        <div 
          onClick={() => setActiveTab('produtos')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Acessórios em Estoque</p>
              <p className="text-lg font-light text-[#0f2b5c]">{metrics.totalAccessoriesStock} peças</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">Geral</span>
        </div>

        {/* Alertas Estoque Crítico */}
        <div 
          onClick={() => setActiveTab('estoque')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              metrics.lowStockProducts.length > 0 || metrics.zeroStockProducts.length > 0 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Estoque Crítico / Baixo</p>
              <p className="text-lg font-light text-[#0f2b5c]">
                {metrics.lowStockProducts.length + metrics.zeroStockProducts.length} itens
              </p>
            </div>
          </div>
          {metrics.zeroStockProducts.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
              {metrics.zeroStockProducts.length} Zerados
            </span>
          )}
        </div>

        {/* Valor Total Investido em Estoque */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Valor em Estoque (Custo)</p>
              <p className="text-lg font-light text-[#0f2b5c]">
                R$ {metrics.totalStockValueCost.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400">Venda Estimada</p>
            <p className="text-xs font-normal text-[#1e3a8a]">
              R$ {metrics.totalStockValueSell.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Vendas e Lucro por Período */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Evolução de Vendas e Lucro</h2>
              <p className="text-xs text-slate-500">Faturamento bruto versus margem estimada no período selecionado</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip 
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" name="Faturamento" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="lucro" name="Lucro Bruto" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLucro)" />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Formas de Pagamento */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Formas de Pagamento</h2>
            <p className="text-xs text-slate-500">Distribuição do faturamento por modalidade</p>
          </div>
          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentMethodsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Total']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {paymentMethodsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-normal text-[#0f2b5c]">
                  R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Top Selling & Latest Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Produtos Mais Vendidos</h2>
              <p className="text-xs text-slate-500">Ranking por volume de unidades vendidas</p>
            </div>
            <button 
              onClick={() => setActiveTab('relatorios')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver Relatório Completo
            </button>
          </div>
          <div className="space-y-3">
            {topProductsData.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Nenhum produto vendido no período.</p>
            ) : (
              topProductsData.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0f2b5c] font-normal text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800">{prod.name}</p>
                      <p className="text-[11px] text-slate-500">{prod.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <span className="font-normal text-[#0f2b5c] text-xs sm:text-sm">
                    R$ {prod.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Vendas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Últimas Vendas Realizadas</h2>
              <p className="text-xs text-slate-500">Transações recentes no PDV</p>
            </div>
            <button 
              onClick={() => setActiveTab('vendas')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver Todas
            </button>
          </div>
          <div className="space-y-2.5">
            {sales.slice(0, 5).map((sale) => (
              <div 
                key={sale.id} 
                onClick={() => onOpenSaleDetail(sale.id)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                    sale.status === 'cancelada' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {sale.status === 'cancelada' ? 'CAN' : 'OK'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-normal text-xs text-slate-900">{sale.code}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate max-w-[200px] sm:max-w-[260px]">
                      {sale.clientName} • {sale.items.length} item(ns)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-normal text-xs sm:text-sm text-[#0f2b5c]">
                    R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                    Ver Recibo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
