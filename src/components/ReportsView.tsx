import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Calendar, Download, Printer, TrendingUp, 
  Smartphone, DollarSign, Package, Users, ShieldAlert, ArrowUpRight 
} from 'lucide-react';
import { Sale, Product, IMEIItem, AccountPayable, AccountReceivable } from '../types';

interface ReportsViewProps {
  sales: Sale[];
  products: Product[];
  imeis: IMEIItem[];
  payables: AccountPayable[];
  receivables: AccountReceivable[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  sales,
  products,
  imeis,
  payables,
  receivables,
}) => {
  const [reportTab, setReportTab] = useState<'vendas' | 'dre' | 'estoque' | 'imeis'>('vendas');

  // Vendas KPIs
  const completedSales = sales.filter((s) => s.status === 'concluida');
  const totalRevenue = completedSales.reduce((acc, s) => acc + s.total, 0);
  const totalItemsSold = completedSales.reduce((acc, s) => acc + s.items.reduce((sum, it) => sum + it.quantity, 0), 0);
  const avgTicket = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  // DRE calculations
  // CMV: cost of goods sold
  const totalCMV = completedSales.reduce((acc, s) => {
    return acc + s.items.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.productId);
      return sum + (prod ? prod.costPrice * item.quantity : item.unitPrice * 0.7 * item.quantity);
    }, 0);
  }, 0);

  const grossProfit = totalRevenue - totalCMV;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalOperatingExpenses = payables
    .filter((p) => p.status === 'Pago' && p.category !== 'Fornecedores')
    .reduce((acc, p) => acc + p.amount, 0);

  const netProfit = grossProfit - totalOperatingExpenses;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Stock values
  const totalStockCost = products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);
  const totalStockRetail = products.reduce((acc, p) => acc + (p.sellPrice * p.currentStock), 0);
  const potentialStockProfit = totalStockRetail - totalStockCost;

  // Phones in stock
  const phonesInStock = imeis.filter((i) => i.status === 'disponivel');

  const exportCurrentReportCSV = () => {
    let filename = `relatorio_${reportTab}_${new Date().toISOString().split('T')[0]}.csv`;
    let content = '';

    if (reportTab === 'vendas') {
      content = 'Codigo,Data,Cliente,Vendedor,Itens,Formas,Total\n' +
        completedSales.map((s) => 
          `${s.code},${s.date},"${s.clientName}","${s.sellerName}",${s.items.length},"${s.payments.map(p => p.method).join('+')}",${s.total.toFixed(2)}`
        ).join('\n');
    } else if (reportTab === 'dre') {
      content = `Demonstrativo de Resultado do Exercicio (DRE)\n` +
        `Receita Bruta com Vendas,R$ ${totalRevenue.toFixed(2)}\n` +
        `(-) Custo das Mercadorias Vendidas (CMV),R$ ${totalCMV.toFixed(2)}\n` +
        `(=) Lucro Bruto Operacional,R$ ${grossProfit.toFixed(2)} (${grossMargin.toFixed(1)}%)\n` +
        `(-) Despesas Operacionais e Fixas,R$ ${totalOperatingExpenses.toFixed(2)}\n` +
        `(=) Lucro Liquido do Periodo,R$ ${netProfit.toFixed(2)} (${netMargin.toFixed(1)}%)\n`;
    } else if (reportTab === 'estoque') {
      content = 'Produto,Marca,Categoria,Estoque,Custo Unitario,Preco Venda,Custo Total,Valor Total Venda\n' +
        products.map((p) => 
          `"${p.model}","${p.brandName}","${p.category}",${p.currentStock},${p.costPrice.toFixed(2)},${p.sellPrice.toFixed(2)},${(p.costPrice * p.currentStock).toFixed(2)},${(p.sellPrice * p.currentStock).toFixed(2)}`
        ).join('\n');
    } else {
      content = 'IMEI,Produto,Condicao,Cor,Status,Data Entrada\n' +
        imeis.map((i) => 
          `${i.imei},"${i.productName}",${i.condition},${i.color},${i.status},${i.entryDate}`
        ).join('\n');
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Relatórios Gerenciais & DRE
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Análises estratégicas de lucratividade, CMV, inventário valorizado e movimentação de aparelhos por IMEI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCurrentReportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setReportTab('vendas')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            reportTab === 'vendas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Desempenho de Vendas
        </button>
        <button
          onClick={() => setReportTab('dre')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            reportTab === 'dre'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          DRE & Lucratividade
        </button>
        <button
          onClick={() => setReportTab('estoque')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            reportTab === 'estoque'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Posição de Estoque Valorizado
        </button>
        <button
          onClick={() => setReportTab('imeis')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            reportTab === 'imeis'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Rastreio de Celulares / IMEIs
        </button>
      </div>

      {/* Tab: VENDAS */}
      {reportTab === 'vendas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total Faturado</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total de Vendas</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">{completedSales.length} transações</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Peças Vendidas</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">{totalItemsSold} unidades</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Ticket Médio</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase mb-3">Últimas Vendas Concluídas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Vendedor</th>
                    <th className="py-2.5 px-3 text-right">Itens</th>
                    <th className="py-2.5 px-3 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedSales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.code}</td>
                      <td className="py-2 px-3 text-slate-600">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{s.clientName}</td>
                      <td className="py-2 px-3 text-slate-600">{s.sellerName}</td>
                      <td className="py-2 px-3 text-right">{s.items.length} un</td>
                      <td className="py-2 px-3 text-right font-extrabold text-slate-900">
                        R$ {s.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: DRE */}
      {reportTab === 'dre' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto space-y-4 text-xs">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Demonstrativo do Resultado do Exercício (DRE Simplificado)
              </h3>
              <p className="text-slate-500">Período: Acumulado Atual da Loja</p>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800">(+) RECEITA BRUTA COM VENDAS:</span>
                <span className="font-extrabold text-blue-600">R$ {totalRevenue.toFixed(2)}</span>
              </div>

              <div className="flex justify-between p-2.5 bg-rose-50/50 rounded-xl text-rose-800">
                <span>(-) Custo das Mercadorias Vendidas (CMV):</span>
                <span>- R$ {totalCMV.toFixed(2)}</span>
              </div>

              <div className="flex justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl font-extrabold text-blue-950">
                <span>(=) LUCRO BRUTO OPERACIONAL:</span>
                <span>R$ {grossProfit.toFixed(2)} ({grossMargin.toFixed(1)}%)</span>
              </div>

              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl text-slate-700">
                <span>(-) Despesas Operacionais (Aluguel, Luz, etc):</span>
                <span>- R$ {totalOperatingExpenses.toFixed(2)}</span>
              </div>

              <div className={`flex justify-between p-3.5 rounded-xl border font-black text-base ${
                netProfit >= 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <span>(=) LUCRO LÍQUIDO DO PERÍODO:</span>
                <span>R$ {netProfit.toFixed(2)} ({netMargin.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ESTOQUE */}
      {reportTab === 'estoque' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Patrimônio em Custo</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                R$ {totalStockCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Valor pago a fornecedores</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400">Valor Projetado de Venda</span>
              <p className="text-xl font-extrabold text-blue-600 mt-1">
                R$ {totalStockRetail.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Preço praticado na vitrine</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-emerald-600">Lucro Bruto Projetado</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                R$ {potentialStockProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Margem total do estoque atual</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Produto</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3 text-center">Estoque</th>
                    <th className="py-2.5 px-3 text-right">Custo Unit.</th>
                    <th className="py-2.5 px-3 text-right">Venda Unit.</th>
                    <th className="py-2.5 px-3 text-right">Custo Total</th>
                    <th className="py-2.5 px-3 text-right">Venda Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{p.model}</td>
                      <td className="py-2 px-3 text-slate-600">{p.category}</td>
                      <td className="py-2 px-3 text-center font-bold">{p.currentStock} un</td>
                      <td className="py-2 px-3 text-right text-slate-600">R$ {p.costPrice.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">R$ {p.sellPrice.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-900">
                        R$ {(p.costPrice * p.currentStock).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-extrabold text-blue-600">
                        R$ {(p.sellPrice * p.currentStock).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: IMEIS */}
      {reportTab === 'imeis' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase mb-3">Inventário de Celulares Cadastrados ({imeis.length} aparelhos)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">IMEI</th>
                    <th className="py-2.5 px-3">Modelo</th>
                    <th className="py-2.5 px-3">Condição / Cor</th>
                    <th className="py-2.5 px-3">Data Entrada</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {imeis.map((im) => (
                    <tr key={im.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-purple-900">{im.imei}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{im.productName}</td>
                      <td className="py-2 px-3 text-slate-600">{im.condition} • {im.color}</td>
                      <td className="py-2 px-3 text-slate-500">{new Date(im.entryDate).toLocaleDateString('pt-BR')}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          im.status === 'disponivel'
                            ? 'bg-emerald-100 text-emerald-800'
                            : im.status === 'vendido'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {im.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
