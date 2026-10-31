import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeezCross } from './CrossIcon';
import { MobileConnectModal } from './MobileConnectModal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Heart,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Send,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Live direct URL for phone access
  const directAppUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost')
        ? 'https://ais-pre-viqq27olste2rtsp7qcubb-872702973667.us-east1.run.app'
        : window.location.href)
    : 'https://ais-pre-viqq27olste2rtsp7qcubb-872702973667.us-east1.run.app';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል! እባክዎ እንደገና ይሞክሩ።');
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    login(user, pass);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(directAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(directAppUrl)}&text=${encodeURIComponent('የምክሃ ደናግል ሰንበት ት/ቤት የመገኘት መቆጣጠሪያ አፕሊኬሽን')}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('የምክሃ ደናግል ሰንበት ት/ቤት የመገኘት መቆጣጠሪያ አፕሊኬሽን:\n' + directAppUrl)}`;

  return (
    <div className="min-h-screen bg-[#24060d] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#80142b]/50 via-[#3d0b17]/80 to-[#140206] pointer-events-none" />
      
      {/* Subtle background sacred cross pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <GeezCross className="w-[850px] h-[850px] text-amber-300" size={850} />
      </div>

      <div className="relative w-full max-w-5xl z-10 my-auto">
        {/* Church Emblem & Main Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-amber-400/40 shadow-2xl shadow-black/80 mx-auto bg-[#3d0b17]">
              <img
                src="/src/assets/images/mikha_danagil_emblem_1793395511751.jpg"
                alt="ምክሃ ደናግል ሰንበት ት/ቤት አርማ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#24060d]">
              <GeezCross size={16} className="text-slate-950" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight">
            ምክሃ ደናግል ሰንበት ት/ቤት
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-md mx-auto">
            የሰንበት ተማሪዎችና የእናቶች መገኘት (አቴንዳንስ) መቆጣጠሪያና መመዝገቢያ አፕ
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1 rounded-full shadow-sm">
            <GeezCross size={11} className="text-amber-400" />
            <span>በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን</span>
          </div>
        </div>

        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Login Card (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-[#1c0409]/95 border border-amber-500/25 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>የመግቢያ ገጽ (Login)</span>
                  </h2>
                  <p className="text-xs text-stone-400">የይለፍ ቃልዎን አስገብተው ወደ ሲስተሙ ይግቡ</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    የተጠቃሚ ስም (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ለምሳሌ: admin ወይም mezgabi"
                    className="w-full h-11 px-3.5 bg-black/50 border border-amber-500/30 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    የይለፍ ቃል (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="የይለፍ ቃል ያስገቡ"
                      className="w-full h-11 px-3.5 pr-11 bg-black/50 border border-amber-500/30 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 mt-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
                >
                  <span>ወደ ሲስተሙ ግባ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Demo Access Buttons */}
            <div className="mt-5 pt-4 border-t border-amber-900/40">
              <p className="text-[11px] font-semibold text-amber-300/80 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>በቀላሉ ለመሞከር አንዱን ይምረጡ (Quick Demo):</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin123')}
                  className="p-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-left transition flex flex-col cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>አስተዳዳሪ (Admin)</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">admin / admin123</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('mezgabi', '123456')}
                  className="p-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-left transition flex flex-col cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>መዝጋቢ (Recorder)</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">mezgabi / 123456</span>
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('enat', '123456')}
                className="w-full mt-2 p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/20 text-center text-xs text-amber-200/90 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>የእናቶች መዝጋቢ ለመሞከር ይጫኑ (enat / 123456)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Direct Mobile Connect Card (5 cols on desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#2a0812] to-[#1a0409] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/90 flex flex-col justify-between relative overflow-hidden">
            {/* Glow badge */}
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md uppercase tracking-wider flex items-center gap-1">
              <span>📱 ለስልክ</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-100 leading-tight">
                    በስልክዎ ላይ በቀጥታ ይክፈቱ
                  </h3>
                  <p className="text-[11px] text-amber-200/70">
                    በስልክ ካሜራ ስካን ያድርጉ ወይም ሊንኩን ይላኩ
                  </p>
                </div>
              </div>

              {/* High-Contrast QR Code Box */}
              <div className="bg-stone-900/70 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center my-3 shadow-inner">
                <div className="bg-white p-3 rounded-xl shadow-xl ring-4 ring-amber-400/20">
                  <QRCodeSVG
                    value={directAppUrl}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-2 text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>የስልክዎን ካሜራ ወደዚህ QR Code ያነጣጥሩ</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  ካሜራው ሊንኩን ያወጣላችኋል፤ በቀላሉ ይጫኑት
                </p>
              </div>

              {/* Direct Link and Quick Action Buttons */}
              <div className="space-y-2 mt-4">
                <div className="bg-black/50 border border-amber-500/30 rounded-xl p-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-200/90 truncate font-mono select-all">
                    {directAppUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-950 font-extrabold" />
                        <span>ተገልብጧል!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ኮፒ</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>በቴሌግራም ላክ</span>
                  </a>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>በዋትስአፕ ላክ</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Install Help Trigger */}
            <div className="mt-4 pt-3 border-t border-amber-900/40">
              <button
                type="button"
                onClick={() => setShowMobileModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>ስልክ ላይ እንደ App እንዴት መጫን ይቻላል? (ሙሉ መመሪያ)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-amber-200/50 flex items-center justify-center gap-2">
          <GeezCross size={12} className="text-amber-500/50" />
          <span>ምክሃ ደናግል ሰንበት ት/ቤት · የደብሩ መንፈሳዊ አገልግሎት ክፍል · ፳፻፲፰ ዓ.ም.</span>
          <GeezCross size={12} className="text-amber-500/50" />
        </div>
      </div>

      {/* Mobile Connect & Installation Modal */}
      <MobileConnectModal 
        isOpen={showMobileModal} 
        onClose={() => setShowMobileModal(false)} 
      />
    </div>
  );
};

