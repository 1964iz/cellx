export type ActiveTab = 
  | 'dashboard'
  | 'pdv'
  | 'produtos'
  | 'estoque'
  | 'entradas'
  | 'saidas'
  | 'vendas'
  | 'clientes'
  | 'marcas'
  | 'receber'
  | 'pagar'
  | 'caixa'
  | 'garantias'
  | 'trocas'
  | 'movimentacoes'
  | 'relatorios'
  | 'usuarios'
  | 'configuracoes';

export type UserRole = 'admin' | 'gerente' | 'vendedor' | 'estoquista';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobTitle?: string;
  phone?: string;
  active: boolean;
  avatar?: string;
  commissionPercentage?: number;
  permissions?: {
    canEditPrices: boolean;
    canGiveDiscounts: boolean;
    canDeleteSales: boolean;
    canAccessFinancial: boolean;
    canManageUsers: boolean;
    canManageStock: boolean;
  };
}

export interface Client {
  id: string;
  code: string;
  name: string;
  cpfCnpj: string;
  birthDate?: string;
  phone: string;
  whatsapp: string;
  email: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  notes?: string;
  creditLimit?: number;
  createdAt: string;
  totalPurchased: number;
  openBalance: number;
  lastPurchaseDate?: string;
}

export interface Brand {
  id: string;
  code?: string;
  name: string;
  status?: 'ativa' | 'inativa';
  active?: boolean;
  notes?: string;
}

export type ProductCategory = 
  | 'Celular'
  | 'Smartphone'
  | 'Tablet'
  | 'Smartwatch'
  | 'Fone'
  | 'Carregador'
  | 'Cabo'
  | 'Capinha'
  | 'Película'
  | 'Acessórios'
  | 'Outros';

export type DeviceCondition = 'Novo' | 'Seminovo' | 'Usado';

export interface Product {
  id: string;
  code: string;
  brandId: string;
  brandName: string;
  model: string;
  category: ProductCategory;
  color: string;
  storage?: string; // e.g. "128GB", "256GB"
  ram?: string;     // e.g. "8GB"
  condition: DeviceCondition;
  hasImei: boolean;
  serialNumber?: string;
  barcode: string;
  supplierId?: string;
  supplierName?: string;
  entryDate: string;
  costPrice: number;
  sellPrice: number;
  minStock: number;
  currentStock: number;
  warrantyDays: number;
  notes?: string;
  imageUrl?: string;
  location?: string;
}

export type ImeiStatus = 'disponivel' | 'vendido' | 'devolvido' | 'danificado' | 'reservado';

export interface IMEIItem {
  id: string;
  imei: string;
  imei2?: string;
  productId: string;
  productName: string;
  model: string;
  brandName: string;
  color: string;
  storage?: string;
  condition: DeviceCondition;
  status: ImeiStatus;
  costPrice: number;
  sellPrice: number;
  entryDate: string;
  soldDate?: string;
  saleId?: string;
  supplierName?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpjCpf: string;
  phone: string;
  email: string;
  contactPerson?: string;
}

export type StockMovementType = 
  | 'entrada'
  | 'saida'
  | 'venda'
  | 'troca'
  | 'devolucao'
  | 'perda'
  | 'uso_interno'
  | 'ajuste';

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  imei?: string;
  type: StockMovementType;
  quantity: number;
  costPrice?: number;
  sellPrice?: number;
  reason: string;
  userName: string;
  userId: string;
  notes?: string;
}

export type Category = ProductCategory;

export type ExitReason = 
  | 'Troca' 
  | 'Devolução ao fornecedor' 
  | 'Produto danificado' 
  | 'Perda' 
  | 'Uso interno' 
  | 'Ajuste de estoque' 
  | 'Outros';

export interface ProductEntry {
  id: string;
  date: string;
  supplierName: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  brandName: string;
  imeis: string[];
  quantity: number;
  unitCost: number;
  totalCost: number;
  paymentMethod: string;
  notes?: string;
  userName: string;
}

export type StockEntry = ProductEntry;

export type PaymentMethod = 
  | 'Dinheiro'
  | 'PIX'
  | 'Cartão de Débito'
  | 'Cartão de Crédito'
  | 'Boleto'
  | 'Transferência'
  | 'Fiado / Crediário';

export interface SalePayment {
  id: string;
  method: PaymentMethod;
  amount: number;
  installmentsCount?: number;
  reference?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  brandName?: string;
  model?: string;
  category?: ProductCategory;
  imei?: string;
  condition?: DeviceCondition;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
  costPrice?: number;
}

export type CartItem = SaleItem;

export interface Installment {
  id: string;
  saleId: string;
  saleCode: string;
  clientName: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Parcial';
  paidDate?: string;
  paymentMethod?: PaymentMethod;
}

export interface Sale {
  id: string;
  code: string;
  date: string;
  clientId: string;
  clientName: string;
  clientCpf: string;
  clientPhone: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  payments: SalePayment[];
  change: number;
  status: 'concluida' | 'cancelada';
  sellerName: string;
  sellerId: string;
  notes?: string;
  warrantyDays: number;
  installments?: Installment[];
}

export interface AccountReceivable {
  id: string;
  saleId: string;
  saleCode: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  paidAmount: number;
  balance: number;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Parcial';
  lastPaymentDate?: string;
}

export interface AccountPayable {
  id: string;
  supplier: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  paymentMethod: PaymentMethod;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Parcial';
  paidAmount: number;
  paidDate?: string;
  notes?: string;
}

export interface CashMovement {
  id: string;
  cashRegisterId: string;
  date: string;
  type: 'entrada' | 'saida';
  category: string;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod | 'Misto';
  saleId?: string;
  userName: string;
}

export interface CashRegister {
  id: string;
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  initialBalance: number;
  status: 'aberto' | 'fechado';
  entries: number;
  exits: number;
  currentBalance: number;
  // Breakdown at close
  breakdown?: {
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
    outros: number;
    totalVendido: number;
    totalRecebido: number;
    diferenca: number;
    observacoes?: string;
  };
}

export interface Warranty {
  id: string;
  saleId: string;
  saleCode: string;
  productId: string;
  productName: string;
  imei?: string;
  clientId: string;
  clientName: string;
  clientCpf: string;
  saleDate: string;
  warrantyDays: number;
  endDate: string;
  status: 'Ativa' | 'Próxima do vencimento' | 'Vencida';
  terms: string;
}

export interface ExchangeReturn {
  id: string;
  date: string;
  type: 'Troca' | 'Devolução';
  saleId: string;
  saleCode: string;
  clientId: string;
  clientName: string;
  returnedProductId: string;
  returnedProductName: string;
  returnedImei?: string;
  returnReason: string;
  newProductId?: string;
  newProductName?: string;
  newImei?: string;
  differenceAmount: number; // positive = customer paid extra, negative = refund
  refundMethod?: PaymentMethod;
  userName: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tradingName: string; // Nome fantasia
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  receiptHeader: string;
  receiptFooter: string;
  warrantyDefaultDays: number;
  warrantyTerms: string;
  maxDiscountPercent: number;
  defaultMinStock: number;
}
