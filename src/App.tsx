import React, { useState, useEffect, useMemo } from 'react';
import { db } from './services/storage';
import { 
  ActiveTab, Sale, Product, Brand, Client, 
  Supplier, IMEIItem, AccountPayable, AccountReceivable, 
  StoreSettings, User, CashRegister, SaleItem, SalePayment, 
  PaymentMethod, ExitReason, StockMovement, Warranty 
} from './types';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PDVView } from './components/PDVView';
import { ProductsView } from './components/ProductsView';
import { StockView } from './components/StockView';
import { EntriesView } from './components/EntriesView';
import { ExitsView } from './components/ExitsView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { ClientsView } from './components/ClientsView';
import { BrandsView } from './components/BrandsView';
import { AccountsReceivableView } from './components/AccountsReceivableView';
import { AccountsPayableView } from './components/AccountsPayableView';
import { CashRegisterView } from './components/CashRegisterView';
import { WarrantiesView } from './components/WarrantiesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ReceiptModal } from './components/ReceiptModal';
import { Activity, ArrowLeftRight, Clock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database snapshot state
  const [dbState, setDbState] = useState(db.getState());

  // Active user state
  const [currentUserId, setCurrentUserId] = useState<string>(
    () => dbState.users[0]?.id || 'usr_1'
  );

  // Global Receipt Modal state
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Subscribe to real-time database modifications
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDbState(db.getState());
    });
    return () => unsubscribe();
  }, []);

  const currentUser = dbState.users.find((u) => u.id === currentUserId) || dbState.users[0];

  // Calculated alerts
  const lowStockCount = useMemo(() => {
    return dbState.products.filter((p) => p.currentStock <= p.minStock).length;
  }, [dbState.products]);

  const overdueReceivablesCount = useMemo(() => {
    return dbState.accountsReceivable.filter((r) => r.status === 'Vencido').length;
  }, [dbState.accountsReceivable]);

  const handleOpenReceipt = (sale: Sale) => {
    setReceiptSale(sale);
    setIsReceiptModalOpen(true);
  };

  const handleOpenSaleDetail = (saleId: string) => {
    const s = dbState.sales.find((x) => x.id === saleId);
    if (s) {
      setReceiptSale(s);
      setIsReceiptModalOpen(true);
    }
  };

  const handleExportBackup = () => {
    const dataStr = db.exportBackup();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `cellstore_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportBackup = (jsonStr: string) => {
    db.importBackup(jsonStr);
  };

  const handleResetDemoData = () => {
    db.resetDemoData();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-[#071126] overflow-hidden text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        cashRegister={dbState.cashRegister}
        lowStockCount={lowStockCount}
        overdueReceivablesCount={overdueReceivablesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden lg:pl-72">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          currentUser={currentUser}
          onSwitchUser={(u) => {
            setCurrentUserId(u.id);
            db.setCurrentUser(u);
          }}
          allUsers={dbState.users}
          setActiveTab={(tab) => setActiveTab(tab)}
          onOpenSaleDetail={handleOpenSaleDetail}
          onSelectProductDetail={(prodId) => {
            setActiveTab('produtos');
          }}
          onSelectClientDetail={(cliId) => {
            setActiveTab('clientes');
          }}
          products={dbState.products}
          imeis={dbState.imeis}
          clients={dbState.clients}
          sales={dbState.sales}
          lowStockCount={lowStockCount}
          overdueReceivablesCount={overdueReceivablesCount}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-[#071126]/90 text-slate-100">
          {activeTab === 'dashboard' && (
            <DashboardView
              sales={dbState.sales}
              products={dbState.products}
              imeis={dbState.imeis}
              receivables={dbState.accountsReceivable}
              movements={dbState.stockMovements}
              cashRegister={dbState.cashRegister}
              setActiveTab={(tab) => setActiveTab(tab)}
              onOpenSaleDetail={handleOpenSaleDetail}
            />
          )}

          {activeTab === 'pdv' && (
            <PDVView
              products={dbState.products}
              imeis={dbState.imeis}
              clients={dbState.clients}
              currentUser={currentUser}
              settings={dbState.settings}
              onExecuteSale={(saleData) => {
                const sale = db.executeSale(saleData);
                handleOpenReceipt(sale);
                return sale;
              }}
              onSaveNewClient={(client) => db.saveClient(client)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {activeTab === 'produtos' && (
            <ProductsView
              products={dbState.products}
              brands={dbState.brands}
              suppliers={dbState.suppliers}
              imeis={dbState.imeis}
              currentUser={currentUser}
              onSaveProduct={(prod) => db.saveProduct(prod)}
              onDeleteProduct={(id) => db.deleteProduct(id)}
            />
          )}

          {activeTab === 'estoque' && (
            <StockView
              products={dbState.products}
              imeis={dbState.imeis}
              brands={dbState.brands}
              sales={dbState.sales}
              onSelectProduct={() => setActiveTab('produtos')}
            />
          )}

          {activeTab === 'entradas' && (
            <EntriesView
              products={dbState.products}
              suppliers={dbState.suppliers}
              entries={dbState.stockEntries}
              currentUser={currentUser}
              onRegisterEntry={(entryData) => db.registerStockEntry(entryData)}
            />
          )}

          {activeTab === 'saidas' && (
            <ExitsView
              products={dbState.products}
              imeis={dbState.imeis}
              currentUser={currentUser}
              onRegisterExit={(exitData) => {
                db.registerStockExit({
                  productId: exitData.productId,
                  quantity: exitData.quantity,
                  reason: exitData.reason,
                  imei: exitData.imei,
                  notes: exitData.notes,
                });
              }}
            />
          )}

          {activeTab === 'vendas' && (
            <SalesHistoryView
              sales={dbState.sales}
              currentUser={currentUser}
              onOpenReceipt={handleOpenReceipt}
              onCancelSale={(saleId) => db.cancelSale(saleId, 'Cancelamento via histórico')}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={dbState.clients}
              sales={dbState.sales}
              onSaveClient={(client) => db.saveClient(client)}
              onDeleteClient={(id) => db.deleteClient(id)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {activeTab === 'marcas' && (
            <BrandsView
              brands={dbState.brands}
              products={dbState.products}
              onSaveBrand={(brand) => db.saveBrand(brand)}
              onDeleteBrand={(id) => db.deleteBrand(id)}
            />
          )}

          {activeTab === 'receber' && (
            <AccountsReceivableView
              receivables={dbState.accountsReceivable}
              onRegisterPayment={(id, amount, method) => db.payReceivable(id, amount, method)}
            />
          )}

          {activeTab === 'pagar' && (
            <AccountsPayableView
              payables={dbState.accountsPayable}
              suppliers={dbState.suppliers}
              onRegisterPayable={(data) => db.registerPayable(data)}
              onPayPayable={(id, method) => {
                const item = dbState.accountsPayable.find((p) => p.id === id);
                if (item) {
                  db.payAccountPayable(id, item.amount - item.paidAmount, method);
                }
              }}
            />
          )}

          {activeTab === 'caixa' && (
            <CashRegisterView
              cashRegister={dbState.cashRegister}
              currentUser={currentUser}
              onOpenRegister={(initialBalance) => db.openCashRegister(initialBalance)}
              onCloseRegister={(actualCash, notes) => {
                db.closeCashRegister({
                  dinheiro: actualCash,
                  pix: 0,
                  debito: 0,
                  credito: 0,
                  outros: 0,
                  observacoes: notes,
                });
              }}
              onAddCashMovement={(type, amount, reason) => db.addCashMovement(type, amount, reason)}
            />
          )}

          {activeTab === 'garantias' && (
            <WarrantiesView
              warranties={dbState.warranties}
              settings={dbState.settings}
            />
          )}

          {activeTab === 'trocas' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <ArrowLeftRight className="w-7 h-7 text-indigo-600" />
                  Trocas e Devoluções de Aparelhos
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Registro e histórico de trocas com ajuste imediato de estoque, liberação de IMEI e cálculo de diferença financeira.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Histórico de Operações</span>
                  <span className="text-xs text-slate-500">{dbState.exchanges.length} registros</span>
                </div>
                {dbState.exchanges.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    Nenhuma troca ou devolução registrada no momento.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dbState.exchanges.map((exc) => (
                      <div key={exc.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              exc.type === 'Troca' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {exc.type}
                            </span>
                            <span className="font-bold text-slate-900">{exc.saleCode}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600">{exc.clientName}</span>
                          </div>
                          <p className="text-slate-700 mt-1 font-medium">
                            Devolveu: <span className="text-slate-900 font-bold">{exc.returnedProductName}</span>
                            {exc.returnedImei && <span className="font-mono text-slate-500 ml-1">(IMEI: {exc.returnedImei})</span>}
                          </p>
                          {exc.newProductName && (
                            <p className="text-emerald-700 mt-0.5 font-medium">
                              Levou: <span className="font-bold">{exc.newProductName}</span>
                              {exc.newImei && <span className="font-mono text-emerald-600 ml-1">(IMEI: {exc.newImei})</span>}
                            </p>
                          )}
                          <p className="text-slate-400 text-[11px] mt-1">Motivo: {exc.returnReason}</p>
                        </div>
                        <div className="sm:text-right">
                          <span className={`font-mono font-bold text-sm ${exc.differenceAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {exc.differenceAmount >= 0 ? `+ R$ ${exc.differenceAmount.toFixed(2)}` : `- R$ ${Math.abs(exc.differenceAmount).toFixed(2)}`}
                          </span>
                          <p className="text-slate-400 text-[10px] mt-0.5">{new Date(exc.date).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'movimentacoes' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <Activity className="w-7 h-7 text-blue-600" />
                  Auditoria e Histórico de Movimentações de Estoque
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Rastreabilidade completa de todas as entradas, saídas, vendas, devoluções e ajustes efetuados com usuário e timestamp.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Data / Hora</th>
                        <th className="p-3.5">Tipo</th>
                        <th className="p-3.5">Produto</th>
                        <th className="p-3.5">IMEI</th>
                        <th className="p-3.5 text-center">Qtd</th>
                        <th className="p-3.5">Motivo / Operação</th>
                        <th className="p-3.5">Operador</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dbState.stockMovements.map((mov) => (
                        <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(mov.date).toLocaleString('pt-BR')}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              mov.type === 'entrada' ? 'bg-blue-50 text-blue-700' :
                              mov.type === 'venda' ? 'bg-emerald-50 text-emerald-700' :
                              mov.type === 'saida' ? 'bg-amber-50 text-amber-700' :
                              mov.type === 'devolucao' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {mov.type}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-900">{mov.productName}</td>
                          <td className="p-3.5 font-mono text-slate-600">{mov.imei || '-'}</td>
                          <td className="p-3.5 text-center font-bold text-slate-900">{mov.quantity}</td>
                          <td className="p-3.5 text-slate-600">{mov.reason}</td>
                          <td className="p-3.5 font-medium text-slate-700 whitespace-nowrap">{mov.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'relatorios' && (
            <ReportsView
              sales={dbState.sales}
              products={dbState.products}
              imeis={dbState.imeis}
              payables={dbState.accountsPayable}
              receivables={dbState.accountsReceivable}
            />
          )}

          {(activeTab === 'configuracoes' || activeTab === 'usuarios') && (
            <SettingsView
              settings={dbState.settings}
              users={dbState.users}
              onSaveSettings={(sett) => db.saveSettings(sett)}
              onSaveUser={(user) => db.saveUser(user)}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Global Receipt Modal */}
      {isReceiptModalOpen && receiptSale && (
        <ReceiptModal
          sale={receiptSale}
          settings={dbState.settings}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setReceiptSale(null);
          }}
        />
      )}
    </div>
  );
}
