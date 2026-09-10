import React, { useState } from 'react';
import { 
  Settings, Store, Shield, Users, Database, 
  Save, Check, AlertCircle, RefreshCw, Download, Upload, Plus 
} from 'lucide-react';
import { StoreSettings, User } from '../types';

interface SettingsViewProps {
  settings: StoreSettings;
  users: User[];
  onSaveSettings: (settings: StoreSettings) => void;
  onSaveUser: (user: User) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  users,
  onSaveSettings,
  onSaveUser,
  onExportBackup,
  onImportBackup,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'loja' | 'vendas' | 'usuarios' | 'backup'>('loja');
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJobTitle, setUserJobTitle] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'gerente' | 'vendedor' | 'caixa'>('vendedor');
  const [userCommission, setUserCommission] = useState(3);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const openNewUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserJobTitle('');
    setUserPhone('');
    setUserRole('vendedor');
    setUserCommission(3);
    setIsUserModalOpen(true);
  };

  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserJobTitle(u.jobTitle || (u.role === 'admin' ? 'Técnico TI' : ''));
    setUserPhone(u.phone || '');
    setUserRole(u.role);
    setUserCommission(u.commissionPercentage);
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    onSaveUser({
      id: editingUser ? editingUser.id : 'user_' + Date.now(),
      name: userName.trim(),
      email: userEmail.trim() || `${userName.toLowerCase().replace(/\s+/g, '')}@loja.com`,
      jobTitle: userJobTitle.trim() || (userRole === 'admin' ? 'Técnico TI' : undefined),
      phone: userPhone.trim() || undefined,
      role: userRole,
      active: editingUser ? editingUser.active : true,
      commissionPercentage: Number(userCommission) || 0,
    });

    setIsUserModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        onImportBackup(text);
        alert('Backup restaurado com sucesso!');
      } catch (err: any) {
        alert('Erro ao importar backup: arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600" />
            Configurações do Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Personalização da loja, recibos, permissões de equipe e rotinas de backup.
          </p>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('loja')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'loja' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Dados da Loja</span>
        </button>

        <button
          onClick={() => setActiveTab('vendas')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'vendas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Políticas de Venda & Garantia</span>
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuários & Comissões</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'backup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Restauração</span>
        </button>
      </div>

      {/* Tab: DADOS DA LOJA */}
      {activeTab === 'loja' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome Fantasia da Loja *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Razão Social</label>
              <input
                type="text"
                value={formData.corporateName}
                onChange={(e) => setFormData({ ...formData, corporateName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CNPJ</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Inscrição Estadual (IE)</label>
              <input
                type="text"
                value={formData.ie}
                onChange={(e) => setFormData({ ...formData, ie: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Comercial (para Envio de Recibos)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">E-mail Comercial</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Endereço Completo (Impresso no Rodapé dos Recibos)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados da Loja</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: VENDAS & GARANTIA */}
      {activeTab === 'vendas' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Garantia Padrão de Aparelhos (Dias)</label>
              <input
                type="number"
                value={formData.defaultWarrantyDays}
                onChange={(e) => setFormData({ ...formData, defaultWarrantyDays: parseInt(e.target.value) || 90 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Desconto Máximo Livre (%)</label>
              <input
                type="number"
                value={formData.maxDiscountPercentage}
                onChange={(e) => setFormData({ ...formData, maxDiscountPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Acima disso requer autorização do gerente</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Comissão Padrão de Vendedores (%)</label>
              <input
                type="number"
                value={formData.commissionPercentage}
                onChange={(e) => setFormData({ ...formData, commissionPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Termos Oficiais de Garantia (Exibidos no Recibo e Certificado)</label>
            <textarea
              rows={4}
              value={formData.warrantyTerms}
              onChange={(e) => setFormData({ ...formData, warrantyTerms: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mensagem de Agradecimento no Cupom</label>
            <input
              type="text"
              value={formData.receiptFooterMessage}
              onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Políticas</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: USUÁRIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 text-xs">Equipe de Usuários do Sistema ({users.length})</span>
            <button
              onClick={openNewUser}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Operador</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Nome</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Perfil de Acesso</th>
                  <th className="py-3 px-4 text-center">Comissão</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      {(u.jobTitle || u.role === 'admin') && (
                        <p className="text-[11px] text-blue-600 font-medium">
                          {u.jobTitle || (u.role === 'admin' ? 'Técnico TI' : '')}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700">{u.email}</p>
                      {u.phone && <p className="text-[11px] text-slate-400">{u.phone}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-[10px] capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">
                      {u.commissionPercentage}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditUser(u)}
                        className="text-blue-600 hover:underline font-bold"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: BACKUP */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs max-w-2xl">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Segurança e Backup de Dados
            </h3>
            <p className="text-slate-500">
              Faça download de todas as vendas, produtos, estoques, clientes e financeiro da loja em formato JSON para restauração a qualquer momento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">Exportar Cópia de Segurança</span>
              <p className="text-slate-500 text-[11px]">
                Gera um arquivo seguro contendo todos os dados relacionais do sistema.
              </p>
              <button
                onClick={onExportBackup}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Arquivo de Backup</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">Restaurar Cópia de Segurança</span>
              <p className="text-slate-500 text-[11px]">
                Substitui a base atual pelo arquivo JSON previamente exportado.
              </p>
              <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <Upload className="w-4 h-4" />
                <span>Selecionar Arquivo JSON</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Restaurar Dados de Demonstração</span>
            <p className="text-slate-500 text-[11px] mb-3">
              Caso queira repor produtos de exemplo (iPhones, Samsungs, capas, cabos, vendas de teste e fluxo de caixa), utilize a opção abaixo:
            </p>
            <button
              onClick={() => {
                if (window.confirm('Deseja recarregar o banco de dados com dados de teste da loja?')) {
                  onResetDemoData();
                }
              }}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Recarregar Dados de Demonstração</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal User Edit/Create */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário do Sistema'}
            </h3>

            <form onSubmit={handleUserSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    placeholder="Ex: Técnico TI"
                    value={userJobTitle}
                    onChange={(e) => setUserJobTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefone / Celular</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perfil de Acesso *</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="admin">Administrador</option>
                    <option value="gerente">Gerente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="caixa">Operador de Caixa</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Comissão (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={userCommission}
                    onChange={(e) => setUserCommission(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
