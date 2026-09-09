import React, { useState } from 'react';
import { 
  ArrowUpRight, Plus, Smartphone, FileText, AlertTriangle, 
  Check, Hash, User as UserIcon 
} from 'lucide-react';
import { Product, IMEIItem, User, ExitReason } from '../types';

interface ExitsViewProps {
  products: Product[];
  imeis: IMEIItem[];
  currentUser: User;
  onRegisterExit: (exitData: {
    productId: string;
    quantity: number;
    reason: ExitReason;
    imei?: string;
    responsible: string;
    notes?: string;
  }) => void;
}

export const ExitsView: React.FC<ExitsViewProps> = ({
  products,
  imeis,
  currentUser,
  onRegisterExit,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<ExitReason>('Produto danificado');
  const [selectedImei, setSelectedImei] = useState('');
  const [responsible, setResponsible] = useState(currentUser.name);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);
  const availableImeis = imeis.filter((i) => i.productId === productId && i.status === 'disponivel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedProduct) {
      setFeedback({ type: 'error', message: 'Selecione um produto.' });
      return;
    }

    if (selectedProduct.currentStock <= 0) {
      setFeedback({ type: 'error', message: 'Este produto já está com estoque zerado.' });
      return;
    }

    if (selectedProduct.hasImei && !selectedImei) {
      setFeedback({ type: 'error', message: 'Para este aparelho celular, é obrigatório selecionar o IMEI a ser baixado.' });
      return;
    }

    try {
      onRegisterExit({
        productId,
        quantity: selectedProduct.hasImei ? 1 : quantity,
        reason,
        imei: selectedProduct.hasImei ? selectedImei : undefined,
        responsible: responsible.trim() || currentUser.name,
        notes,
      });

      setFeedback({ type: 'success', message: 'Baixa de estoque e saída registradas com sucesso!' });
      setIsFormOpen(false);
      setSelectedImei('');
      setNotes('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao registrar saída.' });
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowUpRight className="w-6 h-6 text-rose-600" />
            Saídas de Estoque & Baixas Manuais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Registros de perdas, produtos danificados, devoluções a fornecedores, brindes e ajustes de inventário.
          </p>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setFeedback(null);
          }}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Fechar Formulário' : 'Registrar Nova Saída'}</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 animate-in fade-in">
          <h2 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            Lançamento de Baixa de Estoque
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Produto *</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    setSelectedImei('');
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.model} ({p.currentStock} un em estoque)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo da Saída *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ExitReason)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Produto danificado">Produto danificado / Defeito</option>
                  <option value="Devolução a fornecedor">Devolução a fornecedor</option>
                  <option value="Troca">Troca em garantia</option>
                  <option value="Perda">Perda / Furto / Extravio</option>
                  <option value="Uso interno">Uso interno da loja</option>
                  <option value="Ajuste de estoque">Ajuste de inventário</option>
                  <option value="Brinde / Cortesia">Brinde / Cortesia</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Responsável pela Baixa *</label>
                <input
                  type="text"
                  required
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            {/* IMEI Selection if applicable */}
            {selectedProduct?.hasImei ? (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <label className="font-bold text-purple-950 block">Selecione o IMEI a ser baixado *</label>
                {availableImeis.length === 0 ? (
                  <p className="text-rose-600 font-semibold">Nenhum aparelho com IMEI disponível para dar baixa.</p>
                ) : (
                  <select
                    value={selectedImei}
                    onChange={(e) => setSelectedImei(e.target.value)}
                    className="w-full p-2.5 bg-white border border-purple-300 rounded-xl font-mono font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="">Selecione o IMEI...</option>
                    {availableImeis.map((im) => (
                      <option key={im.id} value={im.imei}>
                        {im.imei} ({im.condition} - {im.color})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantidade a retirar</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.currentStock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-40 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Observações detalhadas / Laudo</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva o motivo da avaria, número da RMA ou protocolo de assistência..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Confirmar Saída de Estoque
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exits guidance card */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800">Diretrizes de Rastreabilidade:</p>
        <p>• Toda baixa de estoque gera registro em log de auditoria permanente.</p>
        <p>• Se o produto possui IMEI, seu status é automaticamente atualizado para <strong>Danificado</strong> ou <strong>Devolvido</strong>, impedindo qualquer venda futura acidental.</p>
      </div>
    </div>
  );
};
