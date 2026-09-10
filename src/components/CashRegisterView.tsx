import React, { useState } from 'react';
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Lock, Unlock, 
  DollarSign, Clock, User as UserIcon, AlertTriangle, Check, ShieldCheck 
} from 'lucide-react';
import { CashRegister, CashMovement, User } from '../types';

interface CashRegisterViewProps {
  cashRegister?: CashRegister;
  currentUser: User;
  onOpenRegister: (initialBalance: number) => void;
  onCloseRegister: (actualCash: number, notes?: string) => void;
  onAddCashMovement: (type: 'suprimento' | 'sangria', amount: number, reason: string) => void;
}

export const CashRegisterView: React.FC<CashRegisterViewProps> = ({
  cashRegister,
  currentUser,
  onOpenRegister,
  onCloseRegister,
  onAddCashMovement,
}) => {
  // Opening state
  const [initialAmount, setInitialAmount] = useState<number>(100);

  // Closing state
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  const [actualCashInDrawer, setActualCashInDrawer] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState('');

  // Movement state (Sangria / Suprimento)
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'suprimento' | 'sangria'>('sangria');
  const [movementAmount, setMovementAmount] = useState<number>(0);
  const [movementReason, setMovementReason] = useState('');

  const isOpen = cashRegister?.status === 'aberto';

  const handleOpenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenRegister(initialAmount);
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCloseRegister(actualCashInDrawer, closingNotes);
    setIsClosingModalOpen(false);
  };

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movementAmount <= 0 || !movementReason.trim()) return;

    onAddCashMovement(movementType, movementAmount, movementReason.trim());
    setIsMovementModalOpen(false);
    setMovementAmount(0);
    setMovementReason('');
  };

  const expectedCashInDrawer = (cashRegister?.initialBalance || 0) + (cashRegister?.totalCash || 0) - (cashRegister?.totalWithdrawals || 0) + (cashRegister?.totalSupplies || 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-blue-600" />
            Controle de Caixa da Loja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Abertura, conferência de gaveta, sangrias, suprimentos de troco e fechamento com auditoria.
          </p>
        </div>

        {isOpen ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMovementType('sangria');
                setIsMovementModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
              <span>Sangria / Retirada</span>
            </button>
            <button
              onClick={() => {
                setMovementType('suprimento');
                setIsMovementModalOpen(true);
              }}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4 text-blue-600" />
              <span>Suprimento / Troco</span>
            </button>
            <button
              onClick={() => {
                setActualCashInDrawer(expectedCashInDrawer);
                setIsClosingModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Fechar Caixa</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Caixa Fechado State */}
      {!isOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">O Caixa Está Fechado</h2>
            <p className="text-xs text-slate-500 mt-1">
              Informe o valor em dinheiro do troco inicial de gaveta para abrir o expediente.
            </p>
          </div>

          <form onSubmit={handleOpenSubmit} className="space-y-3 pt-2 text-xs text-left">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Troco Inicial na Gaveta (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={initialAmount}
                onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Abrir Caixa do Dia</span>
            </button>
          </form>
        </div>
      )}

      {/* Caixa Aberto Dashboard */}
      {isOpen && cashRegister && (
        <div className="space-y-5">
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Caixa em Operação</p>
                <p className="text-sm text-emerald-100 font-medium">
                  Aberto por <strong className="text-white">{cashRegister.openedByName}</strong> às {new Date(cashRegister.openedAt).toLocaleTimeString('pt-BR')} ({new Date(cashRegister.openedAt).toLocaleDateString('pt-BR')})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-300">Fundo Inicial:</span>
              <p className="font-mono font-bold text-base text-white">
                R$ {cashRegister.initialBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total em Dinheiro</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {expectedCashInDrawer.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Saldo físico esperado na gaveta</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total em PIX</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {cashRegister.totalPix.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Entradas direto em conta</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cartão de Crédito</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {cashRegister.totalCreditCard.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Operações na maquininha</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cartão de Débito</span>
              <p className="text-xl sm:text-2xl font-light text-[#0f2b5c] mt-1">
                R$ {cashRegister.totalDebitCard.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Débito na maquininha</p>
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Movimentações deste Caixa</span>
              <span className="text-xs text-slate-500 font-semibold">{cashRegister.movements.length} transações</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Hora</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Descrição / Referência</th>
                    <th className="py-3 px-4">Operador</th>
                    <th className="py-3 px-4 text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashRegister.movements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(mov.date).toLocaleTimeString('pt-BR')}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          mov.type === 'venda' || mov.type === 'suprimento'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {mov.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {mov.description}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {mov.userName}
                      </td>

                      <td className={`py-3 px-4 text-right font-extrabold text-xs sm:text-sm ${
                        mov.type === 'sangria' ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {mov.type === 'sangria' ? '-' : '+'} R$ {mov.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sangria / Suprimento Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-2 flex items-center gap-2">
              {movementType === 'sangria' ? (
                <>
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  Registrar Sangria (Retirada de Dinheiro)
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-5 h-5 text-blue-600" />
                  Registrar Suprimento (Aporte de Troco)
                </>
              )}
            </h3>
            <p className="text-slate-500 mb-3">
              {movementType === 'sangria'
                ? 'Retirada de numerário da gaveta para cofre ou depósito bancário.'
                : 'Entrada de troco avulso para reforçar a gaveta.'}
            </p>

            <form onSubmit={handleMovementSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Valor da Operação (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  max={movementType === 'sangria' ? expectedCashInDrawer : undefined}
                  value={movementAmount || ''}
                  onChange={(e) => setMovementAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-base"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo / Destino *</label>
                <input
                  type="text"
                  required
                  placeholder={movementType === 'sangria' ? 'Ex: Depósito bancário Bradesco' : 'Ex: Troco em moedas'}
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-bold rounded-xl cursor-pointer ${
                    movementType === 'sangria' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirmar {movementType === 'sangria' ? 'Sangria' : 'Suprimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fechamento de Caixa Modal */}
      {isClosingModalOpen && cashRegister && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-600" />
              Fechamento de Caixa e Conferência de Gaveta
            </h3>
            <p className="text-slate-500 mb-4">
              Realize a contagem das cédulas e informe o valor físico apurado.
            </p>

            <form onSubmit={handleCloseSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Dinheiro Esperado pelo Sistema:</span>
                  <span className="font-extrabold text-slate-900">R$ {expectedCashInDrawer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Total PIX Recebido:</span>
                  <span>R$ {cashRegister.totalPix.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Total Cartões (Crédito/Débito):</span>
                  <span>R$ {(cashRegister.totalCreditCard + cashRegister.totalDebitCard).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Valor Contado Fisicamente na Gaveta (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={actualCashInDrawer}
                  onChange={(e) => setActualCashInDrawer(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-lg"
                />
              </div>

              {/* Diferença alert */}
              {actualCashInDrawer !== expectedCashInDrawer && (
                <div className={`p-3 rounded-xl border font-bold flex items-center justify-between ${
                  actualCashInDrawer > expectedCashInDrawer
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <span>{actualCashInDrawer > expectedCashInDrawer ? 'Sobra de Caixa:' : 'Falta de Caixa (Quebra):'}</span>
                  <span>R$ {Math.abs(actualCashInDrawer - expectedCashInDrawer).toFixed(2)}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações do Fechamento</label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Justificativa de eventuais sobras ou quebras..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClosingModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirmar e Fechar Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
