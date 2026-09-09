import React, { useState } from 'react';
import { 
  Printer, Share2, MessageSquare, Check, X, 
  Smartphone, FileText, Download, ShieldCheck
} from 'lucide-react';
import { Sale, StoreSettings } from '../types';

interface ReceiptModalProps {
  sale: Sale | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, settings, onClose }) => {
  const [paperFormat, setPaperFormat] = useState<'thermal' | 'a4'>('thermal');
  const [copied, setCopied] = useState(false);

  if (!sale) return null;

  const formattedDate = new Date(sale.date).toLocaleString('pt-BR');

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppText = () => {
    let msg = `*${settings.tradingName || settings.storeName}*\n`;
    msg += `📄 *RECIBO DE VENDA:* ${sale.code}\n`;
    msg += `📅 *Data:* ${formattedDate}\n`;
    msg += `👤 *Cliente:* ${sale.clientName} (CPF: ${sale.clientCpf})\n`;
    msg += `----------------------------------------\n`;
    msg += `*ITENS:* \n`;
    sale.items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}*\n`;
      if (item.imei) msg += `   IMEI: ${item.imei}\n`;
      msg += `   Qtd: ${item.quantity} x R$ ${item.unitPrice.toFixed(2)} = R$ ${item.total.toFixed(2)}\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `*Subtotal:* R$ ${sale.subtotal.toFixed(2)}\n`;
    if (sale.discount > 0) msg += `*Desconto:* -R$ ${sale.discount.toFixed(2)}\n`;
    msg += `*TOTAL:* R$ ${sale.total.toFixed(2)}\n\n`;
    msg += `*PAGAMENTO:*\n`;
    sale.payments.forEach((p) => {
      msg += `• ${p.method}: R$ ${p.amount.toFixed(2)} ${p.installmentsCount ? `(${p.installmentsCount}x)` : ''}\n`;
    });
    msg += `\n*TERMO DE GARANTIA (${sale.warrantyDays} DIAS):*\n`;
    msg += `${settings.warrantyTerms}\n\n`;
    msg += `*Endereço:* ${settings.address}, ${settings.number} - ${settings.city}/${settings.state}\n`;
    msg += `*Contato:* ${settings.whatsapp}\n`;

    return encodeURIComponent(msg);
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = sale.clientPhone ? sale.clientPhone.replace(/\D/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? `phone=55${cleanPhone}&` : '';
    const url = `https://api.whatsapp.com/send?${phoneParam}text=${generateWhatsAppText()}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = decodeURIComponent(generateWhatsAppText());
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Header (no-print) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recibo da Venda #{sale.code}
            </span>
            <div className="hidden sm:flex items-center gap-1 ml-4 bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPaperFormat('thermal')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperFormat === 'thermal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cupom Térmico (80mm)
              </button>
              <button
                onClick={() => setPaperFormat('a4')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperFormat === 'a4' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Folha A4
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="btn-print-receipt"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              title="Enviar no WhatsApp do Cliente"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handleCopyText}
              title="Copiar texto do recibo"
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div className={`
            bg-white shadow-md border border-slate-200 text-slate-900 text-xs p-5 sm:p-7
            ${paperFormat === 'thermal' ? 'w-full max-w-[380px] font-mono leading-relaxed' : 'w-full max-w-[650px] font-sans leading-normal'}
          `}>
            {/* Store Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight uppercase">
                {settings.storeName}
              </h2>
              <p className="text-[11px] font-semibold text-slate-600">{settings.tradingName}</p>
              <p className="text-[11px] text-slate-500">CNPJ: {settings.cnpj}</p>
              <p className="text-[11px] text-slate-500">
                {settings.address}, {settings.number} {settings.complement && `• ${settings.complement}`}
              </p>
              <p className="text-[11px] text-slate-500">
                {settings.neighborhood} - {settings.city}/{settings.state} • CEP: {settings.cep}
              </p>
              <p className="text-[11px] font-medium text-slate-700 mt-1">
                WhatsApp: {settings.whatsapp} • Tel: {settings.phone}
              </p>
            </div>

            {/* Sale & Client Meta */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-slate-800">
                <span>RECIBO Nº: {sale.code}</span>
                <span>DATA: {formattedDate}</span>
              </div>
              <div className="pt-1">
                <p><span className="font-semibold">CLIENTE:</span> {sale.clientName}</p>
                <p><span className="font-semibold">CPF/CNPJ:</span> {sale.clientCpf}</p>
                {sale.clientPhone && <p><span className="font-semibold">TELEFONE:</span> {sale.clientPhone}</p>}
                <p><span className="font-semibold">VENDEDOR:</span> {sale.sellerName}</p>
              </div>
            </div>

            {/* Product Items Table */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="font-bold uppercase text-[11px] mb-2 text-slate-700">Itens Comprados</div>
              <div className="space-y-2.5">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{item.quantity}x {item.productName}</span>
                      <span>R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {item.imei && (
                      <div className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded-sm mt-0.5 w-fit">
                        IMEI: {item.imei}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                      <span>Unitário: R$ {item.unitPrice.toFixed(2)}</span>
                      {item.discount > 0 && <span className="text-emerald-600">Desc: -R$ {item.discount.toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Discounts */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>R$ {sale.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto Concedido:</span>
                  <span>- R$ {sale.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm sm:text-base text-slate-950 pt-1 border-t border-slate-200">
                <span>VALOR TOTAL:</span>
                <span>R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payments Breakdown */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="font-bold uppercase text-[11px] mb-1.5 text-slate-700">Formas de Pagamento</div>
              <div className="space-y-1 text-[11px]">
                {sale.payments.map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-slate-700">
                      • {p.method} {p.installmentsCount ? `(${p.installmentsCount}x)` : ''}
                    </span>
                    <span className="font-semibold text-slate-900">
                      R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Installments Schedule if any */}
              {sale.installments && sale.installments.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <span className="font-bold text-[10px] text-slate-600 uppercase">Cronograma de Parcelas:</span>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-[10px]">
                    {sale.installments.map((inst, idx) => (
                      <div key={idx} className="bg-slate-50 p-1 rounded border border-slate-200/60 flex justify-between">
                        <span>{inst.installmentNumber}ª ({new Date(inst.dueDate).toLocaleDateString('pt-BR')}):</span>
                        <span className="font-semibold">R$ {inst.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Warranty Terms & Legal */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] mb-1 text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Termo de Garantia ({sale.warrantyDays} Dias)
              </div>
              <p className="text-[10px] text-slate-600 text-justify leading-relaxed">
                {settings.warrantyTerms}
              </p>
            </div>

            {/* Notes if any */}
            {sale.notes && (
              <div className="py-2 text-[10px] text-slate-600 border-b border-dashed border-slate-300">
                <span className="font-semibold">Obs:</span> {sale.notes}
              </div>
            )}

            {/* Signatures Section */}
            <div className="pt-6 pb-2 grid grid-cols-2 gap-4 text-center text-[10px]">
              <div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Assinatura do Vendedor
                </div>
                <p className="text-slate-400 text-[9px]">{sale.sellerName}</p>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Assinatura do Cliente
                </div>
                <p className="text-slate-400 text-[9px]">{sale.clientName}</p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-3 text-[10px] text-slate-400">
              <p>{settings.receiptFooter}</p>
              <p className="text-[9px] mt-1 font-mono">CellStore PRO • Sistema Especializado de Gestão de Celulares</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
