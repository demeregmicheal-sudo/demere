import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { GeezCross } from './CrossIcon';
import { 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  X, 
  Share2, 
  Sparkles, 
  Compass, 
  Layers, 
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeOS, setActiveOS] = useState<'android' | 'ios'>('android');
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();

  if (!isOpen) return null;

  // Use current live app URL or AI Studio shared URL
  const appUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-viqq27olste2rtsp7qcubb-872702973667.us-east1.run.app' 
        : window.location.href)
    : 'https://ais-pre-viqq27olste2rtsp7qcubb-872702973667.us-east1.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ምክሃ ደናግል ሰንበት ት/ቤት',
          text: 'የምክሃ ደናግል ሰንበት ት/ቤት የመገኘት መመዝገቢያ የሞባይል መተግበሪያ',
          url: appUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl border border-amber-900/20 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6b1022] via-[#80142b] to-[#500c1b] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Smartphone className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                  <span>አፑን በስልክዎ ላይ ለመጠቀም</span>
                  <GeezCross className="w-4 h-4 text-amber-300" size={16} />
                </h3>
                <p className="text-xs text-amber-200/80">
                  በቀላሉ በስልክዎ ካሜራ ወይም በሊንክ ይክፈቱና ይጫኑ
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Quick 1-Click Install Button if browser supports it */}
          {isInstallable && !isInstalled && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#80142b] text-amber-300 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#80142b]">ቀጥታ በስልክዎ መነሻ ገጽ ላይ ይጫኑ</h4>
                  <p className="text-[11px] text-stone-600">እንደ መደበኛ የሞባይል አፕሊኬሽን ይሰራል</p>
                </div>
              </div>
              <button
                onClick={install}
                className="px-4 py-2 bg-[#80142b] hover:bg-[#6b1022] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer shrink-0"
              >
                አሁን ጫን
              </button>
            </div>
          )}

          {/* Section 1: Scan QR Code to Open on Phone */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="bg-stone-50 p-3 rounded-2xl border-2 border-dashed border-amber-700/30 flex flex-col items-center shrink-0">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={appUrl}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <span className="text-[10px] font-bold text-[#80142b] mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                በስልክዎ ካሜራ ይቃኙ
              </span>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  ደረጃ 1፡ በስልክዎ ካሜራ ይክፈቱት
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  የስልክዎን ካሜራ ወይም የ QR Code ስካነር ከፍተው ወደዚህ ምስል በማነጣጠር በቀጥታ አፑን በስልክዎ ይክፈቱት::
                </p>
              </div>

              {/* Copy URL & Share buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-stone-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">ሊንኩ ተገልብጧል!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      <span>ሊንኩን ኮፒ አድርግ</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-2 bg-[#80142b]/10 hover:bg-[#80142b]/20 text-[#80142b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-[#80142b]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ወደ ስልክ/ቴሌግራም ላክ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: How to Add to Home Screen (PWA Guide) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  ደረጃ 2፡ ልክ እንደ መደበኛ App ስልክዎ ላይ ለመጫን (Add to Home Screen)
                </h4>
                <p className="text-[11px] text-stone-500">
                  በስልክዎ መነሻ ስክሪን ላይ እንደ አፕሊኬሽን ይቀመጣል
                </p>
              </div>
            </div>

            {/* Platform Switcher */}
            <div className="flex rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => setActiveOS('android')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeOS === 'android'
                    ? 'bg-[#80142b] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🤖 ለ አንድሮይድ (Samsung / Tecno / Redmi)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOS('ios')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeOS === 'ios'
                    ? 'bg-[#80142b] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🍏 ለ iPhone / iPad (Apple)</span>
              </button>
            </div>

            {/* Android Instructions */}
            {activeOS === 'android' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-stone-900 block">ሊንኩን በ Google Chrome ይክፈቱ</strong>
                    <span className="text-stone-600 text-[11px]">
                      በስልክዎ ላይ Chrome ብሮውዘር ከፍተው ሊንኩን ያስገቡ ወይም በካሜራ ይቃኙት::
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-stone-900 block">የ Chrome 3 ነጥቦችን (⋮) ይጫኑ</strong>
                    <span className="text-stone-600 text-[11px]">
                      በስልክዎ ስክሪን ከላይ በቀኝ በኩል የሚገኙትን 3 ቀጥ ያሉ ነጥቦች (⋮) ይንኩ::
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-stone-900 block">«Install app» ወይም «Add to Home screen» የሚለውን ይምረጡ</strong>
                    <span className="text-stone-600 text-[11px]">
                      ከተዘረዘሩት አማራጮች ውስጥ <strong>«Install app»</strong> (ወይም «ወደ መነሻ ገጽ አክል») የሚለውን ሲጫኑ አፑ በራሱ ስልክዎ ላይ ይጫናል::
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {activeOS === 'ios' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-stone-900 block">ሊንኩን በ Safari ይክፈቱ</strong>
                    <span className="text-stone-600 text-[11px]">
                      በ iPhone ስልክዎ ውስጥ ያለውን <strong>Safari</strong> ብሮውዘር በመጠቀም ሊንኩን ይክፈቱት::
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-stone-900 block">ከታች የ Share (የማጋሪያ ⎋) ምልክትን ይንኩ</strong>
                    <span className="text-stone-600 text-[11px]">
                      በስልኩ ታችኛው ክፍል ያለውን ወደ ላይ የቀስት ምልክት ያለበትን የሳጥን ምልክት (Share icon) ይጫኑ::
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-[#80142b] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-stone-900 block">«Add to Home Screen» (+) የሚለውን ይጫኑ</strong>
                    <span className="text-stone-600 text-[11px]">
                      ዝርዝሩን ትንሽ ወደ ታች ዝቅ በማድረግ <strong>«Add to Home Screen»</strong> የሚለውን ከመረጡ በኋላ ከላይ በቀኝ <strong>«Add»</strong> ይበሉ::
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Login Accounts reminder */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#80142b]">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>ስልክዎ ላይ ለመግባት የመግቢያ መረጃዎች (Login Accounts)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="bg-white p-2 rounded-xl border border-amber-200">
                <span className="text-stone-500 block">ለተማሪዎች መዝጋቢ:</span>
                <strong className="text-stone-800">User:</strong> <code className="bg-stone-100 px-1 py-0.5 rounded text-[#80142b] font-bold">mezgabi</code> | <strong className="text-stone-800">Pass:</strong> <code className="bg-stone-100 px-1 py-0.5 rounded text-[#80142b] font-bold">123456</code>
              </div>
              <div className="bg-white p-2 rounded-xl border border-amber-200">
                <span className="text-stone-500 block">ለአስተዳዳሪ (Admin):</span>
                <strong className="text-stone-800">User:</strong> <code className="bg-stone-100 px-1 py-0.5 rounded text-[#80142b] font-bold">admin</code> | <strong className="text-stone-800">Pass:</strong> <code className="bg-stone-100 px-1 py-0.5 rounded text-[#80142b] font-bold">admin123</code>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            ምክሃ ደናግል ሰንበት ትምህርት ቤት ✝
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            ተረድቻለሁ (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
