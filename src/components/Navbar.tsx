import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeezCross } from './CrossIcon';
import { MobileConnectModal } from './MobileConnectModal';
import { Smartphone, LayoutDashboard, LogOut, Shield, User as UserIcon, QrCode } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, viewMode, setViewMode } = useApp();
  const [showMobileConnect, setShowMobileConnect] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#350914] text-amber-50 border-b border-amber-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-16">
        
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg ring-1 ring-amber-400/40 bg-[#1e050b] shrink-0 flex items-center justify-center p-0.5">
            <img
              src="/assets/aistudio/FereTeklehaymanot_Media_Logo_0d1c5d74.jpg"
              onError={(e) => {
                e.currentTarget.src = "/src/assets/images/mikha_danagil_emblem_1793395511751.jpg";
              }}
              alt="ምክሃ ደናግል"
              className="w-full h-full object-contain subtle-pulse transform-gpu"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-amber-100 whitespace-nowrap">
            ምክሃ ደናግል ሰንበት ት/ቤት
          </span>
        </div>

        {/* Zone 2: Navigation Links (single line, clean text) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-100/70">
          <button
            onClick={() => {
              setViewMode('MOBILE');
              setActiveTab('attendance');
            }}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              viewMode === 'MOBILE' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            የሞባይል አቴንዳንስ መመዝገቢያ
          </button>
          
          <button
            onClick={() => {
              setViewMode('ADMIN');
              setActiveTab('dashboard');
            }}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              viewMode === 'ADMIN' && activeTab === 'dashboard' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            አጠቃላይ ዳሽቦርድ
          </button>

          <button
            onClick={() => {
              setViewMode('ADMIN');
              setActiveTab('register');
            }}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              viewMode === 'ADMIN' && activeTab === 'register' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            ተማሪ መመዝገቢያ
          </button>

          <button
            onClick={() => {
              setViewMode('ADMIN');
              setActiveTab('members');
            }}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              viewMode === 'ADMIN' && activeTab === 'members' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            የአባላት ዝርዝር
          </button>

          <button
            onClick={() => {
              setViewMode('ADMIN');
              setActiveTab('reports');
            }}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              viewMode === 'ADMIN' && activeTab === 'reports' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            ማተሚያና ሪፖርት
          </button>
        </nav>

        {/* Zone 3: Primary Action & Profile Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Open on Phone / QR Button */}
          <button
            onClick={() => setShowMobileConnect(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-semibold transition cursor-pointer"
            title="በስልክዎ ለመክፈትና ለመጫን (Open on Phone / QR)"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">በስልክ ክፈት</span>
          </button>

          {/* Mode switch button */}
          <button
            onClick={() => setViewMode(viewMode === 'MOBILE' ? 'ADMIN' : 'MOBILE')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-medium transition cursor-pointer"
            title="ዕይታ ቀይር (Switch View)"
          >
            {viewMode === 'MOBILE' ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">የአስተዳዳሪ ገጽ</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">የሞባይል እይታ</span>
              </>
            )}
          </button>

          {/* Current User Pill & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-amber-500/20">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-amber-100 leading-tight">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-amber-300/70">
                {currentUser?.role === 'ADMIN' ? 'አስተዳዳሪ' : 'መዝጋቢ'}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-amber-200/70 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
              title="ውጣ (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Connect Modal */}
      <MobileConnectModal 
        isOpen={showMobileConnect} 
        onClose={() => setShowMobileConnect(false)} 
      />
    </header>
  );
};
