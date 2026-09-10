import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, Calendar, User as UserIcon, 
  Smartphone, Hash, Printer, AlertTriangle, CheckCircle2, Clock 
} from 'lucide-react';
import { Warranty, StoreSettings } from '../types';

interface WarrantiesViewProps {
  warranties: Warranty[];
  settings: StoreSettings;
}

export const WarrantiesView: React.FC<WarrantiesViewProps> = ({ warranties, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedWarrantyCert, setSelectedWarrantyCert] = useState<Warranty | null>(null);

  const filteredWarranties = useMemo(() => {
    return warranties.filter((w) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        w.imei.includes(q) ||
        w.clientName.toLowerCase().includes(q) ||
        w.clientCpf.includes(q) ||
        w.productName.toLowerCase().includes(q) ||
        w.saleCode.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'Todos' || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [warranties, searchTerm, statusFilter]);

  const activeCount = warranties.filter((w) => w.status === 'Ativa').length;
  const expiringCount = warranties.filter((w) => w.status === 'Próxima do Vencimento').length;
  const expiredCount = warranties.filter((w) => w.status === 'Vencida').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Gestão de Garantias & Termos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Rastreabilidade de prazos legais, garantias de celulares por IMEI e certificados de cobertura.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Garantias Ativas</span>
          <p className="text-2xl sm:text-3xl font-light text-[#0f2b5c] mt-1">{activeCount} aparelhos</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Em período regular de cobertura</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">A Vencer em Breve</span>
          <p className="text-2xl sm:text-3xl font-light text-amber-600 mt-1">{expiringCount} aparelhos</p>
          <p className="text-[11px] text-amber-700 mt-0.5">Menos de 15 dias restantes</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Garantias Expiradas</span>
          <p className="text-2xl sm:text-3xl font-light text-[#0f2b5c] mt-1">{expiredCount} aparelhos</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Prazo concluído</p>
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
            placeholder="Buscar por IMEI, cliente, CPF ou modelo..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Ativa">Ativa</option>
          <option value="Próxima do Vencimento">Próxima do Vencimento</option>
          <option value="Vencida">Vencida</option>
        </select>
      </div>

      {/* Warranties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">IMEI Rastreado</th>
                <th className="py-3 px-4">Aparelho / Modelo</th>
                <th className="py-3 px-4">Cliente / Venda</th>
                <th className="py-3 px-4">Data Venda</th>
                <th className="py-3 px-4">Prazo</th>
                <th className="py-3 px-4">Vencimento da Garantia</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWarranties.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      {w.imei}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800">
                    {w.productName}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{w.clientName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Venda: {w.saleCode}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {new Date(w.startDate).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {w.days} dias
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {new Date(w.endDate).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                      w.status === 'Ativa'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.status === 'Próxima do Vencimento'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {w.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedWarrantyCert(w)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-blue-600 rounded-lg font-bold text-xs flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Termo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Termo de Garantia Modal */}
      {selectedWarrantyCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Certificado Oficial de Garantia
              </span>
              <button onClick={() => setSelectedWarrantyCert(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <h3 className="font-bold text-sm uppercase text-slate-900">{settings.storeName}</h3>
                <p className="text-[11px] text-slate-500">CNPJ: {settings.cnpj} • Contato: {settings.whatsapp}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">Aparelho / Modelo:</span>
                  <strong className="text-slate-900">{selectedWarrantyCert.productName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">IMEI Rastreado:</span>
                  <strong className="text-purple-700 font-mono">{selectedWarrantyCert.imei}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Cliente:</span>
                  <strong className="text-slate-900">{selectedWarrantyCert.clientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Venda / Data:</span>
                  <strong className="text-slate-900">{selectedWarrantyCert.saleCode} ({new Date(selectedWarrantyCert.startDate).toLocaleDateString('pt-BR')})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Prazo de Garantia:</span>
                  <strong className="text-blue-600">{selectedWarrantyCert.days} Dias Corridos</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Validade Limite:</span>
                  <strong className="text-emerald-700">{new Date(selectedWarrantyCert.endDate).toLocaleDateString('pt-BR')}</strong>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] block mb-1">Termos e Condições da Cobertura</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 leading-relaxed text-justify">
                {selectedWarrantyCert.terms || settings.warrantyTerms}
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4 text-center text-[10px] border-t border-slate-200">
              <div className="border-t border-slate-300 pt-1">
                <span className="font-bold text-slate-800">{settings.storeName}</span>
                <p className="text-slate-400">Assinatura / Carimbo</p>
              </div>
              <div className="border-t border-slate-300 pt-1">
                <span className="font-bold text-slate-800">{selectedWarrantyCert.clientName}</span>
                <p className="text-slate-400">Assinatura do Cliente</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedWarrantyCert(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Termo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
