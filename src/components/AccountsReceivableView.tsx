import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Search, Calendar, Filter, CheckCircle2, 
  AlertCircle, Clock, Check, CreditCard 
} from 'lucide-react';
import { AccountReceivable, PaymentMethod } from '../types';

interface AccountsReceivableViewProps {
  receivables: AccountReceivable[];
  onRegisterPayment: (id: string, amountPaid: number, method: PaymentMethod) => void;
}

export const AccountsReceivableView: React.FC<AccountsReceivableViewProps> = ({
  receivables,
  onRegisterPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedReceivable, setSelectedReceivable] = useState<AccountReceivable | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('PIX');

  const openPayModal = (rec: AccountReceivable) => {
    setSelectedReceivable(rec);
    setPayAmount(rec.balance);
    setPayMethod('PIX');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivable || payAmount <= 0) return;

    onRegisterPayment(selectedReceivable.id, payAmount, payMethod);
    setSelectedReceivable(null);
  };

  const filtered = useMemo(() => {
    return receivables.filter((r) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        r.clientName.toLowerCase().includes(q) ||
        r.clientCpf.includes(q) ||
        r.saleCode.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'Todos' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [receivables, searchTerm, statusFilter]);

  const totalPending = receivables.filter((r) => r.status !== 'Pago').reduce((acc, r) => acc + r.balance, 0);
  const totalOverdue = receivables.filter((r) => r.status === 'Vencido').reduce((acc, r) => acc + r.balance, 0);
  const totalReceived = receivables.reduce((acc, r) => acc + r.amountPaid, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Contas a Receber & Carnês
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Acompanhamento de parcelas de fiado, crediário de clientes, boletos e recebimentos parciais.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total a Receber</span>
          <p className="text-2xl sm:text-3xl font-light text-[#0f2b5c] mt-1">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Saldo devedor em carteira</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Parcelas Vencidas</span>
          <p className="text-2xl sm:text-3xl font-light text-rose-600 mt-1">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-rose-600 mt-0.5">Cobranças com prazo expirado</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Já Liquidado</span>
          <p className="text-2xl sm:text-3xl font-light text-[#0f2b5c] mt-1">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Recebido e integrado ao caixa</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, CPF ou código da venda..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Vencido">Vencido</option>
          <option value="Parcial">Parcial</option>
          <option value="Pago">Pago</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Venda / Parcela</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4 text-right">Valor Parcela</th>
                <th className="py-3 px-4 text-right">Valor Pago</th>
                <th className="py-3 px-4 text-right">Saldo Devedor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Nenhum título a receber encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">{r.saleCode}</span>
                      <p className="text-[10px] text-slate-400">Parcela {r.installmentNumber} de {r.totalInstallments}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{r.clientName}</p>
                      <p className="text-[10px] text-slate-400">CPF: {r.clientCpf}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{new Date(r.dueDate).toLocaleDateString('pt-BR')}</p>
                      {r.paymentDate && (
                        <p className="text-[10px] text-emerald-600">
                          Liquidado em {new Date(r.paymentDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      R$ {r.amount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                      R$ {r.amountPaid.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      R$ {r.balance.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        r.status === 'Pago' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : r.status === 'Vencido' 
                            ? 'bg-rose-100 text-rose-800 animate-pulse' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {r.status !== 'Pago' && (
                        <button
                          onClick={() => openPayModal(r)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Receber
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

      {/* Pay Modal */}
      {selectedReceivable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Baixa de Parcela / Recebimento
            </h3>
            <p className="text-slate-500 mb-4">
              Cliente: <strong>{selectedReceivable.clientName}</strong> (Venda {selectedReceivable.saleCode})
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Valor Original:</span>
                  <span>R$ {selectedReceivable.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Saldo Pendente:</span>
                  <span className="text-rose-600">R$ {selectedReceivable.balance.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Valor a Receber Agora (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedReceivable.balance}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-base"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Forma de Recebimento *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="PIX">PIX</option>
                  <option value="Dinheiro">Dinheiro em Espécie</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência">Transferência Bancária</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceivable(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirmar Recebimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
