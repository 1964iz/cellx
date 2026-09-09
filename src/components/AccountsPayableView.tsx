import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Plus, Search, Calendar, Filter, CheckCircle2, 
  AlertTriangle, DollarSign, Building 
} from 'lucide-react';
import { AccountPayable, Supplier, PaymentMethod } from '../types';

interface AccountsPayableViewProps {
  payables: AccountPayable[];
  suppliers: Supplier[];
  onRegisterPayable: (data: {
    description: string;
    supplierId?: string;
    category: string;
    amount: number;
    dueDate: string;
    notes?: string;
  }) => void;
  onPayPayable: (id: string, method: PaymentMethod) => void;
}

export const AccountsPayableView: React.FC<AccountsPayableViewProps> = ({
  payables,
  suppliers,
  onRegisterPayable,
  onPayPayable,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [category, setCategory] = useState('Fornecedores');
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  // Payment confirmation state
  const [payingAccount, setPayingAccount] = useState<AccountPayable | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    onRegisterPayable({
      description: description.trim(),
      supplierId: supplierId || undefined,
      category,
      amount,
      dueDate,
      notes,
    });

    setIsModalOpen(false);
    setDescription('');
    setAmount(0);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingAccount) return;
    onPayPayable(payingAccount.id, paymentMethod);
    setPayingAccount(null);
  };

  const filtered = useMemo(() => {
    return payables.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        p.description.toLowerCase().includes(q) ||
        (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payables, searchTerm, statusFilter]);

  const totalPending = payables.filter((p) => p.status !== 'Pago').reduce((acc, p) => acc + p.balance, 0);
  const totalOverdue = payables.filter((p) => p.status === 'Vencido').reduce((acc, p) => acc + p.balance, 0);
  const totalPaid = payables.filter((p) => p.status === 'Pago').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-rose-600" />
            Contas a Pagar & Despesas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Gerenciamento de pagamentos a fornecedores de aparelhos, aluguel, energia e despesas operacionais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conta a Pagar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total a Pagar</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Compromissos pendentes</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Contas Vencidas</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-rose-600 mt-0.5">Atrasadas que geram juros</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Pago</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Despesas já quitadas</p>
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
            placeholder="Pesquisar descrição, fornecedor ou categoria..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
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
          <option value="Pago">Pago</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Descrição da Despesa</th>
                <th className="py-3 px-4">Fornecedor / Favorecido</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-right">Saldo</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.description}</p>
                    {item.notes && <p className="text-[10px] text-slate-400">{item.notes}</p>}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {item.supplierName || 'Geral'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                    {item.paymentDate && (
                      <p className="text-[10px] text-emerald-600">Pago em {new Date(item.paymentDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-700 font-bold">
                    R$ {item.amount.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    R$ {item.balance.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                      item.status === 'Pago' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.status === 'Vencido' 
                          ? 'bg-rose-100 text-rose-800 animate-pulse' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {item.status !== 'Pago' && (
                      <button
                        onClick={() => setPayingAccount(item)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Account Payable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Lançamento de Conta a Pagar
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição da Conta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel da Loja, Conta de Luz, Compra de Celulares"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer"
                  >
                    <option value="Fornecedores">Fornecedores</option>
                    <option value="Aluguel">Aluguel do Ponto</option>
                    <option value="Energia / Água">Energia / Água</option>
                    <option value="Internet / Telefonia">Internet / Telefonia</option>
                    <option value="Salários / Comissões">Salários / Comissões</option>
                    <option value="Impostos">Impostos / Tarifas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fornecedor</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
                  >
                    <option value="">Nenhum (Despesa interna)</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data de Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Código de barras do boleto, etc."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Cadastrar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payingAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Liquidar Conta a Pagar
            </h3>
            <p className="text-slate-500 mb-3">
              {payingAccount.description} - Valor: <strong className="text-slate-900">R$ {payingAccount.balance.toFixed(2)}</strong>
            </p>

            <form onSubmit={handleConfirmPay} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Forma de Pagamento Utilizada *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência Bancária</option>
                  <option value="Dinheiro">Dinheiro (Saída do Caixa)</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingAccount(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
