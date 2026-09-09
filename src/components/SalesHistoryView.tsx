import React, { useState, useMemo } from 'react';
import { 
  History, Search, Receipt, Calendar, User as UserIcon, 
  Eye, XCircle, Printer, MessageSquare, AlertTriangle, Check
} from 'lucide-react';
import { Sale, User } from '../types';

interface SalesHistoryViewProps {
  sales: Sale[];
  currentUser: User;
  onOpenReceipt: (sale: Sale) => void;
  onCancelSale: (saleId: string) => void;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({
  sales,
  currentUser,
  onOpenReceipt,
  onCancelSale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [paymentFilter, setPaymentFilter] = useState('Todos');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        s.code.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.clientCpf.includes(q) ||
        s.items.some((it) => it.imei && it.imei.includes(q)) ||
        s.items.some((it) => it.productName.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'Todos' || s.status === statusFilter;
      const matchesPayment = paymentFilter === 'Todos' || s.payments.some((p) => p.method === paymentFilter);

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [sales, searchTerm, statusFilter, paymentFilter]);

  const handleCancelClick = (sale: Sale) => {
    if (sale.status === 'cancelada') return;
    const confirm = window.confirm(
      `ATENÇÃO: Deseja realmente cancelar a venda ${sale.code}?\n\n` +
      `Isso irá:\n` +
      `• Estornar todas as peças e celulares de volta ao estoque\n` +
      `• Liberar os IMEIs vendidos como 'disponível'\n` +
      `• Cancelar as parcelas de contas a receber\n` +
      `• Estornar o saldo no caixa atual`
    );

    if (confirm) {
      onCancelSale(sale.id);
      setSelectedSaleDetail(null);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600" />
            Histórico Geral de Vendas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Consulta de transações, 2ª via de comprovantes, termos de garantia e estorno de vendas.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ex: VEN-001), cliente, produto ou IMEI..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
        >
          <option value="Todos">Todos os Status</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
        >
          <option value="Todos">Todas as Formas de Pagamento</option>
          <option value="PIX">PIX</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Fiado / Crediário">Fiado / Crediário</option>
          <option value="Boleto">Boleto</option>
        </select>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Data</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Itens / IMEIs</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4 text-right">Total (R$)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Nenhuma venda encontrada com os filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {sale.code}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{sale.clientName}</p>
                      <p className="text-[10px] text-slate-400">CPF: {sale.clientCpf}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 truncate max-w-[200px]">
                        {sale.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                      </p>
                      {sale.items.some((it) => it.imei) && (
                        <div className="flex gap-1 mt-0.5">
                          {sale.items.filter((it) => it.imei).map((it, idx) => (
                            <span key={idx} className="text-[9px] bg-purple-100 text-purple-800 font-mono px-1 rounded">
                              {it.imei}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {sale.sellerName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {sale.payments.map((p, idx) => (
                          <span key={idx} className="inline-block text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium mr-1">
                            {p.method}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-xs sm:text-sm">
                      R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        sale.status === 'concluida' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSaleDetail(sale)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Ver Detalhes da Venda"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenReceipt(sale)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Imprimir Recibo"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {sale.status === 'concluida' && (
                        <button
                          onClick={() => handleCancelClick(sale)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancelar Venda e Estornar Estoque"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhes da Venda */}
      {selectedSaleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Detalhes da Venda #{selectedSaleDetail.code}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Realizada em {new Date(selectedSaleDetail.date).toLocaleString('pt-BR')} por {selectedSaleDetail.sellerName}
                </p>
              </div>
              <button onClick={() => setSelectedSaleDetail(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            {/* Cliente */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-700 uppercase text-[10px] block mb-1">Dados do Comprador</span>
              <p className="font-bold text-slate-900 text-sm">{selectedSaleDetail.clientName}</p>
              <p className="text-slate-500">CPF: {selectedSaleDetail.clientCpf} • Telefone: {selectedSaleDetail.clientPhone || 'Não informado'}</p>
            </div>

            {/* Itens */}
            <div>
              <span className="font-bold text-slate-700 uppercase text-[10px] block mb-2">Produtos da Venda</span>
              <div className="space-y-2">
                {selectedSaleDetail.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      {item.imei && (
                        <p className="text-purple-700 font-mono font-bold text-[11px]">IMEI: {item.imei}</p>
                      )}
                      <p className="text-slate-500 text-[11px]">{item.quantity} un x R$ {item.unitPrice.toFixed(2)}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      R$ {item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totalizadores */}
            <div className="p-3 bg-slate-100 rounded-xl space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {selectedSaleDetail.subtotal.toFixed(2)}</span>
              </div>
              {selectedSaleDetail.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto:</span>
                  <span>- R$ {selectedSaleDetail.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Total:</span>
                <span>R$ {selectedSaleDetail.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Formas de Pagamento & Parcelas */}
            <div>
              <span className="font-bold text-slate-700 uppercase text-[10px] block mb-1.5">Pagamento</span>
              <div className="space-y-1">
                {selectedSaleDetail.payments.map((p, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span>{p.method} {p.installmentsCount ? `(${p.installmentsCount}x)` : ''}</span>
                    <span className="font-bold">R$ {p.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <div>
                {selectedSaleDetail.status === 'concluida' && (
                  <button
                    onClick={() => handleCancelClick(selectedSaleDetail)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancelar e Estornar Venda
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSaleDetail(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onOpenReceipt(selectedSaleDetail);
                    setSelectedSaleDetail(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Recibo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
