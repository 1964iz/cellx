import { 
  User, Client, Brand, Product, IMEIItem, Supplier, 
  StockMovement, ProductEntry, Sale, Installment, 
  AccountReceivable, AccountPayable, CashRegister, 
  CashMovement, Warranty, ExchangeReturn, StoreSettings,
  PaymentMethod, SaleItem, SalePayment
} from '../types';

const STORAGE_KEY_PREFIX = 'cellstore_pro_';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'Carlos Mendes (Admin)',
    email: 'carlos@techcell.com.br',
    role: 'admin',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canEditPrices: true,
      canGiveDiscounts: true,
      canDeleteSales: true,
      canAccessFinancial: true,
      canManageUsers: true,
      canManageStock: true,
    }
  },
  {
    id: 'usr_2',
    name: 'Mariana Silva (Gerente)',
    email: 'mariana@techcell.com.br',
    role: 'gerente',
    active: true,
    permissions: {
      canEditPrices: true,
      canGiveDiscounts: true,
      canDeleteSales: false,
      canAccessFinancial: true,
      canManageUsers: false,
      canManageStock: true,
    }
  },
  {
    id: 'usr_3',
    name: 'Lucas Ferreira (Vendedor)',
    email: 'lucas@techcell.com.br',
    role: 'vendedor',
    active: true,
    permissions: {
      canEditPrices: false,
      canGiveDiscounts: true,
      canDeleteSales: false,
      canAccessFinancial: false,
      canManageUsers: false,
      canManageStock: false,
    }
  },
  {
    id: 'usr_4',
    name: 'Rafael Oliveira (Estoquista)',
    email: 'rafael@techcell.com.br',
    role: 'estoquista',
    active: true,
    permissions: {
      canEditPrices: false,
      canGiveDiscounts: false,
      canDeleteSales: false,
      canAccessFinancial: false,
      canManageUsers: false,
      canManageStock: true,
    }
  }
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'TechCell Prime',
  tradingName: 'TechCell Celulares & Acessórios',
  cnpj: '34.567.890/0001-22',
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  email: 'contato@techcellprime.com.br',
  instagram: '@techcellprime.oficial',
  address: 'Av. Paulista',
  number: '1250',
  complement: 'Loja 14 - Galeria Central',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  cep: '01310-100',
  receiptHeader: 'TechCell Prime - Assistência, Celulares e Acessórios Especializados',
  receiptFooter: 'Agradecemos pela preferência! Guarde este recibo para validação da sua garantia.',
  warrantyDefaultDays: 90,
  warrantyTerms: 'A garantia de 90 dias cobre exclusivamente defeitos de fabricação e hardware interno. Não cobre quedas, contato com líquidos, quebra de display, danos provocados por terceiros ou violação dos selos de garantia.',
  maxDiscountPercent: 15,
  defaultMinStock: 3,
};

const INITIAL_BRANDS: Brand[] = [
  { id: 'b1', code: 'APP', name: 'Apple', status: 'ativa', notes: 'iPhones, iPads, Apple Watches e cabos originais' },
  { id: 'b2', code: 'SAM', name: 'Samsung', status: 'ativa', notes: 'Linha Galaxy S, A, Z Flip e Fold' },
  { id: 'b3', code: 'XIA', name: 'Xiaomi', status: 'ativa', notes: 'Redmi, POCO e linha Xiaomi' },
  { id: 'b4', code: 'MOT', name: 'Motorola', status: 'ativa', notes: 'Moto G e Edge' },
  { id: 'b5', code: 'REA', name: 'Realme', status: 'ativa', notes: 'Smartphones e fones' },
  { id: 'b6', code: 'JBL', name: 'JBL', status: 'ativa', notes: 'Caixas de som e fones bluetooth' },
  { id: 'b7', code: 'ANK', name: 'Anker', status: 'ativa', notes: 'Carregadores de alta performance e baterias portáteis' },
  { id: 'b8', code: 'HOC', name: 'Hoco', status: 'ativa', notes: 'Capinhas, películas e cabos' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup_1', name: 'Distribuidora Alpha Tech Brasil', cnpjCpf: '12.345.678/0001-90', phone: '(11) 3210-9876', email: 'vendas@alphatech.com.br', contactPerson: 'Roberto' },
  { id: 'sup_2', name: 'MegaCell Importadora de Eletrônicos', cnpjCpf: '98.765.432/0001-11', phone: '(11) 4004-2020', email: 'comercial@megacell.com.br', contactPerson: 'Juliana' },
  { id: 'sup_3', name: 'Shield Acessórios e Películas LTDA', cnpjCpf: '45.678.901/0001-33', phone: '(19) 3876-5432', email: 'pedidos@shieldacessorios.com.br', contactPerson: 'Marcos' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    code: 'CEL-001',
    brandId: 'b1',
    brandName: 'Apple',
    model: 'iPhone 15 Pro 128GB',
    category: 'Smartphone',
    color: 'Titânio Natural',
    storage: '128GB',
    ram: '8GB',
    condition: 'Novo',
    hasImei: true,
    barcode: '7890100100012',
    supplierId: 'sup_1',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    entryDate: '2026-08-15',
    costPrice: 5800,
    sellPrice: 7299,
    minStock: 2,
    currentStock: 3,
    warrantyDays: 365,
    location: 'Cofre Vitrine A1',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
    notes: 'Aparelho lacrado na caixa com 1 ano de garantia Apple mundial'
  },
  {
    id: 'prod_2',
    code: 'CEL-002',
    brandId: 'b1',
    brandName: 'Apple',
    model: 'iPhone 13 128GB',
    category: 'Smartphone',
    color: 'Meia-Noite (Preto)',
    storage: '128GB',
    ram: '4GB',
    condition: 'Seminovo',
    hasImei: true,
    barcode: '7890100100029',
    supplierId: 'sup_2',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    entryDate: '2026-08-20',
    costPrice: 2400,
    sellPrice: 3390,
    minStock: 2,
    currentStock: 2,
    warrantyDays: 90,
    location: 'Gaveta Seminovo 02',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&auto=format&fit=crop&q=80',
    notes: 'Bateria 91%, tela sem riscos, carcaça impecável, testado 100%'
  },
  {
    id: 'prod_3',
    code: 'CEL-003',
    brandId: 'b2',
    brandName: 'Samsung',
    model: 'Galaxy S24 Ultra 256GB',
    category: 'Smartphone',
    color: 'Cinza Titânio',
    storage: '256GB',
    ram: '12GB',
    condition: 'Novo',
    hasImei: true,
    barcode: '7890100100036',
    supplierId: 'sup_1',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    entryDate: '2026-08-18',
    costPrice: 5100,
    sellPrice: 6599,
    minStock: 2,
    currentStock: 2,
    warrantyDays: 365,
    location: 'Vitrine Samsung B2',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80',
    notes: 'Com Galaxy AI e S-Pen inclusa, homologado Anatel'
  },
  {
    id: 'prod_4',
    code: 'CEL-004',
    brandId: 'b3',
    brandName: 'Xiaomi',
    model: 'Redmi Note 13 4G 128GB',
    category: 'Smartphone',
    color: 'Midnight Black',
    storage: '128GB',
    ram: '8GB',
    condition: 'Novo',
    hasImei: true,
    barcode: '7890100100043',
    supplierId: 'sup_2',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    entryDate: '2026-08-25',
    costPrice: 950,
    sellPrice: 1390,
    minStock: 3,
    currentStock: 4,
    warrantyDays: 180,
    location: 'Prateleira Xiaomi 01',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80',
    notes: 'Versão Global oficial'
  },
  {
    id: 'prod_5',
    code: 'CEL-005',
    brandId: 'b4',
    brandName: 'Motorola',
    model: 'Moto G84 5G 256GB',
    category: 'Smartphone',
    color: 'Viva Magenta',
    storage: '256GB',
    ram: '8GB',
    condition: 'Novo',
    hasImei: true,
    barcode: '7890100100050',
    supplierId: 'sup_1',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    entryDate: '2026-08-28',
    costPrice: 1100,
    sellPrice: 1599,
    minStock: 2,
    currentStock: 1, // low stock alert!
    warrantyDays: 365,
    location: 'Prateleira Motorola 02',
    imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&auto=format&fit=crop&q=80',
    notes: 'Acabamento em Vegan Leather'
  },
  {
    id: 'prod_6',
    code: 'ACS-001',
    brandId: 'b1',
    brandName: 'Apple',
    model: 'Carregador Turbo 20W USB-C',
    category: 'Carregador',
    color: 'Branco',
    condition: 'Novo',
    hasImei: false,
    barcode: '7890200100019',
    supplierId: 'sup_1',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    entryDate: '2026-08-10',
    costPrice: 95,
    sellPrice: 199,
    minStock: 5,
    currentStock: 18,
    warrantyDays: 90,
    location: 'Gancho Acessórios 04',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    notes: 'Fonte original Apple 20W'
  },
  {
    id: 'prod_7',
    code: 'ACS-002',
    brandId: 'b8',
    brandName: 'Hoco',
    model: 'Capinha MagSafe Transparente iPhone 15 Pro',
    category: 'Capinha',
    color: 'Transparente com anel prata',
    condition: 'Novo',
    hasImei: false,
    barcode: '7890200100026',
    supplierId: 'sup_3',
    supplierName: 'Shield Acessórios e Películas LTDA',
    entryDate: '2026-08-12',
    costPrice: 22,
    sellPrice: 79,
    minStock: 8,
    currentStock: 24,
    warrantyDays: 30,
    location: 'Expositor Capinhas 01',
    notes: 'Borda com airbag antichoque e ímã N52'
  },
  {
    id: 'prod_8',
    code: 'ACS-003',
    brandId: 'b8',
    brandName: 'Hoco',
    model: 'Película 3D Cerâmica / Vidro Temperado Universal',
    category: 'Película',
    color: 'Transparente',
    condition: 'Novo',
    hasImei: false,
    barcode: '7890200100033',
    supplierId: 'sup_3',
    supplierName: 'Shield Acessórios e Películas LTDA',
    entryDate: '2026-08-14',
    costPrice: 8,
    sellPrice: 45,
    minStock: 10,
    currentStock: 35,
    warrantyDays: 15,
    location: 'Gaveta de Aplicação',
    notes: 'Aplicação grátis na loja'
  },
  {
    id: 'prod_9',
    code: 'ACS-004',
    brandId: 'b6',
    brandName: 'JBL',
    model: 'Fone Bluetooth Tune 520BT',
    category: 'Fone',
    color: 'Preto',
    condition: 'Novo',
    hasImei: false,
    barcode: '7890200100040',
    supplierId: 'sup_2',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    entryDate: '2026-08-20',
    costPrice: 150,
    sellPrice: 279,
    minStock: 3,
    currentStock: 2, // Low stock!
    warrantyDays: 365,
    location: 'Vitrine de Áudio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    notes: 'Até 57h de bateria com Pure Bass Sound'
  },
  {
    id: 'prod_10',
    code: 'ACS-005',
    brandId: 'b7',
    brandName: 'Anker',
    model: 'Cabo USB-C para USB-C 100W 1.8m Trançado',
    category: 'Cabo',
    color: 'Cinza Escuro',
    condition: 'Novo',
    hasImei: false,
    barcode: '7890200100057',
    supplierId: 'sup_2',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    entryDate: '2026-08-22',
    costPrice: 38,
    sellPrice: 99,
    minStock: 5,
    currentStock: 0, // Out of stock alert!
    warrantyDays: 180,
    location: 'Gancho Acessórios 02',
    notes: 'Power Delivery até 100W, nylon reforçado'
  }
];

const INITIAL_IMEIS: IMEIItem[] = [
  // iPhone 15 Pro (prod_1)
  {
    id: 'imei_1',
    imei: '354890123456781',
    imei2: '354890123456782',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB',
    model: 'iPhone 15 Pro 128GB',
    brandName: 'Apple',
    color: 'Titânio Natural',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 5800,
    sellPrice: 7299,
    entryDate: '2026-08-15',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    notes: 'Lacrado A2848'
  },
  {
    id: 'imei_2',
    imei: '354890123456783',
    imei2: '354890123456784',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB',
    model: 'iPhone 15 Pro 128GB',
    brandName: 'Apple',
    color: 'Titânio Natural',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 5800,
    sellPrice: 7299,
    entryDate: '2026-08-15',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    notes: 'Lacrado A2848'
  },
  {
    id: 'imei_3',
    imei: '354890123456785',
    imei2: '354890123456786',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB',
    model: 'iPhone 15 Pro 128GB',
    brandName: 'Apple',
    color: 'Titânio Natural',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 5800,
    sellPrice: 7299,
    entryDate: '2026-08-15',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    notes: 'Lacrado A2848'
  },
  // iPhone 13 Seminovo (prod_2)
  {
    id: 'imei_4',
    imei: '359812345678901',
    imei2: '359812345678902',
    productId: 'prod_2',
    productName: 'iPhone 13 128GB',
    model: 'iPhone 13 128GB',
    brandName: 'Apple',
    color: 'Meia-Noite (Preto)',
    storage: '128GB',
    condition: 'Seminovo',
    status: 'disponivel',
    costPrice: 2400,
    sellPrice: 3390,
    entryDate: '2026-08-20',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    notes: 'Saúde bateria 93%, Face ID 100%'
  },
  {
    id: 'imei_5',
    imei: '359812345678903',
    productId: 'prod_2',
    productName: 'iPhone 13 128GB',
    model: 'iPhone 13 128GB',
    brandName: 'Apple',
    color: 'Meia-Noite (Preto)',
    storage: '128GB',
    condition: 'Seminovo',
    status: 'disponivel',
    costPrice: 2400,
    sellPrice: 3390,
    entryDate: '2026-08-20',
    supplierName: 'MegaCell Importadora de Eletrônicos',
    notes: 'Saúde bateria 89%, revisado'
  },
  // S24 Ultra (prod_3)
  {
    id: 'imei_6',
    imei: '356789012345671',
    imei2: '356789012345672',
    productId: 'prod_3',
    productName: 'Galaxy S24 Ultra 256GB',
    model: 'Galaxy S24 Ultra 256GB',
    brandName: 'Samsung',
    color: 'Cinza Titânio',
    storage: '256GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 5100,
    sellPrice: 6599,
    entryDate: '2026-08-18',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    notes: 'Anatel Oficial'
  },
  {
    id: 'imei_7',
    imei: '356789012345673',
    imei2: '356789012345674',
    productId: 'prod_3',
    productName: 'Galaxy S24 Ultra 256GB',
    model: 'Galaxy S24 Ultra 256GB',
    brandName: 'Samsung',
    color: 'Cinza Titânio',
    storage: '256GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 5100,
    sellPrice: 6599,
    entryDate: '2026-08-18',
    supplierName: 'Distribuidora Alpha Tech Brasil',
    notes: 'Anatel Oficial'
  },
  // Redmi Note 13 (prod_4)
  {
    id: 'imei_8',
    imei: '864210987654321',
    imei2: '864210987654322',
    productId: 'prod_4',
    productName: 'Redmi Note 13 4G 128GB',
    model: 'Redmi Note 13 4G 128GB',
    brandName: 'Xiaomi',
    color: 'Midnight Black',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 950,
    sellPrice: 1390,
    entryDate: '2026-08-25',
    supplierName: 'MegaCell Importadora de Eletrônicos'
  },
  {
    id: 'imei_9',
    imei: '864210987654323',
    imei2: '864210987654324',
    productId: 'prod_4',
    productName: 'Redmi Note 13 4G 128GB',
    model: 'Redmi Note 13 4G 128GB',
    brandName: 'Xiaomi',
    color: 'Midnight Black',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 950,
    sellPrice: 1390,
    entryDate: '2026-08-25',
    supplierName: 'MegaCell Importadora de Eletrônicos'
  },
  {
    id: 'imei_10',
    imei: '864210987654325',
    imei2: '864210987654326',
    productId: 'prod_4',
    productName: 'Redmi Note 13 4G 128GB',
    model: 'Redmi Note 13 4G 128GB',
    brandName: 'Xiaomi',
    color: 'Midnight Black',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 950,
    sellPrice: 1390,
    entryDate: '2026-08-25',
    supplierName: 'MegaCell Importadora de Eletrônicos'
  },
  {
    id: 'imei_11',
    imei: '864210987654327',
    imei2: '864210987654328',
    productId: 'prod_4',
    productName: 'Redmi Note 13 4G 128GB',
    model: 'Redmi Note 13 4G 128GB',
    brandName: 'Xiaomi',
    color: 'Midnight Black',
    storage: '128GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 950,
    sellPrice: 1390,
    entryDate: '2026-08-25',
    supplierName: 'MegaCell Importadora de Eletrônicos'
  },
  // Moto G84 (prod_5)
  {
    id: 'imei_12',
    imei: '358765432109871',
    productId: 'prod_5',
    productName: 'Moto G84 5G 256GB',
    model: 'Moto G84 5G 256GB',
    brandName: 'Motorola',
    color: 'Viva Magenta',
    storage: '256GB',
    condition: 'Novo',
    status: 'disponivel',
    costPrice: 1100,
    sellPrice: 1599,
    entryDate: '2026-08-28',
    supplierName: 'Distribuidora Alpha Tech Brasil'
  }
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_1',
    code: 'CLI-001',
    name: 'Bruno Henrique Santoro',
    cpfCnpj: '123.456.789-00',
    birthDate: '1992-05-14',
    phone: '(11) 98765-1122',
    whatsapp: '(11) 98765-1122',
    email: 'bruno.santoro@gmail.com',
    cep: '04538-133',
    address: 'Rua Joaquim Floriano',
    number: '466',
    complement: 'Apto 82',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Cliente VIP, sempre adquire celulares topo de linha e capinhas originais.',
    createdAt: '2026-01-10',
    totalPurchased: 8490,
    openBalance: 0,
    lastPurchaseDate: '2026-08-20'
  },
  {
    id: 'cli_2',
    code: 'CLI-002',
    name: 'Fernanda Lima Alcantara',
    cpfCnpj: '234.567.890-11',
    birthDate: '1988-11-23',
    phone: '(11) 97654-3344',
    whatsapp: '(11) 97654-3344',
    email: 'fernanda.alcantara@hotmail.com',
    cep: '01414-001',
    address: 'Rua Haddock Lobo',
    number: '1307',
    complement: 'Conjunto 41',
    neighborhood: 'Cerqueira César',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Preferência por pagamento misto (PIX + Cartão parcelado).',
    createdAt: '2026-02-15',
    totalPurchased: 4580,
    openBalance: 750, // Has pending installments
    lastPurchaseDate: '2026-08-28'
  },
  {
    id: 'cli_3',
    code: 'CLI-003',
    name: 'Consumidor Final (Balcão)',
    cpfCnpj: '000.000.000-00',
    phone: '(11) 0000-0000',
    whatsapp: '(11) 0000-0000',
    email: 'balcao@techcellprime.com.br',
    cep: '01310-100',
    address: 'Venda de Balcão Loja',
    number: '1250',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Cadastro genérico padrão para vendas rápidas à vista sem necessidade de CPF',
    createdAt: '2026-01-01',
    totalPurchased: 12450,
    openBalance: 0,
    lastPurchaseDate: '2026-09-08'
  },
  {
    id: 'cli_4',
    code: 'CLI-004',
    name: 'Gabriel Martins Duarte',
    cpfCnpj: '345.678.901-22',
    birthDate: '1995-03-09',
    phone: '(11) 96543-2211',
    whatsapp: '(11) 96543-2211',
    email: 'gabriel.duarte@empresa.com.br',
    cep: '05407-002',
    address: 'Rua dos Pinheiros',
    number: '820',
    complement: 'Sala 3',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Comprador corporativo de aparelhos para equipe externa.',
    createdAt: '2026-03-01',
    totalPurchased: 6890,
    openBalance: 0,
    lastPurchaseDate: '2026-08-15'
  }
];

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale_1',
    code: 'VENDA-2026-0001',
    date: '2026-08-20T14:30:00Z',
    clientId: 'cli_1',
    clientName: 'Bruno Henrique Santoro',
    clientCpf: '123.456.789-00',
    clientPhone: '(11) 98765-1122',
    items: [
      {
        productId: 'prod_1',
        productName: 'iPhone 15 Pro 128GB Titânio Natural',
        brandName: 'Apple',
        model: 'iPhone 15 Pro 128GB',
        category: 'Smartphone',
        imei: '354890123456770',
        condition: 'Novo',
        quantity: 1,
        unitPrice: 7299,
        discount: 299,
        total: 7000,
        costPrice: 5800
      },
      {
        productId: 'prod_7',
        productName: 'Capinha MagSafe Transparente iPhone 15 Pro',
        brandName: 'Hoco',
        model: 'Capinha MagSafe',
        category: 'Capinha',
        quantity: 1,
        unitPrice: 79,
        discount: 0,
        total: 79,
        costPrice: 22
      },
      {
        productId: 'prod_8',
        productName: 'Película 3D Cerâmica / Vidro Temperado Universal',
        brandName: 'Hoco',
        model: 'Película 3D',
        category: 'Película',
        quantity: 1,
        unitPrice: 45,
        discount: 5,
        total: 40,
        costPrice: 8
      }
    ],
    subtotal: 7423,
    discount: 304,
    total: 7119,
    payments: [
      { id: 'p_1', method: 'PIX', amount: 3119 },
      { id: 'p_2', method: 'Cartão de Crédito', amount: 4000, installmentsCount: 4 }
    ],
    change: 0,
    status: 'concluida',
    sellerName: 'Lucas Ferreira',
    sellerId: 'usr_3',
    warrantyDays: 365,
    notes: 'Aparelho ativado na loja, película aplicada com sucesso.'
  },
  {
    id: 'sale_2',
    code: 'VENDA-2026-0002',
    date: '2026-08-28T16:15:00Z',
    clientId: 'cli_2',
    clientName: 'Fernanda Lima Alcantara',
    clientCpf: '234.567.890-11',
    clientPhone: '(11) 97654-3344',
    items: [
      {
        productId: 'prod_2',
        productName: 'iPhone 13 128GB Meia-Noite',
        brandName: 'Apple',
        model: 'iPhone 13 128GB',
        category: 'Smartphone',
        imei: '359812345678888',
        condition: 'Seminovo',
        quantity: 1,
        unitPrice: 3390,
        discount: 140,
        total: 3250,
        costPrice: 2400
      },
      {
        productId: 'prod_6',
        productName: 'Carregador Turbo 20W USB-C',
        brandName: 'Apple',
        model: 'Carregador 20W',
        category: 'Carregador',
        quantity: 1,
        unitPrice: 199,
        discount: 19,
        total: 180,
        costPrice: 95
      }
    ],
    subtotal: 3589,
    discount: 159,
    total: 3430,
    payments: [
      { id: 'p_3', method: 'Dinheiro', amount: 1000 },
      { id: 'p_4', method: 'PIX', amount: 930 },
      { id: 'p_5', method: 'Fiado / Crediário', amount: 1500, installmentsCount: 2 }
    ],
    change: 0,
    status: 'concluida',
    sellerName: 'Mariana Silva',
    sellerId: 'usr_2',
    warrantyDays: 90,
    notes: 'Entrada de R$ 1.930 e saldo de R$ 1.500 dividido em 2x no carnê da loja.'
  }
];

const INITIAL_INSTALLMENTS: Installment[] = [
  {
    id: 'inst_1',
    saleId: 'sale_2',
    saleCode: 'VENDA-2026-0002',
    clientName: 'Fernanda Lima Alcantara',
    installmentNumber: 1,
    totalInstallments: 2,
    amount: 750,
    dueDate: '2026-09-28',
    paidAmount: 0,
    status: 'Pendente'
  },
  {
    id: 'inst_2',
    saleId: 'sale_2',
    saleCode: 'VENDA-2026-0002',
    clientName: 'Fernanda Lima Alcantara',
    installmentNumber: 2,
    totalInstallments: 2,
    amount: 750,
    dueDate: '2026-10-28',
    paidAmount: 0,
    status: 'Pendente'
  }
];

const INITIAL_ACCOUNTS_RECEIVABLE: AccountReceivable[] = [
  {
    id: 'rec_1',
    saleId: 'sale_2',
    saleCode: 'VENDA-2026-0002',
    clientId: 'cli_2',
    clientName: 'Fernanda Lima Alcantara',
    clientPhone: '(11) 97654-3344',
    installmentNumber: 1,
    totalInstallments: 2,
    amount: 750,
    dueDate: '2026-09-28',
    paidAmount: 0,
    balance: 750,
    status: 'Pendente'
  },
  {
    id: 'rec_2',
    saleId: 'sale_2',
    saleCode: 'VENDA-2026-0002',
    clientId: 'cli_2',
    clientName: 'Fernanda Lima Alcantara',
    clientPhone: '(11) 97654-3344',
    installmentNumber: 2,
    totalInstallments: 2,
    amount: 750,
    dueDate: '2026-10-28',
    paidAmount: 0,
    balance: 750,
    status: 'Pendente'
  },
  {
    id: 'rec_3',
    saleId: 'sale_old',
    saleCode: 'VENDA-2026-0000',
    clientId: 'cli_4',
    clientName: 'Gabriel Martins Duarte',
    clientPhone: '(11) 96543-2211',
    installmentNumber: 1,
    totalInstallments: 1,
    amount: 350,
    dueDate: '2026-09-01', // Overdue!
    paidAmount: 0,
    balance: 350,
    status: 'Vencido'
  }
];

const INITIAL_ACCOUNTS_PAYABLE: AccountPayable[] = [
  {
    id: 'pay_1',
    supplier: 'Distribuidora Alpha Tech Brasil',
    description: 'Fatura NF 48291 - Reposição de iPhones e Galaxys',
    category: 'Mercadorias para Revenda',
    amount: 10900,
    dueDate: '2026-09-20',
    paymentMethod: 'Boleto',
    status: 'Pendente',
    paidAmount: 0,
    notes: 'Parcela 2 de 3'
  },
  {
    id: 'pay_2',
    supplier: 'Edifício Paulista Corporate',
    description: 'Aluguel do Ponto Comercial + Condomínio',
    category: 'Despesas Fixas',
    amount: 4500,
    dueDate: '2026-09-10',
    paymentMethod: 'Boleto',
    status: 'Pendente',
    paidAmount: 0
  },
  {
    id: 'pay_3',
    supplier: 'Enel Distribuição São Paulo',
    description: 'Energia Elétrica Loja - Ref Agosto',
    category: 'Utilidades',
    amount: 485.60,
    dueDate: '2026-09-05',
    paymentMethod: 'PIX',
    status: 'Pago',
    paidAmount: 485.60,
    paidDate: '2026-09-05'
  }
];

const INITIAL_CASH_REGISTERS: CashRegister[] = [
  {
    id: 'cx_001',
    openedAt: '2026-09-08T08:30:00Z',
    openedBy: 'Carlos Mendes (Admin)',
    initialBalance: 400.00,
    status: 'aberto',
    entries: 4920.00,
    exits: 250.00,
    currentBalance: 5070.00,
  }
];

const INITIAL_CASH_MOVEMENTS: CashMovement[] = [
  {
    id: 'cm_1',
    cashRegisterId: 'cx_001',
    date: '2026-09-08T08:30:00Z',
    type: 'entrada',
    category: 'Abertura de Caixa',
    amount: 400.00,
    description: 'Troco inicial de abertura do caixa',
    paymentMethod: 'Dinheiro',
    userName: 'Carlos Mendes (Admin)'
  },
  {
    id: 'cm_2',
    cashRegisterId: 'cx_001',
    date: '2026-09-08T10:15:00Z',
    type: 'entrada',
    category: 'Venda à Vista',
    amount: 1390.00,
    description: 'Venda de Redmi Note 13',
    paymentMethod: 'PIX',
    userName: 'Lucas Ferreira'
  },
  {
    id: 'cm_3',
    cashRegisterId: 'cx_001',
    date: '2026-09-08T11:40:00Z',
    type: 'saida',
    category: 'Sangria / Despesa',
    amount: 250.00,
    description: 'Compra de material de limpeza e suprimentos de balcão',
    paymentMethod: 'Dinheiro',
    userName: 'Mariana Silva'
  },
  {
    id: 'cm_4',
    cashRegisterId: 'cx_001',
    date: '2026-09-08T15:20:00Z',
    type: 'entrada',
    category: 'Venda de Acessórios',
    amount: 279.00,
    description: 'Venda Fone JBL Tune 520BT',
    paymentMethod: 'Cartão de Débito',
    userName: 'Lucas Ferreira'
  }
];

const INITIAL_WARRANTIES: Warranty[] = [
  {
    id: 'warr_1',
    saleId: 'sale_1',
    saleCode: 'VENDA-2026-0001',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB Titânio Natural',
    imei: '354890123456770',
    clientId: 'cli_1',
    clientName: 'Bruno Henrique Santoro',
    clientCpf: '123.456.789-00',
    saleDate: '2026-08-20',
    warrantyDays: 365,
    endDate: '2027-08-20',
    status: 'Ativa',
    terms: 'Garantia legal de 90 dias + garantia contratual de fábrica Apple.'
  },
  {
    id: 'warr_2',
    saleId: 'sale_2',
    saleCode: 'VENDA-2026-0002',
    productId: 'prod_2',
    productName: 'iPhone 13 128GB Meia-Noite (Seminovo)',
    imei: '359812345678888',
    clientId: 'cli_2',
    clientName: 'Fernanda Lima Alcantara',
    clientCpf: '234.567.890-11',
    saleDate: '2026-08-28',
    warrantyDays: 90,
    endDate: '2026-11-26',
    status: 'Ativa',
    terms: 'Garantia de 90 dias balcão para peças e funcionamento de placa e display.'
  },
  {
    id: 'warr_3',
    saleId: 'sale_old',
    saleCode: 'VENDA-2026-0000',
    productId: 'prod_4',
    productName: 'Redmi Note 12 128GB',
    imei: '864210987654111',
    clientId: 'cli_4',
    clientName: 'Gabriel Martins Duarte',
    clientCpf: '345.678.901-22',
    saleDate: '2026-06-15',
    warrantyDays: 90,
    endDate: '2026-09-13', // Ends in 5 days!
    status: 'Próxima do vencimento',
    terms: 'Garantia de 90 dias para defeitos de fabricação.'
  }
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov_1',
    date: '2026-08-15T09:00:00Z',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB Titânio Natural',
    imei: '354890123456781',
    type: 'entrada',
    quantity: 3,
    costPrice: 5800,
    sellPrice: 7299,
    reason: 'Entrada NF 48291 Distribuidora Alpha Tech',
    userName: 'Rafael Oliveira',
    userId: 'usr_4'
  },
  {
    id: 'mov_2',
    date: '2026-08-20T14:30:00Z',
    productId: 'prod_1',
    productName: 'iPhone 15 Pro 128GB Titânio Natural',
    imei: '354890123456770',
    type: 'venda',
    quantity: 1,
    costPrice: 5800,
    sellPrice: 7000,
    reason: 'Venda VENDA-2026-0001',
    userName: 'Lucas Ferreira',
    userId: 'usr_3'
  },
  {
    id: 'mov_3',
    date: '2026-08-28T16:15:00Z',
    productId: 'prod_2',
    productName: 'iPhone 13 128GB Meia-Noite (Seminovo)',
    imei: '359812345678888',
    type: 'venda',
    quantity: 1,
    costPrice: 2400,
    sellPrice: 3250,
    reason: 'Venda VENDA-2026-0002',
    userName: 'Mariana Silva',
    userId: 'usr_2'
  }
];

// Storage Engine Implementation
class RelationalDatabaseEngine {
  private users: User[] = [];
  private clients: Client[] = [];
  private brands: Brand[] = [];
  private suppliers: Supplier[] = [];
  private products: Product[] = [];
  private imeis: IMEIItem[] = [];
  private sales: Sale[] = [];
  private installments: Installment[] = [];
  private accountsReceivable: AccountReceivable[] = [];
  private accountsPayable: AccountPayable[] = [];
  private cashRegisters: CashRegister[] = [];
  private cashMovements: CashMovement[] = [];
  private warranties: Warranty[] = [];
  private movements: StockMovement[] = [];
  private entries: ProductEntry[] = [];
  private exchanges: ExchangeReturn[] = [];
  private settings: StoreSettings = INITIAL_SETTINGS;
  private currentUser: User = INITIAL_USERS[0];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedClients = localStorage.getItem(STORAGE_KEY_PREFIX + 'clients');
      this.clients = storedClients ? JSON.parse(storedClients) : INITIAL_CLIENTS;

      const storedBrands = localStorage.getItem(STORAGE_KEY_PREFIX + 'brands');
      this.brands = storedBrands ? JSON.parse(storedBrands) : INITIAL_BRANDS;

      const storedSuppliers = localStorage.getItem(STORAGE_KEY_PREFIX + 'suppliers');
      this.suppliers = storedSuppliers ? JSON.parse(storedSuppliers) : INITIAL_SUPPLIERS;

      const storedProducts = localStorage.getItem(STORAGE_KEY_PREFIX + 'products');
      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;

      const storedImeis = localStorage.getItem(STORAGE_KEY_PREFIX + 'imeis');
      this.imeis = storedImeis ? JSON.parse(storedImeis) : INITIAL_IMEIS;

      const storedSales = localStorage.getItem(STORAGE_KEY_PREFIX + 'sales');
      this.sales = storedSales ? JSON.parse(storedSales) : INITIAL_SALES;

      const storedInstallments = localStorage.getItem(STORAGE_KEY_PREFIX + 'installments');
      this.installments = storedInstallments ? JSON.parse(storedInstallments) : INITIAL_INSTALLMENTS;

      const storedReceivable = localStorage.getItem(STORAGE_KEY_PREFIX + 'receivable');
      this.accountsReceivable = storedReceivable ? JSON.parse(storedReceivable) : INITIAL_ACCOUNTS_RECEIVABLE;

      const storedPayable = localStorage.getItem(STORAGE_KEY_PREFIX + 'payable');
      this.accountsPayable = storedPayable ? JSON.parse(storedPayable) : INITIAL_ACCOUNTS_PAYABLE;

      const storedCashRegisters = localStorage.getItem(STORAGE_KEY_PREFIX + 'cash_registers');
      this.cashRegisters = storedCashRegisters ? JSON.parse(storedCashRegisters) : INITIAL_CASH_REGISTERS;

      const storedCashMovements = localStorage.getItem(STORAGE_KEY_PREFIX + 'cash_movements');
      this.cashMovements = storedCashMovements ? JSON.parse(storedCashMovements) : INITIAL_CASH_MOVEMENTS;

      const storedWarranties = localStorage.getItem(STORAGE_KEY_PREFIX + 'warranties');
      this.warranties = storedWarranties ? JSON.parse(storedWarranties) : INITIAL_WARRANTIES;

      const storedMovements = localStorage.getItem(STORAGE_KEY_PREFIX + 'movements');
      this.movements = storedMovements ? JSON.parse(storedMovements) : INITIAL_MOVEMENTS;

      const storedEntries = localStorage.getItem(STORAGE_KEY_PREFIX + 'entries');
      this.entries = storedEntries ? JSON.parse(storedEntries) : [];

      const storedExchanges = localStorage.getItem(STORAGE_KEY_PREFIX + 'exchanges');
      this.exchanges = storedExchanges ? JSON.parse(storedExchanges) : [];

      const storedSettings = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
      this.settings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS;

      const storedUserId = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user_id');
      if (storedUserId) {
        const found = this.users.find((u) => u.id === storedUserId);
        if (found) this.currentUser = found;
      }
    } catch {
      // Fallback in case of storage quota or parsing errors
      this.users = INITIAL_USERS;
      this.clients = INITIAL_CLIENTS;
      this.brands = INITIAL_BRANDS;
      this.suppliers = INITIAL_SUPPLIERS;
      this.products = INITIAL_PRODUCTS;
      this.imeis = INITIAL_IMEIS;
      this.sales = INITIAL_SALES;
      this.installments = INITIAL_INSTALLMENTS;
      this.accountsReceivable = INITIAL_ACCOUNTS_RECEIVABLE;
      this.accountsPayable = INITIAL_ACCOUNTS_PAYABLE;
      this.cashRegisters = INITIAL_CASH_REGISTERS;
      this.cashMovements = INITIAL_CASH_MOVEMENTS;
      this.warranties = INITIAL_WARRANTIES;
      this.movements = INITIAL_MOVEMENTS;
      this.settings = INITIAL_SETTINGS;
      this.currentUser = INITIAL_USERS[0];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'clients', JSON.stringify(this.clients));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'brands', JSON.stringify(this.brands));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'suppliers', JSON.stringify(this.suppliers));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'imeis', JSON.stringify(this.imeis));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'sales', JSON.stringify(this.sales));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'installments', JSON.stringify(this.installments));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'receivable', JSON.stringify(this.accountsReceivable));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'payable', JSON.stringify(this.accountsPayable));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'cash_registers', JSON.stringify(this.cashRegisters));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'cash_movements', JSON.stringify(this.cashMovements));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'warranties', JSON.stringify(this.warranties));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'movements', JSON.stringify(this.movements));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'entries', JSON.stringify(this.entries));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'exchanges', JSON.stringify(this.exchanges));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user_id', this.currentUser.id);
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  // Current User & Permissions
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.notify();
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public saveUser(user: User) {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = user;
    } else {
      this.users.push(user);
    }
    if (this.currentUser.id === user.id) {
      this.currentUser = user;
    }
    this.notify();
  }

  // Store Settings
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: StoreSettings) {
    this.settings = newSettings;
    this.notify();
  }

  // Brands
  public getBrands(): Brand[] {
    return [...this.brands];
  }

  public saveBrand(brand: Brand) {
    const idx = this.brands.findIndex((b) => b.id === brand.id);
    if (idx >= 0) {
      this.brands[idx] = brand;
    } else {
      this.brands.push(brand);
    }
    this.notify();
  }

  public deleteBrand(brandId: string) {
    // Check if products exist with this brand
    const inUse = this.products.some((p) => p.brandId === brandId);
    if (inUse) {
      throw new Error('Não é possível excluir esta marca pois há produtos vinculados a ela.');
    }
    this.brands = this.brands.filter((b) => b.id !== brandId);
    this.notify();
  }

  // Suppliers
  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public saveSupplier(supplier: Supplier) {
    const idx = this.suppliers.findIndex((s) => s.id === supplier.id);
    if (idx >= 0) {
      this.suppliers[idx] = supplier;
    } else {
      this.suppliers.push(supplier);
    }
    this.notify();
  }

  // Clients
  public getClients(): Client[] {
    return [...this.clients];
  }

  public getClientById(id: string): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }

  public saveClient(client: Client) {
    const idx = this.clients.findIndex((c) => c.id === client.id);
    if (idx >= 0) {
      this.clients[idx] = client;
    } else {
      this.clients.push(client);
    }
    this.notify();
  }

  public deleteClient(clientId: string) {
    // Check if client has sales or debts
    const hasSales = this.sales.some((s) => s.clientId === clientId);
    if (hasSales) {
      throw new Error('Não é possível excluir cliente com histórico de vendas.');
    }
    this.clients = this.clients.filter((c) => c.id !== clientId);
    this.notify();
  }

  // Products & IMEIs
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getImeis(productId?: string): IMEIItem[] {
    if (productId) {
      return this.imeis.filter((i) => i.productId === productId);
    }
    return [...this.imeis];
  }

  public getAvailableImeis(productId: string): IMEIItem[] {
    return this.imeis.filter((i) => i.productId === productId && i.status === 'disponivel');
  }

  public saveProduct(product: Product) {
    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.products[idx] = product;
    } else {
      this.products.push(product);
    }
    this.notify();
  }

  public deleteProduct(productId: string) {
    const hasSales = this.sales.some((s) => s.items.some((it) => it.productId === productId));
    if (hasSales) {
      throw new Error('Não é possível excluir produto com histórico de vendas.');
    }
    this.products = this.products.filter((p) => p.id !== productId);
    this.imeis = this.imeis.filter((i) => i.productId !== productId);
    this.notify();
  }

  // Stock Movement & Validation Rules
  public addStockMovement(mov: Omit<StockMovement, 'id' | 'date' | 'userName' | 'userId'>) {
    const newMovement: StockMovement = {
      ...mov,
      id: 'mov_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
      userName: this.currentUser.name,
      userId: this.currentUser.id,
    };
    this.movements.unshift(newMovement);
  }

  public getMovements(): StockMovement[] {
    return [...this.movements];
  }

  // Register Product Entry (Entrada de Mercadoria)
  public registerProductEntry(params: {
    supplierName: string;
    invoiceNumber: string;
    productId: string;
    quantity: number;
    unitCost: number;
    paymentMethod: PaymentMethod;
    imeis?: string[];
    notes?: string;
  }) {
    const product = this.getProductById(params.productId);
    if (!product) throw new Error('Produto não encontrado.');

    const totalCost = params.unitCost * params.quantity;

    // If product requires IMEIs, validate count and duplicates
    if (product.hasImei) {
      if (!params.imeis || params.imeis.length !== params.quantity) {
        throw new Error(`Para este aparelho é obrigatório informar exatamente ${params.quantity} IMEI(s).`);
      }

      for (const imeiNumber of params.imeis) {
        const cleanImei = imeiNumber.trim();
        if (!cleanImei) throw new Error('IMEI inválido ou vazio informado.');
        const exists = this.imeis.some((i) => i.imei === cleanImei);
        if (exists) {
          throw new Error(`O IMEI ${cleanImei} já está cadastrado no sistema.`);
        }

        const newImeiItem: IMEIItem = {
          id: 'imei_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          imei: cleanImei,
          productId: product.id,
          productName: product.model,
          model: product.model,
          brandName: product.brandName,
          color: product.color,
          storage: product.storage,
          condition: product.condition,
          status: 'disponivel',
          costPrice: params.unitCost,
          sellPrice: product.sellPrice,
          entryDate: new Date().toISOString().split('T')[0],
          supplierName: params.supplierName,
          notes: params.notes,
        };
        this.imeis.push(newImeiItem);
      }
    }

    // Update Product Stock and Cost
    product.currentStock += params.quantity;
    product.costPrice = params.unitCost;

    // Log Stock Movement
    this.addStockMovement({
      productId: product.id,
      productName: product.model,
      type: 'entrada',
      quantity: params.quantity,
      costPrice: params.unitCost,
      sellPrice: product.sellPrice,
      reason: `Entrada NF: ${params.invoiceNumber} - Fornecedor: ${params.supplierName}`,
      notes: params.notes,
    });

    // Record Entry History
    const newEntry: ProductEntry = {
      id: 'ent_' + Date.now(),
      date: new Date().toISOString(),
      supplierName: params.supplierName,
      invoiceNumber: params.invoiceNumber,
      productId: product.id,
      productName: product.model,
      brandName: product.brandName,
      imeis: params.imeis || [],
      quantity: params.quantity,
      unitCost: params.unitCost,
      totalCost,
      paymentMethod: params.paymentMethod,
      notes: params.notes,
      userName: this.currentUser.name,
    };
    this.entries.unshift(newEntry);

    // Record Accounts Payable if not paid in cash/pix
    if (params.paymentMethod === 'Boleto' || params.paymentMethod === 'Fiado / Crediário') {
      const payable: AccountPayable = {
        id: 'pay_' + Date.now(),
        supplier: params.supplierName,
        description: `Entrada de Mercadorias NF ${params.invoiceNumber} - ${product.model}`,
        category: 'Mercadorias para Revenda',
        amount: totalCost,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: params.paymentMethod,
        status: 'Pendente',
        paidAmount: 0,
        notes: params.notes,
      };
      this.accountsPayable.unshift(payable);
    } else {
      // Deduct from open cash register if cash
      const openReg = this.getActiveCashRegister();
      if (openReg && params.paymentMethod === 'Dinheiro') {
        openReg.exits += totalCost;
        openReg.currentBalance -= totalCost;
        this.cashMovements.unshift({
          id: 'cm_' + Date.now(),
          cashRegisterId: openReg.id,
          date: new Date().toISOString(),
          type: 'saida',
          category: 'Compra de Mercadoria',
          amount: totalCost,
          description: `Pagamento NF ${params.invoiceNumber} (${product.model})`,
          paymentMethod: params.paymentMethod,
          userName: this.currentUser.name,
        });
      }
    }

    this.notify();
    return newEntry;
  }

  public getProductEntries(): ProductEntry[] {
    return [...this.entries];
  }

  // Register Stock Exit (Saída de Produtos)
  public registerStockExit(params: {
    productId: string;
    quantity: number;
    imei?: string;
    reason: 'Troca' | 'Devolução ao fornecedor' | 'Produto danificado' | 'Perda' | 'Uso interno' | 'Ajuste de estoque' | 'Outros';
    notes?: string;
  }) {
    const product = this.getProductById(params.productId);
    if (!product) throw new Error('Produto não encontrado.');

    if (product.currentStock < params.quantity) {
      throw new Error(`Estoque insuficiente. Estoque atual: ${product.currentStock}`);
    }

    if (product.hasImei) {
      if (!params.imei) throw new Error('É necessário selecionar o IMEI do aparelho a dar saída.');
      const imeiItem = this.imeis.find((i) => i.imei === params.imei && i.productId === product.id);
      if (!imeiItem) throw new Error('IMEI não encontrado para este produto.');
      if (imeiItem.status !== 'disponivel') {
        throw new Error(`Este IMEI não está disponível (Status atual: ${imeiItem.status}).`);
      }

      imeiItem.status = params.reason === 'Produto danificado' ? 'danificado' : 'devolvido';
      imeiItem.notes = (imeiItem.notes ? imeiItem.notes + ' | ' : '') + `Saída por: ${params.reason} (${params.notes || ''})`;
    }

    product.currentStock -= params.quantity;

    this.addStockMovement({
      productId: product.id,
      productName: product.model,
      imei: params.imei,
      type: 'saida',
      quantity: params.quantity,
      costPrice: product.costPrice,
      sellPrice: product.sellPrice,
      reason: `Saída de estoque: ${params.reason}`,
      notes: params.notes,
    });

    this.notify();
  }

  // SALES ENGINE & PDV
  public executeSale(params: {
    clientId: string;
    items: SaleItem[];
    discount: number;
    payments: SalePayment[];
    notes?: string;
    installmentsCount?: number;
    firstDueDate?: string;
  }): Sale {
    if (!params.items || params.items.length === 0) {
      throw new Error('Não há itens na venda.');
    }

    const client = this.getClientById(params.clientId);
    if (!client) throw new Error('Cliente não encontrado.');

    // 1. Validate Stock and IMEIs strictly
    const imeiSet = new Set<string>();
    for (const item of params.items) {
      const product = this.getProductById(item.productId);
      if (!product) throw new Error(`Produto ${item.productName} não existe.`);

      if (product.currentStock < item.quantity) {
        throw new Error(`Estoque esgotado para o produto ${product.model}. Disponível: ${product.currentStock}`);
      }

      if (product.hasImei) {
        if (!item.imei) {
          throw new Error(`Selecione o IMEI para o aparelho ${product.model}.`);
        }
        if (imeiSet.has(item.imei)) {
          throw new Error(`O IMEI ${item.imei} foi adicionado mais de uma vez na mesma venda!`);
        }
        imeiSet.add(item.imei);

        const imeiItem = this.imeis.find((i) => i.imei === item.imei && i.productId === product.id);
        if (!imeiItem) {
          throw new Error(`IMEI ${item.imei} não pertence ao produto ${product.model}.`);
        }
        if (imeiItem.status !== 'disponivel') {
          throw new Error(`O IMEI ${item.imei} já foi vendido ou não está disponível (Status: ${imeiItem.status})!`);
        }
      }
    }

    // 2. Financial calculation
    const subtotal = params.items.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
    const itemDiscounts = params.items.reduce((acc, it) => acc + (it.discount || 0), 0);
    const totalDiscount = itemDiscounts + (params.discount || 0);
    const total = Math.max(0, subtotal - totalDiscount);

    const totalPaid = params.payments.reduce((acc, p) => acc + p.amount, 0);
    if (Math.abs(totalPaid - total) > 0.05) {
      throw new Error(`A soma dos pagamentos (R$ ${totalPaid.toFixed(2)}) deve ser igual ao total da venda (R$ ${total.toFixed(2)}).`);
    }

    // Check discount limit
    const discountPercent = (totalDiscount / subtotal) * 100;
    if (discountPercent > this.settings.maxDiscountPercent && !this.currentUser.permissions.canGiveDiscounts) {
      throw new Error(`Desconto de ${discountPercent.toFixed(1)}% excede o limite permitido (${this.settings.maxDiscountPercent}%). Autorização necessária.`);
    }

    // Generate unique sale code
    const saleCount = this.sales.length + 1;
    const saleCode = `VENDA-${new Date().getFullYear()}-${saleCount.toString().padStart(4, '0')}`;
    const saleId = 'sale_' + Date.now();
    const nowIso = new Date().toISOString();
    const today = nowIso.split('T')[0];

    // 3. Deduct stock and assign IMEIs
    for (const item of params.items) {
      const product = this.getProductById(item.productId)!;
      product.currentStock -= item.quantity;

      if (product.hasImei && item.imei) {
        const imeiItem = this.imeis.find((i) => i.imei === item.imei)!;
        imeiItem.status = 'vendido';
        imeiItem.soldDate = today;
        imeiItem.saleId = saleId;
      }

      // Record movement
      this.addStockMovement({
        productId: product.id,
        productName: product.model,
        imei: item.imei,
        type: 'venda',
        quantity: item.quantity,
        costPrice: item.costPrice,
        sellPrice: item.total / item.quantity,
        reason: `Venda ${saleCode} - Cliente: ${client.name}`,
      });

      // 4. Generate Warranty if warranty days > 0
      const warrantyDays = product.warrantyDays || this.settings.warrantyDefaultDays;
      if (warrantyDays > 0) {
        const endDateObj = new Date();
        endDateObj.setDate(endDateObj.getDate() + warrantyDays);
        const endDate = endDateObj.toISOString().split('T')[0];

        const warranty: Warranty = {
          id: 'war_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          saleId: saleId,
          saleCode: saleCode,
          productId: product.id,
          productName: product.model,
          imei: item.imei,
          clientId: client.id,
          clientName: client.name,
          clientCpf: client.cpfCnpj,
          saleDate: today,
          warrantyDays: warrantyDays,
          endDate: endDate,
          status: 'Ativa',
          terms: this.settings.warrantyTerms,
        };
        this.warranties.unshift(warranty);
      }
    }

    // 5. Check Installments / Fiado / Crediário / Cartão parcelado
    const generatedInstallments: Installment[] = [];
    const fiadoOrCreditPayment = params.payments.find((p) => p.method === 'Fiado / Crediário');
    if (fiadoOrCreditPayment && fiadoOrCreditPayment.amount > 0) {
      const instCount = params.installmentsCount || fiadoOrCreditPayment.installmentsCount || 1;
      const amountPerInst = Number((fiadoOrCreditPayment.amount / instCount).toFixed(2));
      const firstDue = params.firstDueDate ? new Date(params.firstDueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      for (let i = 1; i <= instCount; i++) {
        const dueDate = new Date(firstDue);
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        const dueStr = dueDate.toISOString().split('T')[0];

        const inst: Installment = {
          id: 'inst_' + Date.now() + '_' + i,
          saleId: saleId,
          saleCode: saleCode,
          clientName: client.name,
          installmentNumber: i,
          totalInstallments: instCount,
          amount: i === instCount ? fiadoOrCreditPayment.amount - (amountPerInst * (instCount - 1)) : amountPerInst,
          dueDate: dueStr,
          paidAmount: 0,
          status: 'Pendente',
        };
        this.installments.unshift(inst);
        generatedInstallments.push(inst);

        // Add to Accounts Receivable
        this.accountsReceivable.unshift({
          id: 'rec_' + Date.now() + '_' + i,
          saleId: saleId,
          saleCode: saleCode,
          clientId: client.id,
          clientName: client.name,
          clientPhone: client.phone || client.whatsapp,
          installmentNumber: i,
          totalInstallments: instCount,
          amount: inst.amount,
          dueDate: dueStr,
          paidAmount: 0,
          balance: inst.amount,
          status: 'Pendente',
        });
      }

      // Update client open balance
      client.openBalance += fiadoOrCreditPayment.amount;
    }

    // 6. Update Active Cash Register with entries
    const openReg = this.getActiveCashRegister();
    if (openReg) {
      params.payments.forEach((payment) => {
        if (payment.method !== 'Fiado / Crediário') {
          openReg.entries += payment.amount;
          if (payment.method === 'Dinheiro') {
            openReg.currentBalance += payment.amount;
          }
          this.cashMovements.unshift({
            id: 'cm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
            cashRegisterId: openReg.id,
            date: nowIso,
            type: 'entrada',
            category: `Venda ${saleCode}`,
            amount: payment.amount,
            description: `Venda ${saleCode} - ${payment.method} (${client.name})`,
            paymentMethod: payment.method,
            saleId: saleId,
            userName: this.currentUser.name,
          });
        }
      });
    }

    // 7. Update Client stats
    client.totalPurchased += total;
    client.lastPurchaseDate = today;

    // 8. Create Sale Object
    const newSale: Sale = {
      id: saleId,
      code: saleCode,
      date: nowIso,
      clientId: client.id,
      clientName: client.name,
      clientCpf: client.cpfCnpj,
      clientPhone: client.phone || client.whatsapp,
      items: params.items,
      subtotal,
      discount: totalDiscount,
      total,
      payments: params.payments,
      change: 0,
      status: 'concluida',
      sellerName: this.currentUser.name,
      sellerId: this.currentUser.id,
      notes: params.notes,
      warrantyDays: Math.max(...params.items.map((it) => {
        const prod = this.getProductById(it.productId);
        return prod?.warrantyDays || 90;
      })),
      installments: generatedInstallments,
    };

    this.sales.unshift(newSale);
    this.notify();
    return newSale;
  }

  // Cancel Sale (Regra crítica: devolver ao estoque e liberar IMEI)
  public cancelSale(saleId: string, reason: string) {
    if (!this.currentUser.permissions.canDeleteSales && this.currentUser.role !== 'admin') {
      throw new Error('Você não possui permissão para cancelar vendas.');
    }

    const sale = this.sales.find((s) => s.id === saleId);
    if (!sale) throw new Error('Venda não encontrada.');
    if (sale.status === 'cancelada') throw new Error('Esta venda já foi cancelada.');

    // Restore stock and IMEIs
    for (const item of sale.items) {
      const product = this.getProductById(item.productId);
      if (product) {
        product.currentStock += item.quantity;
      }

      if (item.imei) {
        const imeiItem = this.imeis.find((i) => i.imei === item.imei);
        if (imeiItem) {
          imeiItem.status = 'disponivel';
          imeiItem.soldDate = undefined;
          imeiItem.saleId = undefined;
          imeiItem.notes = (imeiItem.notes ? imeiItem.notes + ' | ' : '') + `Devolvido ao estoque por cancelamento da venda ${sale.code}`;
        }
      }

      this.addStockMovement({
        productId: item.productId,
        productName: item.productName,
        imei: item.imei,
        type: 'ajuste',
        quantity: item.quantity,
        costPrice: item.costPrice,
        sellPrice: item.total / item.quantity,
        reason: `Cancelamento de Venda ${sale.code}: ${reason}`,
      });
    }

    // Cancel Warranties
    this.warranties = this.warranties.filter((w) => w.saleId !== saleId);

    // Cancel Receivables and reduce client balance
    const client = this.getClientById(sale.clientId);
    if (client) {
      client.totalPurchased = Math.max(0, client.totalPurchased - sale.total);
      const pendingRecs = this.accountsReceivable.filter((r) => r.saleId === saleId && r.status !== 'Pago');
      const sumPending = pendingRecs.reduce((acc, r) => acc + r.balance, 0);
      client.openBalance = Math.max(0, client.openBalance - sumPending);
    }
    this.accountsReceivable = this.accountsReceivable.filter((r) => r.saleId !== saleId);
    this.installments = this.installments.filter((i) => i.saleId !== saleId);

    // Register exit in cash register if cash was received
    const openReg = this.getActiveCashRegister();
    if (openReg) {
      const cashPayments = sale.payments.filter((p) => p.method === 'Dinheiro');
      const totalCashPaid = cashPayments.reduce((acc, p) => acc + p.amount, 0);
      if (totalCashPaid > 0) {
        openReg.exits += totalCashPaid;
        openReg.currentBalance -= totalCashPaid;
        this.cashMovements.unshift({
          id: 'cm_' + Date.now(),
          cashRegisterId: openReg.id,
          date: new Date().toISOString(),
          type: 'saida',
          category: 'Estorno de Venda',
          amount: totalCashPaid,
          description: `Estorno de venda cancelada ${sale.code} (${reason})`,
          paymentMethod: 'Dinheiro',
          userName: this.currentUser.name,
        });
      }
    }

    sale.status = 'cancelada';
    sale.notes = (sale.notes ? sale.notes + ' | ' : '') + `CANCELADA em ${new Date().toLocaleString('pt-BR')} por ${this.currentUser.name}. Motivo: ${reason}`;

    this.notify();
  }

  public getSales(): Sale[] {
    return [...this.sales];
  }

  public getSaleById(id: string): Sale | undefined {
    return this.sales.find((s) => s.id === id);
  }

  // Exchanges & Returns (Trocas e Devoluções)
  public registerExchangeReturn(params: {
    type: 'Troca' | 'Devolução';
    saleId: string;
    returnedProductId: string;
    returnedImei?: string;
    returnReason: string;
    newProductId?: string;
    newImei?: string;
    differenceAmount: number;
    refundMethod?: PaymentMethod;
    notes?: string;
  }) {
    const sale = this.getSaleById(params.saleId);
    if (!sale) throw new Error('Venda de origem não encontrada.');

    const client = this.getClientById(sale.clientId);
    if (!client) throw new Error('Cliente não encontrado.');

    // 1. Process Returned Product (back to stock)
    const returnedProd = this.getProductById(params.returnedProductId);
    if (!returnedProd) throw new Error('Produto devolvido não encontrado no catálogo.');

    returnedProd.currentStock += 1;
    if (params.returnedImei) {
      const imeiItem = this.imeis.find((i) => i.imei === params.returnedImei);
      if (imeiItem) {
        imeiItem.status = 'disponivel';
        imeiItem.notes = (imeiItem.notes ? imeiItem.notes + ' | ' : '') + `Retorno por ${params.type} da venda ${sale.code} (${params.returnReason})`;
      }
    }

    this.addStockMovement({
      productId: returnedProd.id,
      productName: returnedProd.model,
      imei: params.returnedImei,
      type: 'devolucao',
      quantity: 1,
      costPrice: returnedProd.costPrice,
      sellPrice: returnedProd.sellPrice,
      reason: `${params.type} de mercadoria ref. ${sale.code}: ${params.returnReason}`,
    });

    // 2. If it's an exchange, process new product out of stock
    let newProdName = '';
    if (params.type === 'Troca' && params.newProductId) {
      const newProd = this.getProductById(params.newProductId);
      if (!newProd) throw new Error('Novo produto escolhido para troca não encontrado.');
      if (newProd.currentStock < 1) throw new Error(`Estoque esgotado para o produto ${newProd.model}.`);

      if (newProd.hasImei) {
        if (!params.newImei) throw new Error('Selecione o IMEI para o novo aparelho da troca.');
        const imeiNew = this.imeis.find((i) => i.imei === params.newImei && i.productId === newProd.id);
        if (!imeiNew || imeiNew.status !== 'disponivel') {
          throw new Error('O novo IMEI selecionado não está disponível.');
        }
        imeiNew.status = 'vendido';
        imeiNew.soldDate = new Date().toISOString().split('T')[0];
        imeiNew.notes = `Entregue na troca da venda ${sale.code}`;
      }

      newProd.currentStock -= 1;
      newProdName = newProd.model;

      this.addStockMovement({
        productId: newProd.id,
        productName: newProd.model,
        imei: params.newImei,
        type: 'troca',
        quantity: 1,
        costPrice: newProd.costPrice,
        sellPrice: newProd.sellPrice,
        reason: `Saída por troca ref. ${sale.code}`,
      });
    }

    // 3. Financial adjustments (Cash register entry / exit)
    const openReg = this.getActiveCashRegister();
    if (openReg && params.differenceAmount !== 0) {
      if (params.differenceAmount > 0) {
        // Customer paid extra
        openReg.entries += params.differenceAmount;
        openReg.currentBalance += params.differenceAmount;
        this.cashMovements.unshift({
          id: 'cm_' + Date.now(),
          cashRegisterId: openReg.id,
          date: new Date().toISOString(),
          type: 'entrada',
          category: 'Diferença de Troca',
          amount: params.differenceAmount,
          description: `Diferença a favor recebida na troca ${sale.code} (${client.name})`,
          paymentMethod: params.refundMethod || 'Dinheiro',
          userName: this.currentUser.name,
        });
      } else {
        // Store refunded customer
        const refundVal = Math.abs(params.differenceAmount);
        openReg.exits += refundVal;
        openReg.currentBalance -= refundVal;
        this.cashMovements.unshift({
          id: 'cm_' + Date.now(),
          cashRegisterId: openReg.id,
          date: new Date().toISOString(),
          type: 'saida',
          category: 'Estorno/Devolução',
          amount: refundVal,
          description: `Devolução em dinheiro/PIX ref. ${sale.code} (${client.name})`,
          paymentMethod: params.refundMethod || 'Dinheiro',
          userName: this.currentUser.name,
        });
      }
    }

    const exchangeRecord: ExchangeReturn = {
      id: 'exc_' + Date.now(),
      date: new Date().toISOString(),
      type: params.type,
      saleId: sale.id,
      saleCode: sale.code,
      clientId: client.id,
      clientName: client.name,
      returnedProductId: returnedProd.id,
      returnedProductName: returnedProd.model,
      returnedImei: params.returnedImei,
      returnReason: params.returnReason,
      newProductId: params.newProductId,
      newProductName: newProdName,
      newImei: params.newImei,
      differenceAmount: params.differenceAmount,
      refundMethod: params.refundMethod,
      userName: this.currentUser.name,
      notes: params.notes,
    };

    this.exchanges.unshift(exchangeRecord);
    this.notify();
    return exchangeRecord;
  }

  public getExchanges(): ExchangeReturn[] {
    return [...this.exchanges];
  }

  // Warranties
  public getWarranties(): Warranty[] {
    // Dynamic status evaluation
    const today = new Date();
    return this.warranties.map((w) => {
      const end = new Date(w.endDate);
      const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let status: Warranty['status'] = 'Ativa';
      if (diffDays < 0) {
        status = 'Vencida';
      } else if (diffDays <= 15) {
        status = 'Próxima do vencimento';
      }
      return { ...w, status };
    });
  }

  // Financial: Accounts Receivable (Contas a Receber)
  public getAccountsReceivable(): AccountReceivable[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.accountsReceivable.map((rec) => {
      let status = rec.status;
      if (status !== 'Pago') {
        if (rec.dueDate < todayStr) {
          status = 'Vencido';
        } else if (rec.paidAmount > 0) {
          status = 'Parcial';
        } else {
          status = 'Pendente';
        }
      }
      return { ...rec, status };
    });
  }

  public payReceivable(id: string, amount: number, method: PaymentMethod) {
    const rec = this.accountsReceivable.find((r) => r.id === id);
    if (!rec) throw new Error('Conta a receber não encontrada.');

    if (amount <= 0 || amount > rec.balance) {
      throw new Error(`Valor de pagamento inválido. Saldo devedor: R$ ${rec.balance.toFixed(2)}`);
    }

    rec.paidAmount += amount;
    rec.balance = Math.max(0, rec.amount - rec.paidAmount);
    rec.lastPaymentDate = new Date().toISOString().split('T')[0];

    if (rec.balance === 0) {
      rec.status = 'Pago';
    } else {
      rec.status = 'Parcial';
    }

    // Update Client balance
    const client = this.getClientById(rec.clientId);
    if (client) {
      client.openBalance = Math.max(0, client.openBalance - amount);
    }

    // Register into active cash register
    const openReg = this.getActiveCashRegister();
    if (openReg) {
      openReg.entries += amount;
      if (method === 'Dinheiro') openReg.currentBalance += amount;
      this.cashMovements.unshift({
        id: 'cm_' + Date.now(),
        cashRegisterId: openReg.id,
        date: new Date().toISOString(),
        type: 'entrada',
        category: 'Recebimento de Crediário',
        amount: amount,
        description: `Recebimento parcela ${rec.installmentNumber}/${rec.totalInstallments} (${rec.clientName})`,
        paymentMethod: method,
        userName: this.currentUser.name,
      });
    }

    this.notify();
  }

  // Financial: Accounts Payable (Contas a Pagar)
  public getAccountsPayable(): AccountPayable[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.accountsPayable.map((pay) => {
      let status = pay.status;
      if (status !== 'Pago') {
        if (pay.dueDate < todayStr) {
          status = 'Vencido';
        } else if (pay.paidAmount > 0) {
          status = 'Parcial';
        } else {
          status = 'Pendente';
        }
      }
      return { ...pay, status };
    });
  }

  public saveAccountPayable(payable: AccountPayable) {
    const idx = this.accountsPayable.findIndex((p) => p.id === payable.id);
    if (idx >= 0) {
      this.accountsPayable[idx] = payable;
    } else {
      this.accountsPayable.unshift(payable);
    }
    this.notify();
  }

  public deleteAccountPayable(id: string) {
    this.accountsPayable = this.accountsPayable.filter((p) => p.id !== id);
    this.notify();
  }

  public payAccountPayable(id: string, amount: number, method: PaymentMethod) {
    const pay = this.accountsPayable.find((p) => p.id === id);
    if (!pay) throw new Error('Conta a pagar não encontrada.');

    pay.paidAmount += amount;
    if (pay.paidAmount >= pay.amount) {
      pay.status = 'Pago';
    } else {
      pay.status = 'Parcial';
    }
    pay.paidDate = new Date().toISOString().split('T')[0];

    // Deduct from cash register if cash
    const openReg = this.getActiveCashRegister();
    if (openReg && method === 'Dinheiro') {
      openReg.exits += amount;
      openReg.currentBalance -= amount;
      this.cashMovements.unshift({
        id: 'cm_' + Date.now(),
        cashRegisterId: openReg.id,
        date: new Date().toISOString(),
        type: 'saida',
        category: 'Pagamento de Despesa/Fornecedor',
        amount: amount,
        description: `Pagamento: ${pay.description} (${pay.supplier})`,
        paymentMethod: method,
        userName: this.currentUser.name,
      });
    }

    this.notify();
  }

  // Cash Register (Controle de Caixa)
  public getActiveCashRegister(): CashRegister | undefined {
    return this.cashRegisters.find((c) => c.status === 'aberto');
  }

  public getCashRegisters(): CashRegister[] {
    return [...this.cashRegisters];
  }

  public getCashMovements(registerId?: string): CashMovement[] {
    if (registerId) {
      return this.cashMovements.filter((m) => m.cashRegisterId === registerId);
    }
    return [...this.cashMovements];
  }

  public openCashRegister(initialBalance: number): CashRegister {
    const active = this.getActiveCashRegister();
    if (active) throw new Error('Já existe um caixa aberto no momento.');

    const newReg: CashRegister = {
      id: 'cx_' + Date.now(),
      openedAt: new Date().toISOString(),
      openedBy: this.currentUser.name,
      initialBalance: initialBalance,
      status: 'aberto',
      entries: 0,
      exits: 0,
      currentBalance: initialBalance,
    };

    this.cashRegisters.unshift(newReg);

    this.cashMovements.unshift({
      id: 'cm_' + Date.now(),
      cashRegisterId: newReg.id,
      date: newReg.openedAt,
      type: 'entrada',
      category: 'Abertura de Caixa',
      amount: initialBalance,
      description: 'Fundo de troco inicial para o turno',
      paymentMethod: 'Dinheiro',
      userName: this.currentUser.name,
    });

    this.notify();
    return newReg;
  }

  public closeCashRegister(breakdown: {
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
    outros: number;
    observacoes?: string;
  }) {
    const active = this.getActiveCashRegister();
    if (!active) throw new Error('Não há caixa aberto para fechar.');

    const totalCounted = breakdown.dinheiro + breakdown.pix + breakdown.debito + breakdown.credito + breakdown.outros;
    const expected = active.initialBalance + active.entries - active.exits;
    const diferenca = totalCounted - expected;

    active.status = 'fechado';
    active.closedAt = new Date().toISOString();
    active.closedBy = this.currentUser.name;
    active.breakdown = {
      ...breakdown,
      totalVendido: active.entries,
      totalRecebido: totalCounted,
      diferenca,
      observacoes: breakdown.observacoes,
    };

    this.notify();
  }

  public addManualCashMovement(type: 'entrada' | 'saida', amount: number, category: string, description: string, paymentMethod: PaymentMethod) {
    const active = this.getActiveCashRegister();
    if (!active) throw new Error('É necessário ter um caixa aberto para registrar movimentações.');

    if (type === 'entrada') {
      active.entries += amount;
      if (paymentMethod === 'Dinheiro') active.currentBalance += amount;
    } else {
      active.exits += amount;
      if (paymentMethod === 'Dinheiro') active.currentBalance -= amount;
    }

    this.cashMovements.unshift({
      id: 'cm_' + Date.now(),
      cashRegisterId: active.id,
      date: new Date().toISOString(),
      type,
      category,
      amount,
      description,
      paymentMethod,
      userName: this.currentUser.name,
    });

    this.notify();
  }

  // Global Relational Backup / Export / Import / Reset
  public exportDatabaseJson(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      store: this.settings.storeName,
      data: {
        users: this.users,
        clients: this.clients,
        brands: this.brands,
        suppliers: this.suppliers,
        products: this.products,
        imeis: this.imeis,
        sales: this.sales,
        installments: this.installments,
        accountsReceivable: this.accountsReceivable,
        accountsPayable: this.accountsPayable,
        cashRegisters: this.cashRegisters,
        cashMovements: this.cashMovements,
        warranties: this.warranties,
        movements: this.movements,
        entries: this.entries,
        exchanges: this.exchanges,
        settings: this.settings,
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  public exportDatabaseSql(): string {
    let sql = `-- CELLSTORE PRO - EXPORTAÇÃO RELACIONAL SQL DUMP\n-- Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS brands (id VARCHAR(50) PRIMARY KEY, code VARCHAR(20), name VARCHAR(100), status VARCHAR(20));\n`;
    sql += `CREATE TABLE IF NOT EXISTS products (id VARCHAR(50) PRIMARY KEY, code VARCHAR(50), brand_id VARCHAR(50), model VARCHAR(150), category VARCHAR(50), cost_price NUMERIC(10,2), sell_price NUMERIC(10,2), current_stock INT);\n`;
    sql += `CREATE TABLE IF NOT EXISTS imeis (id VARCHAR(50) PRIMARY KEY, imei VARCHAR(30) UNIQUE, product_id VARCHAR(50), status VARCHAR(30), cost_price NUMERIC(10,2), sell_price NUMERIC(10,2));\n`;
    sql += `CREATE TABLE IF NOT EXISTS clients (id VARCHAR(50) PRIMARY KEY, code VARCHAR(50), name VARCHAR(150), cpf_cnpj VARCHAR(30), phone VARCHAR(30), email VARCHAR(100));\n`;
    sql += `CREATE TABLE IF NOT EXISTS sales (id VARCHAR(50) PRIMARY KEY, code VARCHAR(50) UNIQUE, client_id VARCHAR(50), total NUMERIC(10,2), date TIMESTAMP, status VARCHAR(20));\n\n`;

    this.brands.forEach((b) => {
      sql += `INSERT INTO brands (id, code, name, status) VALUES ('${b.id}', '${b.code}', '${b.name.replace(/'/g, "''")}', '${b.status}');\n`;
    });
    this.products.forEach((p) => {
      sql += `INSERT INTO products (id, code, brand_id, model, category, cost_price, sell_price, current_stock) VALUES ('${p.id}', '${p.code}', '${p.brandId}', '${p.model.replace(/'/g, "''")}', '${p.category}', ${p.costPrice}, ${p.sellPrice}, ${p.currentStock});\n`;
    });
    this.imeis.forEach((i) => {
      sql += `INSERT INTO imeis (id, imei, product_id, status, cost_price, sell_price) VALUES ('${i.id}', '${i.imei}', '${i.productId}', '${i.status}', ${i.costPrice}, ${i.sellPrice});\n`;
    });
    this.clients.forEach((c) => {
      sql += `INSERT INTO clients (id, code, name, cpf_cnpj, phone, email) VALUES ('${c.id}', '${c.code}', '${c.name.replace(/'/g, "''")}', '${c.cpfCnpj}', '${c.phone}', '${c.email}');\n`;
    });
    this.sales.forEach((s) => {
      sql += `INSERT INTO sales (id, code, client_id, total, date, status) VALUES ('${s.id}', '${s.code}', '${s.clientId}', ${s.total}, '${s.date}', '${s.status}');\n`;
    });

    return sql;
  }

  public importDatabaseJson(jsonString: string) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.data) {
        if (parsed.data.users) this.users = parsed.data.users;
        if (parsed.data.clients) this.clients = parsed.data.clients;
        if (parsed.data.brands) this.brands = parsed.data.brands;
        if (parsed.data.suppliers) this.suppliers = parsed.data.suppliers;
        if (parsed.data.products) this.products = parsed.data.products;
        if (parsed.data.imeis) this.imeis = parsed.data.imeis;
        if (parsed.data.sales) this.sales = parsed.data.sales;
        if (parsed.data.installments) this.installments = parsed.data.installments;
        if (parsed.data.accountsReceivable) this.accountsReceivable = parsed.data.accountsReceivable;
        if (parsed.data.accountsPayable) this.accountsPayable = parsed.data.accountsPayable;
        if (parsed.data.cashRegisters) this.cashRegisters = parsed.data.cashRegisters;
        if (parsed.data.cashMovements) this.cashMovements = parsed.data.cashMovements;
        if (parsed.data.warranties) this.warranties = parsed.data.warranties;
        if (parsed.data.movements) this.movements = parsed.data.movements;
        if (parsed.data.entries) this.entries = parsed.data.entries;
        if (parsed.data.exchanges) this.exchanges = parsed.data.exchanges;
        if (parsed.data.settings) this.settings = parsed.data.settings;
        this.notify();
      } else {
        throw new Error('Formato de arquivo inválido. Objeto data ausente.');
      }
    } catch (e: any) {
      throw new Error('Falha ao restaurar banco de dados: ' + e.message);
    }
  }

  public getState() {
    return {
      users: [...this.users],
      clients: [...this.clients],
      brands: [...this.brands],
      suppliers: [...this.suppliers],
      products: [...this.products],
      imeis: [...this.imeis],
      sales: [...this.sales],
      installments: [...this.installments],
      accountsReceivable: this.getAccountsReceivable(),
      accountsPayable: this.getAccountsPayable(),
      cashRegister: this.getActiveCashRegister(),
      cashRegisters: [...this.cashRegisters],
      cashMovements: [...this.cashMovements],
      warranties: this.getWarranties(),
      stockMovements: [...this.movements],
      stockEntries: [...this.entries],
      exchanges: [...this.exchanges],
      settings: { ...this.settings },
      currentUser: this.currentUser,
    };
  }

  public updateImeiStatus(id: string, status: any, notes?: string) {
    const imeiItem = this.imeis.find((i) => i.id === id);
    if (!imeiItem) throw new Error('Item IMEI não encontrado.');
    imeiItem.status = status;
    if (notes) {
      imeiItem.notes = (imeiItem.notes ? imeiItem.notes + ' | ' : '') + notes;
    }
    this.notify();
  }

  public registerStockEntry(data: {
    invoiceNumber: string;
    supplierId: string;
    productId: string;
    quantity: number;
    costPrice: number;
    sellPrice?: number;
    paymentMethod: PaymentMethod;
    installmentsCount?: number;
    notes?: string;
    imeisList?: string[];
  }) {
    const supplier = this.suppliers.find((s) => s.id === data.supplierId);
    const supplierName = supplier ? supplier.name : 'Fornecedor Avulso';

    if (data.sellPrice && data.sellPrice > 0) {
      const prod = this.getProductById(data.productId);
      if (prod) {
        prod.sellPrice = data.sellPrice;
      }
    }

    return this.registerProductEntry({
      supplierName,
      invoiceNumber: data.invoiceNumber,
      productId: data.productId,
      quantity: data.quantity,
      unitCost: data.costPrice,
      paymentMethod: data.paymentMethod,
      imeis: data.imeisList,
      notes: data.notes,
    });
  }

  public registerPayable(data: {
    description: string;
    supplierId?: string;
    category: string;
    amount: number;
    dueDate: string;
    notes?: string;
  }) {
    const supplier = this.suppliers.find((s) => s.id === data.supplierId);
    const supplierName = supplier ? supplier.name : 'Diversos';

    const payable: AccountPayable = {
      id: 'pay_' + Date.now(),
      supplier: supplierName,
      description: data.description,
      category: data.category,
      amount: data.amount,
      dueDate: data.dueDate,
      paymentMethod: 'Boleto',
      status: 'Pendente',
      paidAmount: 0,
      notes: data.notes,
    };

    this.accountsPayable.unshift(payable);
    this.notify();
    return payable;
  }

  public finalizeSale(params: {
    clientId: string;
    clientName?: string;
    clientCpf?: string;
    clientPhone?: string;
    sellerId?: string;
    sellerName?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    payments: SalePayment[];
    notes?: string;
    installmentsCount?: number;
    firstDueDate?: string;
  }): Sale {
    return this.executeSale({
      clientId: params.clientId,
      items: params.items,
      discount: params.discount,
      payments: params.payments,
      notes: params.notes,
      installmentsCount: params.installmentsCount,
      firstDueDate: params.firstDueDate,
    });
  }

  public addCashMovement(
    type: 'suprimento' | 'sangria',
    amount: number,
    reason: string,
    userId?: string,
    userName?: string
  ) {
    const active = this.getActiveCashRegister();
    if (!active) throw new Error('É necessário ter um caixa aberto para movimentações.');

    const isSuprimento = type === 'suprimento';
    if (isSuprimento) {
      active.entries += amount;
      active.currentBalance += amount;
    } else {
      active.exits += amount;
      active.currentBalance -= amount;
    }

    this.cashMovements.unshift({
      id: 'cm_' + Date.now(),
      cashRegisterId: active.id,
      date: new Date().toISOString(),
      type: isSuprimento ? 'entrada' : 'saida',
      category: isSuprimento ? 'Suprimento de Caixa' : 'Sangria de Caixa',
      amount,
      description: reason,
      paymentMethod: 'Dinheiro',
      userName: userName || this.currentUser.name,
    });

    this.notify();
  }

  public exportBackup(): string {
    return this.exportDatabaseJson();
  }

  public importBackup(jsonString: string) {
    this.importDatabaseJson(jsonString);
  }

  public resetDemoData() {
    this.resetToFactory();
  }

  public resetToFactory() {
    localStorage.clear();
    this.users = INITIAL_USERS;
    this.clients = INITIAL_CLIENTS;
    this.brands = INITIAL_BRANDS;
    this.suppliers = INITIAL_SUPPLIERS;
    this.products = INITIAL_PRODUCTS;
    this.imeis = INITIAL_IMEIS;
    this.sales = INITIAL_SALES;
    this.installments = INITIAL_INSTALLMENTS;
    this.accountsReceivable = INITIAL_ACCOUNTS_RECEIVABLE;
    this.accountsPayable = INITIAL_ACCOUNTS_PAYABLE;
    this.cashRegisters = INITIAL_CASH_REGISTERS;
    this.cashMovements = INITIAL_CASH_MOVEMENTS;
    this.warranties = INITIAL_WARRANTIES;
    this.movements = INITIAL_MOVEMENTS;
    this.entries = [];
    this.exchanges = [];
    this.settings = INITIAL_SETTINGS;
    this.currentUser = INITIAL_USERS[0];
    this.notify();
  }
}

export const db = new RelationalDatabaseEngine();
