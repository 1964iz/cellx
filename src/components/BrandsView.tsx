import React, { useState } from 'react';
import { PackageCheck, Plus, Edit, Trash2, Smartphone, Check, X } from 'lucide-react';
import { Brand, Product } from '../types';

interface BrandsViewProps {
  brands: Brand[];
  products: Product[];
  onSaveBrand: (brand: Brand) => void;
  onDeleteBrand: (brandId: string) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({
  brands,
  products,
  onSaveBrand,
  onDeleteBrand,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState('');

  const openNewModal = () => {
    setEditingBrand(null);
    setName('');
    setActive(true);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setActive(b.active !== undefined ? b.active : b.status === 'ativa');
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveBrand({
      id: editingBrand ? editingBrand.id : 'brand_' + Date.now(),
      name: name.trim(),
      active,
      status: active ? 'ativa' : 'inativa',
      notes: notes.trim(),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 text-blue-600" />
            Marcas e Fabricantes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Organização dos modelos por marcas (Apple, Samsung, Motorola, Xiaomi, etc).
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Marca</span>
        </button>
      </div>

      {/* Grid of Brands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => {
          const brandProducts = products.filter((p) => p.brandId === b.id || p.brandName.toLowerCase() === b.name.toLowerCase());
          const totalStock = brandProducts.reduce((acc, p) => acc + p.currentStock, 0);

          return (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {b.active ? 'Ativa' : 'Inativa'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir a marca ${b.name}?`)) {
                          onDeleteBrand(b.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mt-2">{b.name}</h3>
                {b.notes && <p className="text-xs text-slate-500 mt-0.5">{b.notes}</p>}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>{brandProducts.length} modelos</span>
                <span className="font-bold text-slate-900">{totalStock} peças em estoque</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              {editingBrand ? 'Editar Marca' : 'Cadastrar Marca'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome da Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Apple, Samsung, Xiaomi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações</label>
                <input
                  type="text"
                  placeholder="Ex: Fabricante de iPhones e iPads"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="brand-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="brand-active" className="font-semibold text-slate-700 cursor-pointer">
                  Marca Ativa no Catálogo
                </label>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Salvar Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
