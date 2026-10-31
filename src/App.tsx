import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { MobileAttendanceView } from './components/MobileAttendanceView';
import { AdminDashboard } from './components/AdminDashboard';
import { GeezCross } from './components/CrossIcon';
import { Smartphone, LayoutDashboard, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, viewMode, setViewMode, toast } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col font-sans selection:bg-[#80142b]/20 selection:text-[#80142b]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mode View Switcher Bar (Visible on mobile/tablet or when switching) */}
      <div className="no-print bg-white border-b border-stone-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <GeezCross className="w-4 h-4 text-[#80142b]" size={16} />
            <span className="font-semibold text-stone-900">የአሰራር እይታ:</span>
            <span className="text-stone-500">
              {viewMode === 'MOBILE' ? '📱 ቀላል የሞባይል አቴንዳንስ መመዝገቢያ' : '💻 የሰንበት ት/ቤት የአስተዳዳሪ ፖርታል'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('MOBILE')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'MOBILE'
                  ? 'bg-[#80142b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>የሞባይል እይታ</span>
            </button>

            <button
              onClick={() => setViewMode('ADMIN')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'ADMIN'
                  ? 'bg-[#80142b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>የአስተዳዳሪ ገጽ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'MOBILE' ? (
          <MobileAttendanceView />
        ) : (
          <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Church Footer */}
      <footer className="no-print bg-[#25060e] text-stone-300 py-6 border-t border-amber-900/30 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GeezCross className="w-4 h-4 text-amber-400" size={16} />
            <span className="font-semibold text-white">ምክሃ ደናግል ሰንበት ትምህርት ቤት</span>
            <span className="text-amber-200/50">· የመገኘት መመዝገቢያ እና መቆጣጠሪያ ሲስተም</span>
          </div>
          <div className="text-[11px] text-amber-200/60">
            የተማሪዎች እና የእናቶች ማኅበር ክፍል · {new Date().getFullYear()} ዓ.ም
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-500/40 shadow-emerald-950/30'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-500/40 shadow-rose-950/30'
                : 'bg-stone-900 text-white border-stone-700 shadow-black/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-300 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
