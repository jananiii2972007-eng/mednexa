import React from 'react';
import {
  AlertTriangle,
  Clock,
  Building2,
  PackageCheck,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Truck,
  Plus,
  Mic,
  ThermometerSnowflake,
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';
import { MedicineItem, PHCCenter, AIStockoutRisk, RescueTransfer, TabType } from '../types';

interface HomeScreenProps {
  medicines: MedicineItem[];
  phcs: PHCCenter[];
  aiRisks: AIStockoutRisk[];
  transfers: RescueTransfer[];
  onNavigateTab: (tab: TabType) => void;
  onOpenTransfer: (med?: MedicineItem, phc?: PHCCenter, type?: 'DISPATCH_SURPLUS' | 'REQUEST_DEFICIT') => void;
  onOpenAddMedicine: () => void;
  onOpenVoiceAssistant: () => void;
  language: 'en' | 'ta';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  medicines,
  phcs,
  aiRisks,
  transfers,
  onNavigateTab,
  onOpenTransfer,
  onOpenAddMedicine,
  onOpenVoiceAssistant,
  language,
}) => {
  // Calculated stats
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => m.stock <= m.minSafetyStock).length;
  const expiringSoonCount = medicines.filter((m) => m.daysUntilExpiry <= 60).length;
  const activeTransfersCount = transfers.filter((t) => t.status === 'IN_TRANSIT' || t.status === 'DISPATCHED').length;

  const criticalRisk = aiRisks.find((r) => r.riskLevel === 'CRITICAL');
  const criticalMed = medicines.find((m) => m.id === criticalRisk?.medicineId);

  const lowStockItems = medicines.filter((m) => m.stock <= m.minSafetyStock).slice(0, 3);
  const nearExpiryItems = medicines.filter((m) => m.daysUntilExpiry <= 60).slice(0, 2);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* PHC Greeting & Shift status */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] text-teal-200 uppercase font-bold tracking-wider">
            {language === 'ta' ? 'மருந்தகம் செயலில் உள்ளது' : 'Pharmacy Operations Active'}
          </p>
          <h2 className="text-base font-bold text-white mt-0.5">
            {language === 'ta' ? 'வணக்கம், மருத்துவர் & மருந்தாளர்' : 'Dr. Aruna & Pharmacist Selvam'}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{language === 'ta' ? '48,500 கிராம மக்களுக்கு சேவை' : 'Serving 48,500 villagers in Kallakurichi Taluk'}</span>
          </p>
        </div>
        <button
          onClick={onOpenVoiceAssistant}
          title="Open Tamil Voice Assistant"
          className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-2xl text-teal-100 transition-colors flex flex-col items-center gap-1 border border-white/15"
        >
          <Mic className="w-5 h-5 text-emerald-300" />
          <span className="text-[10px] font-semibold">குரல்</span>
        </button>
      </div>

      {/* 4 Stat Metric Cards (Rounded cards, clean white, teal/green accents) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Medicines */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-teal-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              98.2% Avail
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalMedicines}</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {language === 'ta' ? 'மொத்த மருந்துகள்' : 'Total Medicines'}
          </p>
        </div>

        {/* Low-Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white rounded-2xl p-3.5 border border-rose-100 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              Critical
            </span>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 tracking-tight">{lowStockCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {language === 'ta' ? 'குறைந்த இருப்பு எச்சரிக்கை' : 'Low-Stock Alerts'}
          </p>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white rounded-2xl p-3.5 border border-amber-100 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              ≤ 60 Days
            </span>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 tracking-tight">{expiringSoonCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {language === 'ta' ? 'காலாவதியாகும் அபாயம்' : 'Expiring Medicines'}
          </p>
        </div>

        {/* Connected PHCs */}
        <div
          onClick={() => onNavigateTab('rescue')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-teal-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              {activeTransfersCount} Active
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{phcs.length}</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {language === 'ta' ? 'இணைக்கப்பட்ட PHC-க்கள்' : 'Nearby PHC Mesh'}
          </p>
        </div>
      </div>

      {/* Emergency Stockout Alert Banner */}
      {criticalRisk && (
        <div className="bg-gradient-to-r from-rose-50 via-rose-50/70 to-amber-50 border border-rose-200 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  {language === 'ta' ? 'அவசர கையிருப்பு எச்சரிக்கை' : 'Emergency Stockout Alert'}
                </span>
                <span className="text-[10px] text-rose-600 font-medium bg-rose-100 px-1.5 py-0.2 rounded-md">
                  {criticalRisk.daysToStockout} days left
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {criticalRisk.medicineName}
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {criticalRisk.primaryCause}. Reserve down to {criticalRisk.currentStock} vials.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    const ulundurpet = phcs.find((p) => p.name.includes('Ulundurpet'));
                    onOpenTransfer(criticalMed, ulundurpet, 'REQUEST_DEFICIT');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'உடனடி மீட்பு கோரிக்கை' : 'Request Inter-PHC Rescue'}</span>
                </button>
                <button
                  onClick={() => onNavigateTab('insights')}
                  className="text-xs font-semibold text-rose-800 hover:text-rose-900 px-2 py-1 rounded-lg hover:bg-rose-100/50 transition-colors"
                >
                  {language === 'ta' ? 'காரணங்களை காண்க' : 'View AI Analysis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Stock Attention List */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ta' ? 'அவசர கவன தேவை உள்ள மருந்துகள்' : 'Critical Stock Attention'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs text-teal-700 font-semibold flex items-center gap-0.5 hover:text-teal-800"
          >
            <span>{language === 'ta' ? 'அனைத்தும்' : 'View all'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {lowStockItems.map((item) => {
            const stockPct = Math.min(100, Math.round((item.stock / item.minSafetyStock) * 100));
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.form} · Batch {item.batchNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-rose-600">
                      {item.stock} / {item.minSafetyStock} {item.unit}
                    </p>
                    <p className="text-[10px] text-slate-400">min buffer {item.minSafetyStock}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stockPct <= 25 ? 'bg-rose-500' : stockPct <= 50 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.max(8, stockPct)}%` }}
                  />
                </div>

                {/* Rescue action */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    {item.coldChainRequired && (
                      <span className="text-sky-600 flex items-center gap-0.5">
                        <ThermometerSnowflake className="w-3 h-3" />
                        2°C-8°C
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => onOpenTransfer(item, undefined, 'REQUEST_DEFICIT')}
                    className="text-teal-700 font-bold hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>{language === 'ta' ? 'மீட்பு கோரு' : 'Request from Mesh'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expiring Soon Batches (Waste Prevention) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'ta' ? 'கழிவைத் தவிர்க்க உடனடி மீட்பு' : 'Expiry Waste Prevention'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'ta' ? 'வீணாவதற்கு முன் பிற PHC-க்கு மாற்றவும்' : 'Transfer surplus before expiry date'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            {expiringSoonCount} Batches
          </span>
        </div>

        <div className="space-y-2.5">
          {nearExpiryItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/80 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {item.stock} {item.unit} · <span className="font-semibold text-amber-800">Expires in {item.daysUntilExpiry} days</span>
                </p>
              </div>
              <button
                onClick={() => onOpenTransfer(item, undefined, 'DISPATCH_SURPLUS')}
                className="px-2.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors shadow-xs"
              >
                <Share2 className="w-3 h-3" />
                <span>{language === 'ta' ? 'பகிர்' : 'Share Surplus'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby PHC Availability Mesh Radar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ta' ? 'அருகிலுள்ள PHC இருப்பு நிலை' : 'Nearby PHC Mesh Availability'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('rescue')}
            className="text-xs text-teal-700 font-semibold flex items-center gap-0.5 hover:text-teal-800"
          >
            <span>{language === 'ta' ? 'வரைபடம்' : 'Open Map'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {phcs.slice(0, 3).map((phc) => (
            <div
              key={phc.id}
              onClick={() => onNavigateTab('rescue')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{phc.name}</h4>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded-md">
                    {phc.distanceKm} km · ~{phc.travelTimeMin}m
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Surplus: {phc.surplusList.length} items · Shortages: {phc.shortageList.length} items
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Floating / Bottom Bar */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onOpenAddMedicine}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-teal-700" />
          <span>{language === 'ta' ? '+ மருந்து சேர்' : '+ Add Batch'}</span>
        </button>
        <button
          onClick={() => onOpenTransfer()}
          className="py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <Truck className="w-4 h-4 text-emerald-300" />
          <span>{language === 'ta' ? 'புதிய மாற்றம்' : 'New Transfer'}</span>
        </button>
      </div>
    </div>
  );
};
