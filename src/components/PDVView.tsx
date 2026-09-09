import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShoppingCart, Search, Barcode, Trash2, Plus, Minus, 
  User as UserIcon, UserPlus, CreditCard, DollarSign, 
  Smartphone, Tag, Check, AlertCircle, RefreshCw, 
  Calculator, Sparkles, Receipt, Hash, ArrowRight
} from 'lucide-react';
import { 
  Product, IMEIItem, Client, User, PaymentMethod, 
  SaleItem, SalePayment, StoreSettings, Sale
} from '../types';

interface PDVViewProps {
  products: Product[];
  imeis: IMEIItem[];
  clients: Client[];
  currentUser: User;
  settings: StoreSettings;
  onExecuteSale: (saleData: {
    clientId: string;
    items: SaleItem[];
    discount: number;
    payments: SalePayment[];
    notes?: string;
    installmentsCount?: number;
    firstDueDate?: string;
  }) => Sale;
  onSaveNewClient: (client: Client) => void;
  onOpenReceipt: (sale: Sale) => void;
}

export const PDVView: React.FC<PDVViewProps> = ({
  products,
  imeis,
  clients,
  currentUser,
  settings,
  onExecuteSale,
  onSaveNewClient,
  onOpenReceipt
}) => {
  // PDV State
  const [selectedClientId, setSelectedClientId] = useState<string>('cli_3'); // default to Balcão
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'reais' | 'percentual'>('reais');
  const [notes, setNotes] = useState<string>('');

  // Search & Scanner
  const [productSearch, setProductSearch] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // IMEI Selection Modal State
  const [imeiModalProduct, setImeiModalProduct] = useState<Product | null>(null);

  // New Quick Client Modal
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Payment State
  const [payments, setPayments] = useState<SalePayment[]>([]);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>('PIX');
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');
  const [cardInstallments, setCardInstallments] = useState<number>(1);
  const [cashTendered, setCashTendered] = useState<string>('');

  // Installment / Carnê Settings
  const [isInstallmentSectionOpen, setIsInstallmentSectionOpen] = useState(false);
  const [installmentCount, setInstallmentCount] = useState<number>(3);
  const [firstDueDate, setFirstDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  // Feedback Error / Success
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus barcode input on mount
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Filter Catalog Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.model.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brandName.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.barcode.includes(productSearch);

      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, selectedCategory]);

  // Financial Computations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
  }, [cart]);

  const calculatedDiscount = useMemo(() => {
    if (discountType === 'percentual') {
      return (subtotal * globalDiscount) / 100;
    }
    return globalDiscount;
  }, [subtotal, globalDiscount, discountType]);

  const total = Math.max(0, subtotal - calculatedDiscount);

  const totalPaid = useMemo(() => {
    return payments.reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const remainingBalance = Math.max(0, total - totalPaid);

  // Auto populate payment amount with remaining balance
  useEffect(() => {
    if (remainingBalance > 0) {
      setPaymentAmountInput(remainingBalance.toFixed(2));
    } else {
      setPaymentAmountInput('');
    }
  }, [remainingBalance]);

  // Add Item to Cart
  const handleAddToCart = (product: Product, specificImei?: string) => {
    setErrorMsg(null);

    // Validate Stock
    if (product.currentStock <= 0) {
      setErrorMsg(`O produto ${product.model} está com estoque zerado.`);
      return;
    }

    // If device has IMEI and none selected yet, trigger IMEI modal
    if (product.hasImei && !specificImei) {
      const available = imeis.filter((i) => i.productId === product.id && i.status === 'disponivel');
      if (available.length === 0) {
        setErrorMsg(`Não há aparelhos com IMEI disponível em estoque para ${product.model}.`);
        return;
      }
      setImeiModalProduct(product);
      return;
    }

    // Check if IMEI already in cart
    if (specificImei) {
      const alreadyInCart = cart.some((it) => it.imei === specificImei);
      if (alreadyInCart) {
        setErrorMsg(`O IMEI ${specificImei} já está no carrinho da venda.`);
        return;
      }
    }

    // Check non-IMEI item quantity in cart vs current stock
    if (!product.hasImei) {
      const existingInCart = cart.find((it) => it.productId === product.id);
      if (existingInCart && existingInCart.quantity + 1 > product.currentStock) {
        setErrorMsg(`Quantidade máxima em estoque atingida para ${product.model} (${product.currentStock} un).`);
        return;
      }
    }

    const newItem: SaleItem = {
      productId: product.id,
      productName: product.model,
      brandName: product.brandName,
      model: product.model,
      category: product.category,
      imei: specificImei,
      condition: product.condition,
      quantity: 1,
      unitPrice: product.sellPrice,
      discount: 0,
      total: product.sellPrice,
      costPrice: product.costPrice,
    };

    if (product.hasImei) {
      // Each IMEI is tracked as an individual item row
      setCart((prev) => [...prev, newItem]);
    } else {
      // Regular accessories stack quantity
      setCart((prev) => {
        const existingIdx = prev.findIndex((it) => it.productId === product.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const item = updated[existingIdx];
          const newQty = item.quantity + 1;
          updated[existingIdx] = {
            ...item,
            quantity: newQty,
            total: (item.unitPrice * newQty) - item.discount,
          };
          return updated;
        }
        return [...prev, newItem];
      });
    }

    setImeiModalProduct(null);
  };

  // Barcode / Fast IMEI Scanner Handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    setErrorMsg(null);

    // 1. Try matching directly by IMEI
    const matchedImei = imeis.find((i) => i.imei === code && i.status === 'disponivel');
    if (matchedImei) {
      const product = products.find((p) => p.id === matchedImei.productId);
      if (product) {
        handleAddToCart(product, matchedImei.imei);
        setBarcodeInput('');
        return;
      }
    }

    // 2. Try matching by Barcode
    const matchedProduct = products.find((p) => p.barcode === code || p.code.toLowerCase() === code.toLowerCase());
    if (matchedProduct) {
      handleAddToCart(matchedProduct);
      setBarcodeInput('');
      return;
    }

    setErrorMsg(`Código ou IMEI "${code}" não localizado no estoque disponível.`);
    setBarcodeInput('');
  };

  // Update Item Quantity (accessories only)
  const handleUpdateQuantity = (index: number, delta: number) => {
    const item = cart[index];
    if (item.imei) {
      setErrorMsg('Aparelhos com IMEI possuem rastreamento unitário e quantidade fixa de 1.');
      return;
    }

    const product = products.find((p) => p.id === item.productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    if (product && newQty > product.currentStock) {
      setErrorMsg(`Estoque disponível insuficiente (${product.currentStock} un).`);
      return;
    }

    setCart((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...item,
        quantity: newQty,
        total: (item.unitPrice * newQty) - item.discount,
      };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Payment Line (Permitir pagamento misto, ex: PIX + Cartão)
  const handleAddPayment = () => {
    setErrorMsg(null);
    const amount = parseFloat(paymentAmountInput.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Informe um valor de pagamento válido.');
      return;
    }

    if (amount > remainingBalance) {
      // If payment is cash, allow overpayment to calculate change
      if (currentMethod !== 'Dinheiro') {
        setErrorMsg(`O valor (R$ ${amount.toFixed(2)}) não pode exceder o saldo restante (R$ ${remainingBalance.toFixed(2)}).`);
        return;
      }
    }

    const newPayment: SalePayment = {
      id: 'pay_' + Date.now(),
      method: currentMethod,
      amount: Math.min(amount, remainingBalance),
      installmentsCount: currentMethod === 'Cartão de Crédito' || currentMethod === 'Fiado / Crediário' ? cardInstallments : undefined,
    };

    setPayments((prev) => [...prev, newPayment]);
  };

  const handleRemovePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Finalize Sale
  const handleFinalizeSale = () => {
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Adicione ao menos um produto no carrinho.');
      return;
    }

    if (remainingBalance > 0.05) {
      setErrorMsg(`Ainda resta um saldo pendente de R$ ${remainingBalance.toFixed(2)} a ser quitado nas formas de pagamento.`);
      return;
    }

    try {
      const newSale = onExecuteSale({
        clientId: selectedClientId,
        items: cart,
        discount: calculatedDiscount,
        payments: payments,
        notes,
        installmentsCount: installmentCount,
        firstDueDate,
      });

      // Clear PDV form
      setCart([]);
      setPayments([]);
      setGlobalDiscount(0);
      setNotes('');
      setSelectedClientId('cli_3');

      // Pop open receipt modal
      onOpenReceipt(newSale);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar a venda.');
    }
  };

  // Quick Client Creation
  const handleCreateQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newCli: Client = {
      id: 'cli_' + Date.now(),
      code: `CLI-${(clients.length + 1).toString().padStart(3, '0')}`,
      name: newClientName.trim(),
      cpfCnpj: newClientCpf.trim() || 'Não Informado',
      phone: newClientPhone.trim() || '',
      whatsapp: newClientPhone.trim() || '',
      email: '',
      cep: settings.cep,
      address: settings.address,
      number: settings.number,
      neighborhood: settings.neighborhood,
      city: settings.city,
      state: settings.state,
      createdAt: new Date().toISOString().split('T')[0],
      totalPurchased: 0,
      openBalance: 0,
    };

    onSaveNewClient(newCli);
    setSelectedClientId(newCli.id);
    setIsNewClientModalOpen(false);
    setNewClientName('');
    setNewClientCpf('');
    setNewClientPhone('');
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-4 pb-16">
      {/* Error Alert Box */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-800 p-1">✕</button>
        </div>
      )}

      {/* Main PDV Layout: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Fast Scanner, Client Selector, & Product Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Barcode & IMEI Scanner Bar */}
          <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-slate-800">
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  id="pdv-barcode-scanner"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Escanear leitor de código de barras ou bipar IMEI direto..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                Bipar / Inserir
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Dica: Leitor USB/Bluetooth funciona diretamente neste campo.</span>
              <span className="text-blue-400 font-mono">Modo Rápido Ativo</span>
            </div>
          </div>

          {/* Client Selection Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cliente da Venda</span>
                  {selectedClient?.openBalance ? (
                    <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                      Saldo Devedor: R$ {selectedClient.openBalance.toFixed(2)}
                    </span>
                  ) : null}
                </div>
                <select
                  id="pdv-client-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full mt-0.5 py-1 text-xs sm:text-sm font-bold text-slate-900 bg-transparent border-0 border-b border-slate-200 focus:border-blue-600 focus:ring-0 cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.cpfCnpj !== 'Não Informado' && `(${c.cpfCnpj})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNewClientModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Cliente</span>
            </button>
          </div>

          {/* Catalog Search & Category Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Pesquisar catálogo por nome, modelo, marca ou código..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {['Todos', 'Smartphone', 'Celular', 'Carregador', 'Capinha', 'Película', 'Fone', 'Cabo', 'Acessórios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto p-1 scrollbar-thin">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.currentStock <= 0;
                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && handleAddToCart(p)}
                    className={`
                      p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between
                      ${isOutOfStock 
                        ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed' 
                        : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer group'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-bold uppercase text-slate-400">{p.brandName}</span>
                        {p.hasImei && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                            IMEI
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {p.model}
                      </p>
                      {p.storage && (
                        <p className="text-[11px] text-slate-500">{p.storage} • {p.color}</p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                          R$ {p.sellPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <p className={`text-[10px] font-semibold ${isOutOfStock ? 'text-rose-600' : p.currentStock <= p.minStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {isOutOfStock ? 'Esgotado' : `${p.currentStock} em estoque`}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Cart, Discounts, Multi-Payment & Confirmation (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Cart Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Itens da Venda ({cart.length})</span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  Limpar Carrinho
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="p-3 space-y-2.5 max-h-[260px] overflow-y-auto scrollbar-thin">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                  Carrinho vazio. Bipe um produto ou selecione no catálogo ao lado.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.productName}</p>
                      {item.imei && (
                        <div className="flex items-center gap-1 text-[10px] text-purple-700 font-mono font-bold">
                          <Hash className="w-3 h-3" /> IMEI: {item.imei}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-500">
                        Unit: R$ {item.unitPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Selector (disabled for IMEIs) */}
                    <div className="flex items-center gap-1.5">
                      {!item.imei ? (
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[11px]">
                          1 un
                        </span>
                      )}

                      <div className="w-20 text-right font-extrabold text-slate-900 text-xs">
                        R$ {item.total.toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Global Discount Section */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos Itens:</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Controls */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" /> Desconto:
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setDiscountType('reais')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${discountType === 'reais' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                    >
                      R$
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('percentual')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${discountType === 'percentual' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                    >
                      %
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={globalDiscount || ''}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-right font-bold text-emerald-600 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Big Total */}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="font-extrabold text-sm text-slate-900">TOTAL A PAGAR:</span>
                <span className="text-xl font-black text-blue-600 tracking-tight">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Module & Splitting */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Pagamento (Permite Múltiplas Formas)
              </span>
              <span className={`font-extrabold ${remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {remainingBalance > 0 ? `Falta: R$ ${remainingBalance.toFixed(2)}` : 'Total Quitado!'}
              </span>
            </div>

            {/* Payment Method Selector Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {(['PIX', 'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'Boleto', 'Transferência', 'Fiado / Crediário'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCurrentMethod(m)}
                  className={`p-2 rounded-xl text-center font-bold border transition-all cursor-pointer text-[11px] leading-tight ${
                    currentMethod === m 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Payment Amount & Add Button */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  placeholder="Valor deste pagamento"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Installments selector if credit card or crediário */}
              {(currentMethod === 'Cartão de Crédito' || currentMethod === 'Fiado / Crediário') && (
                <select
                  value={cardInstallments}
                  onChange={(e) => setCardInstallments(parseInt(e.target.value))}
                  className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 10, 12, 18, 24].map((num) => (
                    <option key={num} value={num}>{num}x</option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={handleAddPayment}
                disabled={remainingBalance <= 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                + Adicionar
              </button>
            </div>

            {/* Payments Added List */}
            {payments.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pagamentos Registrados:</span>
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-semibold">
                      • {p.method} {p.installmentsCount ? `(${p.installmentsCount}x)` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">R$ {p.amount.toFixed(2)}</span>
                      <button onClick={() => handleRemovePayment(p.id)} className="text-rose-500 hover:text-rose-700 p-0.5">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Installments Carnê Setup (if Fiado / Crediário used) */}
            {payments.some((p) => p.method === 'Fiado / Crediário') && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5" /> Carnê / Parcelamento da Loja
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-amber-800 font-semibold">Qtd Parcelas:</label>
                    <select
                      value={installmentCount}
                      onChange={(e) => setInstallmentCount(parseInt(e.target.value))}
                      className="w-full mt-0.5 p-1 bg-white border border-amber-300 rounded font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>{n} parcelas</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-amber-800 font-semibold">1º Vencimento:</label>
                    <input
                      type="date"
                      value={firstDueDate}
                      onChange={(e) => setFirstDueDate(e.target.value)}
                      className="w-full mt-0.5 p-1 bg-white border border-amber-300 rounded font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Observações da Venda */}
            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações internas da venda (opcional)..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            {/* Finalize Button */}
            <button
              id="btn-finalize-sale"
              type="button"
              onClick={handleFinalizeSale}
              disabled={cart.length === 0 || remainingBalance > 0.05}
              className={`
                w-full py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer
                ${cart.length > 0 && remainingBalance <= 0.05
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:scale-[1.01]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }
              `}
            >
              <Check className="w-5 h-5" />
              <span>Finalizar Venda e Emitir Recibo (F2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* IMEI Selection Modal */}
      {imeiModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Selecione o IMEI do Aparelho</h3>
                <p className="text-xs text-slate-500">{imeiModalProduct.model} ({imeiModalProduct.color})</p>
              </div>
              <button onClick={() => setImeiModalProduct(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Aparelhos Disponíveis em Estoque:</span>
              {imeis
                .filter((i) => i.productId === imeiModalProduct.id && i.status === 'disponivel')
                .map((imeiItem) => {
                  const isAlreadyInCart = cart.some((c) => c.imei === imeiItem.imei);
                  return (
                    <div
                      key={imeiItem.id}
                      onClick={() => !isAlreadyInCart && handleAddToCart(imeiModalProduct, imeiItem.imei)}
                      className={`
                        p-3 rounded-xl border flex items-center justify-between transition-all text-xs
                        ${isAlreadyInCart 
                          ? 'bg-slate-100 opacity-50 cursor-not-allowed' 
                          : 'bg-slate-50 hover:bg-blue-50/60 hover:border-blue-500 cursor-pointer'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                            {imeiItem.imei}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                            {imeiItem.condition}
                          </span>
                        </div>
                        {imeiItem.notes && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{imeiItem.notes}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-blue-600">
                        {isAlreadyInCart ? 'Já no Carrinho' : 'Selecionar +'}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setImeiModalProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Cadastro Rápido de Cliente
              </h3>
              <button onClick={() => setIsNewClientModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <form onSubmit={handleCreateQuickClient} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">CPF ou CNPJ</label>
                <input
                  type="text"
                  value={newClientCpf}
                  onChange={(e) => setNewClientCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Salvar e Selecionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
