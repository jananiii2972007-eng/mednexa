import React, { useState } from 'react';
import { TabType, MedicineItem, PHCCenter, AIStockoutRisk, RescueTransfer, NotificationAlert } from './types';
import {
  INITIAL_MEDICINES,
  CONNECTED_PHCS,
  INITIAL_AI_RISKS,
  INITIAL_TRANSFERS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidTopAppBar } from './components/AndroidTopAppBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { RescueMapScreen } from './screens/RescueMapScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { MoreScreen } from './screens/MoreScreen';
import { TransferModal } from './components/TransferModal';
import { AddMedicineModal } from './components/AddMedicineModal';
import { ComposeCodeModal } from './components/ComposeCodeModal';
import { Smartphone, Maximize2, Minimize2, Check, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  // Presentation Mode: Mobile Device View vs Fullscreen
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(true);

  // Core Application State with demo data
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [phcs, setPhcs] = useState<PHCCenter[]>(CONNECTED_PHCS);
  const [aiRisks, setAiRisks] = useState<AIStockoutRisk[]>(INITIAL_AI_RISKS);
  const [transfers, setTransfers] = useState<RescueTransfer[]>(INITIAL_TRANSFERS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  // Sync animation state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferMed, setSelectedTransferMed] = useState<MedicineItem | null>(null);
  const [selectedTransferPHC, setSelectedTransferPHC] = useState<PHCCenter | null>(null);
  const [transferType, setTransferType] = useState<'DISPATCH_SURPLUS' | 'REQUEST_DEFICIT'>('REQUEST_DEFICIT');

  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isComposeCodeModalOpen, setIsComposeCodeModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Actions
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(language === 'ta' ? 'மாவட்ட கிடங்குடன் ஒத்திசைவு நிறைவடைந்தது' : 'Central Warehouse ledger synced successfully');
    }, 1200);
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const handleOpenTransfer = (
    med?: MedicineItem,
    phc?: PHCCenter,
    type: 'DISPATCH_SURPLUS' | 'REQUEST_DEFICIT' = 'REQUEST_DEFICIT'
  ) => {
    setSelectedTransferMed(med || medicines[0] || null);
    setSelectedTransferPHC(phc || phcs[0] || null);
    setTransferType(type);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = (newTransferData: Omit<RescueTransfer, 'id' | 'requestedAt'>) => {
    const newTransfer: RescueTransfer = {
      ...newTransferData,
      id: `trf-${Date.now().toString().slice(-4)}`,
      requestedAt: 'Just now',
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    // Add alert notification
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `Transfer Dispatched: ${newTransfer.medicineName}`,
      message: `${newTransfer.quantity} ${newTransfer.unit} dispatched via ${newTransfer.vehicleType} to ${newTransfer.toPHC}.`,
      timestamp: 'Just now',
      type: 'TRANSFER',
      read: false,
      actionScreen: 'rescue',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Transfer dispatched! ETA ${newTransfer.etaMinutes} mins.`);
  };

  const handleUpdateTransferStatus = (transferId: string, newStatus: RescueTransfer['status']) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: newStatus } : t))
    );
    showToast('Transfer logged as delivered to destination PHC.');
  };

  const handleAddMedicine = (newMed: MedicineItem) => {
    setMedicines((prev) => [newMed, ...prev]);
    showToast(`Added ${newMed.name} to pharmacy ledger.`);
  };

  const handleAdjustStock = (medicineId: string, delta: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === medicineId) {
          const newStock = Math.max(0, m.stock + delta);
          return { ...m, stock: newStock };
        }
        return m;
      })
    );
    showToast(delta < 0 ? 'Logged 1 unit dispensed.' : `Added ${delta} units to stock.`);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalAlertCount = aiRisks.filter((r) => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;

  return (
    <div className="min-h-screen bg-slate-200/90 flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4 font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Bar with Device Frame Switcher & Jetpack Compose Note */}
      <div className="w-full max-w-md mb-2 px-3 pt-2 sm:pt-0 flex items-center justify-between text-xs text-slate-600 select-none">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Smartphone className="w-4 h-4 text-teal-700" />
          <span>MediFlow AI · Android Experience</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 font-semibold border border-slate-300 shadow-xs transition-colors"
          >
            {isMobileFrameView ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Full Width</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Mobile Shell</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Device Frame */}
      <div
        className={`w-full bg-slate-50 flex flex-col transition-all duration-300 overflow-hidden relative shadow-2xl ${
          isMobileFrameView
            ? 'max-w-[430px] rounded-none sm:rounded-[40px] border-0 sm:border-8 sm:border-slate-850 h-screen sm:h-[880px]'
            : 'max-w-4xl rounded-2xl border border-slate-300 min-h-[90vh]'
        }`}
      >
        {/* Device Punch-Hole Camera (When in mobile frame) */}
        {isMobileFrameView && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 z-40 ring-1 ring-slate-800/80 pointer-events-none" />
        )}

        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Top App Bar */}
        <AndroidTopAppBar
          activeTab={activeTab}
          unreadCount={unreadCount}
          onOpenNotifications={() => setActiveTab('more')}
          onOpenComposeCode={() => setIsComposeCodeModalOpen(true)}
          currentLanguage={language}
          onToggleLanguage={handleToggleLanguage}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSync}
        />

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 overscroll-contain">
          {activeTab === 'home' && (
            <HomeScreen
              medicines={medicines}
              phcs={phcs}
              aiRisks={aiRisks}
              transfers={transfers}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenTransfer={handleOpenTransfer}
              onOpenAddMedicine={() => setIsAddMedicineModalOpen(true)}
              onOpenVoiceAssistant={() => setActiveTab('more')}
              language={language}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsScreen
              aiRisks={aiRisks}
              medicines={medicines}
              phcs={phcs}
              onOpenTransfer={handleOpenTransfer}
              language={language}
            />
          )}

          {activeTab === 'rescue' && (
            <RescueMapScreen
              phcs={phcs}
              transfers={transfers}
              medicines={medicines}
              onOpenTransfer={handleOpenTransfer}
              onUpdateTransferStatus={handleUpdateTransferStatus}
              language={language}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryScreen
              medicines={medicines}
              onOpenAddMedicine={() => setIsAddMedicineModalOpen(true)}
              onOpenTransfer={handleOpenTransfer}
              onAdjustStock={handleAdjustStock}
              language={language}
            />
          )}

          {activeTab === 'more' && (
            <MoreScreen
              notifications={notifications}
              onMarkNotificationRead={handleMarkNotificationRead}
              onClearAllNotifications={handleClearAllNotifications}
              onOpenComposeCode={() => setIsComposeCodeModalOpen(true)}
              language={language}
              onToggleLanguage={handleToggleLanguage}
            />
          )}
        </main>

        {/* Android Bottom Navigation */}
        <AndroidBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          language={language}
          criticalAlertCount={criticalAlertCount}
        />

        {/* Android Home Navigation Bar Pill (When in mobile view) */}
        {isMobileFrameView && (
          <div className="hidden sm:flex justify-center py-1.5 bg-white select-none z-30">
            <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-18 left-4 right-4 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-medium z-50 flex items-center gap-2 border border-slate-700 animate-fade-in backdrop-blur-xs">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        medicine={selectedTransferMed}
        targetPHC={selectedTransferPHC}
        availablePHCs={phcs}
        availableMedicines={medicines}
        transferType={transferType}
        onConfirmTransfer={handleConfirmTransfer}
      />

      <AddMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={() => setIsAddMedicineModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />

      <ComposeCodeModal
        isOpen={isComposeCodeModalOpen}
        onClose={() => setIsComposeCodeModalOpen(false)}
      />
    </div>
  );
}
