import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Edit, Trash2, Smartphone, 
  DollarSign, ShoppingBag, Eye, Calendar, Mail, Phone, 
  MapPin, Download, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Client, Sale } from '../types';

interface ClientsViewProps {
  clients: Client[];
  sales: Sale[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenReceipt: (sale: Sale) => void;
  selectedClientDetailId?: string | null;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  sales,
  onSaveClient,
  onDeleteClient,
  onOpenReceipt,
  selectedClientDetailId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClientHistory, setViewingClientHistory] = useState<Client | null>(() => {
    if (selectedClientDetailId) {
      return clients.find((c) => c.id === selectedClientDetailId) || null;
    }
    return null;
  });

  const [formData, setFormData] = useState<Partial<Client>>({
    code: '',
    name: '',
    cpfCnpj: '',
    birthDate: '',
    phone: '',
    whatsapp: '',
    email: '',
    cep: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    notes: '',
    creditLimit: 2000,
  });

  const openNewClientModal = () => {
    setEditingClient(null);
    setFormData({
      code: `CLI-${(clients.length + 1).toString().padStart(3, '0')}`,
      name: '',
      cpfCnpj: '',
      birthDate: '',
      phone: '',
      whatsapp: '',
      email: '',
      cep: '01001-000',
      address: '',
      number: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      notes: '',
      creditLimit: 3000,
    });
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const clientToSave: Client = {
      id: editingClient ? editingClient.id : 'cli_' + Date.now(),
      code: formData.code || `CLI-${Date.now()}`,
      name: formData.name.trim(),
      cpfCnpj: formData.cpfCnpj?.trim() || 'Não Informado',
      birthDate: formData.birthDate,
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || formData.phone || '',
      email: formData.email || '',
      cep: formData.cep || '',
      address: formData.address || '',
      number: formData.number || '',
      neighborhood: formData.neighborhood || '',
      city: formData.city || '',
      state: formData.state || '',
      notes: formData.notes || '',
      creditLimit: Number(formData.creditLimit) || 0,
      createdAt: editingClient ? editingClient.createdAt : new Date().toISOString().split('T')[0],
      totalPurchased: editingClient ? editingClient.totalPurchased : 0,
      openBalance: editingClient ? editingClient.openBalance : 0,
    };

    onSaveClient(clientToSave);
    setIsModalOpen(false);
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.cpfCnpj.includes(q) ||
        c.phone.includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [clients, searchTerm]);

  const clientSales = useMemo(() => {
    if (!viewingClientHistory) return [];
    return sales.filter((s) => s.clientId === viewingClientHistory.id);
  }, [sales, viewingClientHistory]);

  const exportClientsCSV = () => {
    const headers = ['Código', 'Nome', 'CPF/CNPJ', 'Telefone', 'WhatsApp', 'Email', 'Cidade', 'UF', 'Total Comprado', 'Saldo Devedor'];
    const rows = clients.map((c) => [
      c.code,
      `"${c.name}"`,
      c.cpfCnpj,
      c.phone,
      c.whatsapp,
      c.email,
      c.city,
      c.state,
      c.totalPurchased.toFixed(2),
      c.openBalance.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clientes_cellstore_${new Date().toISOString().split('T')[0]}.csv`);
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
            <Users className="w-6 h-6 text-blue-600" />
            Gestão de Clientes & Histórico 360º
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Cadastro completo com endereço, aparelhos adquiridos, limites de crédito e compras a prazo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportClientsCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={openNewClientModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, CPF/CNPJ, telefone ou código..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
        <span className="text-slate-500 font-semibold">{filteredClients.length} clientes encontrados</span>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Nome</th>
                <th className="py-3 px-4">CPF / CNPJ</th>
                <th className="py-3 px-4">Contato (WhatsApp / Fone)</th>
                <th className="py-3 px-4">Cidade / UF</th>
                <th className="py-3 px-4 text-right">Total em Compras</th>
                <th className="py-3 px-4 text-right">Saldo em Aberto</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{client.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Cód: {client.code}</p>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700">
                    {client.cpfCnpj}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{client.phone}</p>
                    {client.email && <p className="text-[10px] text-slate-400">{client.email}</p>}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {client.city ? `${client.city}/${client.state}` : '-'}
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    R$ {client.totalPurchased.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {client.openBalance > 0 ? (
                      <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        R$ {client.openBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Em dia</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setViewingClientHistory(client)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Ver Histórico de Compras"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditClientModal(client)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar Cadastro"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {client.id !== 'cli_3' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja excluir o cliente ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição de Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {editingClient ? `Editar Cliente: ${editingClient.name}` : 'Cadastrar Novo Cliente'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={formData.cpfCnpj || ''}
                    onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Celular</label>
                  <input
                    type="text"
                    value={formData.whatsapp || formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <span className="font-bold text-slate-700 text-[11px] block">Endereço Residencial / Cobrança</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">CEP</label>
                    <input
                      type="text"
                      value={formData.cep || ''}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-600 block mb-1">Logradouro / Rua</label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Número</label>
                    <input
                      type="text"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.neighborhood || ''}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">UF</label>
                    <input
                      type="text"
                      value={formData.state || 'SP'}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Limite de crédito e Observações */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Limite de Crédito Fiado (R$)</label>
                  <input
                    type="number"
                    value={formData.creditLimit || 3000}
                    onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Observações Gerais</label>
                  <input
                    type="text"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Preferências, referências comerciais, etc."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Histórico 360º de Compras do Cliente */}
      {viewingClientHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Histórico de Compras: {viewingClientHistory.name}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  CPF: {viewingClientHistory.cpfCnpj} • WhatsApp: {viewingClientHistory.whatsapp}
                </p>
              </div>
              <button onClick={() => setViewingClientHistory(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Client stats summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-blue-800">Total Histórico</span>
                  <p className="text-lg font-extrabold text-blue-900 mt-0.5">
                    R$ {viewingClientHistory.totalPurchased.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Pedidos Realizados</span>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">{clientSales.length} compras</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-800">Saldo a Receber</span>
                  <p className="text-lg font-extrabold text-rose-900 mt-0.5">
                    R$ {viewingClientHistory.openBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Purchase History Items */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-xs uppercase block">Vendas Registradas para este Cliente:</span>
                {clientSales.length === 0 ? (
                  <p className="text-slate-400 py-6 text-center">Nenhuma venda realizada para este cliente ainda.</p>
                ) : (
                  clientSales.map((sale) => (
                    <div key={sale.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{sale.code}</span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(sale.date).toLocaleDateString('pt-BR')} às {new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">
                            R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            onClick={() => onOpenReceipt(sale)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-blue-600 rounded font-bold text-[11px] cursor-pointer"
                          >
                            Recibo
                          </button>
                        </div>
                      </div>

                      {/* Items list with IMEI */}
                      <div className="pl-3 border-l-2 border-blue-400 space-y-1">
                        {sale.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span className="text-slate-800">
                              {it.quantity}x {it.productName}
                              {it.imei && <strong className="text-purple-700 ml-1 font-mono">(IMEI: {it.imei})</strong>}
                            </span>
                            <span className="text-slate-600">R$ {it.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setViewingClientHistory(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
