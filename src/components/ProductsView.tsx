import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Smartphone, Filter, Edit, Trash2, 
  Layers, AlertTriangle, ShieldCheck, Tag, Barcode, Eye, X
} from 'lucide-react';
import { 
  Product, Brand, Supplier, DeviceCondition, ProductCategory, 
  IMEIItem, User 
} from '../types';

interface ProductsViewProps {
  products: Product[];
  brands: Brand[];
  suppliers: Supplier[];
  imeis: IMEIItem[];
  currentUser: User;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  brands,
  suppliers,
  imeis,
  currentUser,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [conditionFilter, setConditionFilter] = useState('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingImeisProduct, setViewingImeisProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    code: '',
    brandId: '',
    model: '',
    category: 'Smartphone',
    color: '',
    storage: '128GB',
    ram: '8GB',
    condition: 'Novo',
    hasImei: true,
    barcode: '',
    supplierId: '',
    costPrice: 0,
    sellPrice: 0,
    minStock: 2,
    currentStock: 0,
    warrantyDays: 90,
    notes: '',
    location: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({
      code: `PROD-${(products.length + 1).toString().padStart(3, '0')}`,
      brandId: brands[0]?.id || '',
      model: '',
      category: 'Smartphone',
      color: '',
      storage: '128GB',
      ram: '8GB',
      condition: 'Novo',
      hasImei: true,
      barcode: `7890${Date.now().toString().slice(-8)}`,
      supplierId: suppliers[0]?.id || '',
      costPrice: 0,
      sellPrice: 0,
      minStock: 2,
      currentStock: 0,
      warrantyDays: 90,
      notes: '',
      location: 'Vitrine A',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.model?.trim()) {
      setFormError('Informe o modelo do produto.');
      return;
    }
    if (!formData.brandId) {
      setFormError('Selecione a marca do produto.');
      return;
    }

    const brand = brands.find((b) => b.id === formData.brandId);
    const supplier = suppliers.find((s) => s.id === formData.supplierId);

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : 'prod_' + Date.now(),
      code: formData.code || `PROD-${Date.now()}`,
      brandId: formData.brandId,
      brandName: brand ? brand.name : '',
      model: formData.model.trim(),
      category: formData.category as ProductCategory,
      color: formData.color || 'Padrão',
      storage: formData.storage,
      ram: formData.ram,
      condition: formData.condition as DeviceCondition,
      hasImei: Boolean(formData.hasImei),
      barcode: formData.barcode || Date.now().toString(),
      supplierId: formData.supplierId,
      supplierName: supplier ? supplier.name : '',
      entryDate: formData.entryDate || new Date().toISOString().split('T')[0],
      costPrice: Number(formData.costPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      minStock: Number(formData.minStock) || 0,
      currentStock: Number(formData.currentStock) || 0,
      warrantyDays: Number(formData.warrantyDays) || 0,
      notes: formData.notes,
      location: formData.location,
      imageUrl: formData.imageUrl,
    };

    onSaveProduct(productToSave);
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm);

      const matchesBrand = selectedBrand === 'Todas' || p.brandName === selectedBrand;
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesCondition = conditionFilter === 'Todos' || p.condition === conditionFilter;

      return matchesSearch && matchesBrand && matchesCategory && matchesCondition;
    });
  }, [products, searchTerm, selectedBrand, selectedCategory, conditionFilter]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-blue-600" />
            Produtos e Modelos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Cadastro de smartphones, celulares novos/seminovos e acessórios com controle por IMEI.
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          id="btn-new-product"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por modelo, código, código de barras..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Brand Filter */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
        >
          <option value="Todas">Todas as Marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
        >
          <option value="Todas">Todas as Categorias</option>
          {['Celular', 'Smartphone', 'Tablet', 'Smartwatch', 'Fone', 'Carregador', 'Cabo', 'Capinha', 'Película', 'Acessórios', 'Outros'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Condition Filter */}
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
        >
          <option value="Todos">Todos os Estados</option>
          <option value="Novo">Novo</option>
          <option value="Seminovo">Seminovo</option>
          <option value="Usado">Usado</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Cód / Barcode</th>
                <th className="py-3 px-4">Produto & Modelo</th>
                <th className="py-3 px-4">Marca / Categoria</th>
                <th className="py-3 px-4">Estado / IMEI</th>
                <th className="py-3 px-4 text-right">Preço Custo</th>
                <th className="py-3 px-4 text-right">Preço Venda</th>
                <th className="py-3 px-4 text-center">Estoque</th>
                <th className="py-3 px-4 text-center">Garantia</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Nenhum produto localizado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLow = p.currentStock > 0 && p.currentStock <= p.minStock;
                  const isZero = p.currentStock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800">{p.code}</span>
                        <div className="text-[10px] text-slate-400 font-mono">{p.barcode}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{p.model}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.color} {p.storage && `• ${p.storage}`} {p.ram && `• ${p.ram} RAM`}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{p.brandName}</span>
                        <div className="text-[10px] text-slate-500">{p.category}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.condition === 'Novo' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.condition}
                          </span>
                          {p.hasImei && (
                            <button
                              onClick={() => setViewingImeisProduct(p)}
                              className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center gap-1 hover:bg-purple-200 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Ver IMEIs
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-600">
                        R$ {p.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 text-xs sm:text-sm">
                        R$ {p.sellPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs ${
                          isZero 
                            ? 'bg-rose-100 text-rose-700' 
                            : isLow 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.currentStock} un
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">mín: {p.minStock}</div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="text-slate-700 font-semibold">{p.warrantyDays} dias</span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Produto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o produto ${p.model}?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                {editingProduct ? `Editar Produto: ${editingProduct.model}` : 'Cadastrar Novo Produto / Modelo'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                  {formError}
                </div>
              )}

              {/* Grid 1: Identificação */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código do Produto *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código de Barras (EAN)</label>
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca *</label>
                  <select
                    value={formData.brandId || ''}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="">Selecione a Marca...</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 2: Modelo & Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Modelo Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: iPhone 15 Pro 128GB ou Galaxy S24 Ultra"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria *</label>
                  <select
                    value={formData.category || 'Smartphone'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer"
                  >
                    {['Smartphone', 'Celular', 'Tablet', 'Smartwatch', 'Fone', 'Carregador', 'Cabo', 'Capinha', 'Película', 'Acessórios', 'Outros'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 3: Especificações técnicas do celular */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cor</label>
                  <input
                    type="text"
                    placeholder="Ex: Titânio Natural"
                    value={formData.color || ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Armazenamento</label>
                  <input
                    type="text"
                    placeholder="Ex: 128GB, 256GB"
                    value={formData.storage || ''}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Memória RAM</label>
                  <input
                    type="text"
                    placeholder="Ex: 8GB"
                    value={formData.ram || ''}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado</label>
                  <select
                    value={formData.condition || 'Novo'}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as DeviceCondition })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Novo">Novo</option>
                    <option value="Seminovo">Seminovo</option>
                    <option value="Usado">Usado</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Rastreamento por IMEI */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-purple-950 text-xs">Exige Controle Individual por IMEI?</p>
                  <p className="text-[11px] text-purple-700">Obrigatório para celulares e smartphones novos e usados.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasImei}
                  onChange={(e) => setFormData({ ...formData, hasImei: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              {/* Grid 4: Preços & Estoque */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custo de Compra (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice || ''}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellPrice || ''}
                    onChange={(e) => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-blue-600 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    disabled={formData.hasImei && !editingProduct} // IMEIs are populated via Entradas
                    value={formData.currentStock || 0}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                  {formData.hasImei && !editingProduct && (
                    <span className="text-[10px] text-slate-400">Inserido via tela Entradas</span>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={formData.minStock || 2}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 2 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Grid 5: Garantia & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prazo de Garantia (Dias)</label>
                  <input
                    type="number"
                    value={formData.warrantyDays || 90}
                    onChange={(e) => setFormData({ ...formData, warrantyDays: parseInt(e.target.value) || 90 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Localização na Loja</label>
                  <input
                    type="text"
                    placeholder="Ex: Vitrine A1, Gaveta 02"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fornecedor Principal</label>
                  <select
                    value={formData.supplierId || ''}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações Técnicas</label>
                <textarea
                  rows={2}
                  placeholder="Informações sobre procedência, testes de bateria, acessórios inclusos..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* Buttons Footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View IMEIs Modal */}
      {viewingImeisProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  IMEIs Cadastrados: {viewingImeisProduct.model}
                </h3>
                <p className="text-xs text-slate-500">Rastreamento individual de cada unidade em estoque</p>
              </div>
              <button onClick={() => setViewingImeisProduct(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <div className="py-4 space-y-2 max-h-[360px] overflow-y-auto">
              {imeis.filter((i) => i.productId === viewingImeisProduct.id).length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">Nenhum IMEI registrado para este aparelho.</p>
              ) : (
                imeis.filter((i) => i.productId === viewingImeisProduct.id).map((i) => (
                  <div key={i.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{i.imei}</span>
                        {i.imei2 && <span className="font-mono text-[10px] text-slate-500">IMEI 2: {i.imei2}</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {i.color} • Entrou em {new Date(i.entryDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                      i.status === 'disponivel' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : i.status === 'vendido' 
                          ? 'bg-slate-200 text-slate-700' 
                          : 'bg-rose-100 text-rose-800'
                    }`}>
                      {i.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingImeisProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
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
