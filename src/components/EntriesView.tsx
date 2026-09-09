import React, { useState } from 'react';
import { 
  ArrowDownRight, Plus, Truck as SupplierIcon, Smartphone, 
  FileText, Calendar, DollarSign, Check, AlertCircle, Layers, Hash
} from 'lucide-react';
import { Product, Supplier, StockEntry, PaymentMethod, User } from '../types';

interface EntriesViewProps {
  products: Product[];
  suppliers: Supplier[];
  entries: StockEntry[];
  currentUser: User;
  onRegisterEntry: (entryData: {
    invoiceNumber: string;
    supplierId: string;
    productId: string;
    quantity: number;
    costPrice: number;
    sellPrice: number;
    paymentMethod: PaymentMethod;
    installmentsCount?: number;
    notes?: string;
    imeisList?: string[];
  }) => void;
}

export const EntriesView: React.FC<EntriesViewProps> = ({
  products,
  suppliers,
  entries,
  currentUser,
  onRegisterEntry,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [imeisBatchText, setImeisBatchText] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);

  const handleProductChange = (prodId: string) => {
    setProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setCostPrice(prod.costPrice);
      setSellPrice(prod.sellPrice);
    }
  };

  const parsedImeis = imeisBatchText
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedProduct) {
      setFeedback({ type: 'error', message: 'Selecione um produto.' });
      return;
    }

    if (selectedProduct.hasImei) {
      if (parsedImeis.length === 0) {
        setFeedback({ type: 'error', message: 'Para este aparelho celular, informe ao menos 1 IMEI.' });
        return;
      }
      if (parsedImeis.length !== quantity) {
        setFeedback({ 
          type: 'error', 
          message: `A quantidade informada (${quantity}) não coincide com a lista de IMEIs digitados (${parsedImeis.length}). Ajuste a quantidade ou a lista.` 
        });
        return;
      }
    }

    try {
      onRegisterEntry({
        invoiceNumber: invoiceNumber.trim() || `NF-${Date.now().toString().slice(-6)}`,
        supplierId,
        productId,
        quantity: selectedProduct.hasImei ? parsedImeis.length : Number(quantity),
        costPrice: Number(costPrice),
        sellPrice: Number(sellPrice),
        paymentMethod,
        installmentsCount: paymentMethod === 'Boleto' || paymentMethod === 'Fiado / Crediário' ? installmentsCount : undefined,
        notes,
        imeisList: selectedProduct.hasImei ? parsedImeis : undefined,
      });

      setFeedback({ type: 'success', message: 'Entrada de estoque e lançamento financeiro registrados com sucesso!' });
      setIsFormOpen(false);
      setInvoiceNumber('');
      setImeisBatchText('');
      setNotes('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao registrar entrada.' });
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowDownRight className="w-6 h-6 text-blue-600" />
            Entradas de Produtos & Notas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Registro de compras de fornecedores, entrada de lotes e cadastro de múltiplos IMEIs.
          </p>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setFeedback(null);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Fechar Formulário' : 'Nova Entrada de Estoque'}</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* New Entry Form Accordion */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 animate-in fade-in">
          <h2 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Lançamento de Entrada de Mercadorias
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nota Fiscal / Documento</label>
                <input
                  type="text"
                  placeholder="Ex: NF-10948 ou Compra 12/03"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fornecedor *</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.cnpj})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Produto *</label>
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.model} - {p.brandName} ({p.hasImei ? 'IMEI' : 'Geral'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Custo Unitário (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Custo Total da Entrada</label>
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-extrabold text-slate-900">
                  R$ {(costPrice * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Novo Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellPrice || ''}
                  onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-blue-600"
                />
              </div>
            </div>

            {/* Multiple IMEI Input if Product Has IMEI */}
            {selectedProduct?.hasImei && (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Hash className="w-4 h-4" /> Cadastro de IMEIs em Lote ({parsedImeis.length} de {quantity} informados)
                  </span>
                  <span className="text-[11px] text-purple-700 font-mono">
                    Cole lista de IMEIs separados por linha ou vírgula
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={imeisBatchText}
                  onChange={(e) => setImeisBatchText(e.target.value)}
                  placeholder="358901234567890&#10;358901234567891&#10;358901234567892"
                  className="w-full p-2.5 bg-white border border-purple-300 rounded-xl font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                {parsedImeis.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedImeis.map((im, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-mono text-[10px] font-bold">
                        {im}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Financial Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Forma de Pagamento ao Fornecedor</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 cursor-pointer"
                >
                  <option value="PIX">PIX (À Vista)</option>
                  <option value="Transferência">Transferência Bancária</option>
                  <option value="Boleto">Boleto a Prazo</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Fiado / Crediário">A Prazo / Parcelado</option>
                </select>
              </div>

              {(paymentMethod === 'Boleto' || paymentMethod === 'Fiado / Crediário') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Número de Parcelas</label>
                  <select
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(parseInt(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}x</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={paymentMethod === 'Boleto' || paymentMethod === 'Fiado / Crediário' ? '' : 'sm:col-span-2'}>
                <label className="font-bold text-slate-700 block mb-1">Observações da Compra</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Lote com nota fiscal de garantia estendida de fábrica"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
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
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Registrar Entrada de Estoque
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-slate-800 text-sm">Histórico de Entradas Registradas</span>
          <span className="text-xs text-slate-500 font-semibold">{entries.length} compras registradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Data / Doc</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4 text-center">Quantidade</th>
                <th className="py-3 px-4 text-right">Custo Unitário</th>
                <th className="py-3 px-4 text-right">Total da Nota</th>
                <th className="py-3 px-4 text-center">Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{entry.invoiceNumber}</p>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {entry.supplierName}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{entry.productName}</p>
                    {entry.imeis && entry.imeis.length > 0 && (
                      <p className="text-[10px] text-purple-600 font-mono">
                        {entry.imeis.length} IMEI(s) vinculado(s)
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                      {entry.quantity} un
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right text-slate-600">
                    R$ {entry.costPrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-xs sm:text-sm">
                    R$ {entry.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {entry.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
