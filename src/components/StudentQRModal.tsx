import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Member, User } from '../types';
import { useApp } from '../context/AppContext';
import { GeezCross } from './CrossIcon';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Camera, 
  Scan, 
  Sparkles, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  Smartphone,
  Check
} from 'lucide-react';

interface StudentQRModalProps {
  member?: Member | null;
  recorderUser?: User | null;
  mode?: 'member' | 'scanner' | 'recorder';
  onClose: () => void;
  onStudentScanned?: (memberId: string) => void;
}

export const StudentQRModal: React.FC<StudentQRModalProps> = ({
  member,
  recorderUser,
  mode = 'member',
  onClose,
  onStudentScanned
}) => {
  const { currentSession, updateMemberAttendance, members, currentUser, showToast } = useApp();
  const [activeView, setActiveView] = useState<'member' | 'scanner' | 'recorder'>(mode);
  const [scannedSuccessMember, setScannedSuccessMember] = useState<Member | null>(null);

  // Generate QR Value payload
  const qrPayload = member
    ? JSON.stringify({
        org: 'MIKHA_DANAGIL_SUNDAY_SCHOOL',
        id: member.id,
        code: member.studentIdCode || `MD-${member.id}`,
        name: member.fullName,
        christianName: member.christianName,
        class: member.classLevel,
        phone: member.phone
      })
    : '';

  const recorderPayload = recorderUser
    ? JSON.stringify({
        org: 'MIKHA_DANAGIL_SUNDAY_SCHOOL',
        type: 'OFFICIAL_RECORDER',
        id: recorderUser.id,
        name: recorderUser.name,
        role: recorderUser.role,
        phone: recorderUser.phone,
        device: recorderUser.deviceInfo
      })
    : '';

  const handleSimulateScan = (scannedMember: Member) => {
    if (!currentSession) {
      showToast('እባክዎ መጀመሪያ ክፍለ-ጊዜ ይክፈቱ', 'error');
      return;
    }
    updateMemberAttendance(currentSession.id, scannedMember.id, 'PRESENT');
    setScannedSuccessMember(scannedMember);
    showToast(`ተማሪ ${scannedMember.fullName} በ QR ኮድ ተገኝቷል ተብሎ ተመዝግቧል!`, 'success');

    if (onStudentScanned) {
      onStudentScanned(scannedMember.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#2a0810] via-[#80142b] to-[#4d0b19] p-4 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {activeView === 'scanner' 
                  ? 'የ QR ኮድ አቴንዳንስ ስካነር' 
                  : activeView === 'recorder' 
                  ? 'የመዝጋቢ ዲጂታል QR መታወቂያ' 
                  : 'የተማሪው ይፋዊ QR ኮድ'}
              </h3>
              <p className="text-[10px] text-amber-200/70">ምክሃ ደናግል ሰንበት ትምህርት ቤት</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1.5 bg-stone-100 border-b border-stone-200 text-xs">
          {member && (
            <button
              onClick={() => setActiveView('member')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer text-center ${
                activeView === 'member'
                  ? 'bg-white text-[#80142b] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              የተማሪው QR
            </button>
          )}

          <button
            onClick={() => setActiveView('scanner')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
              activeView === 'scanner'
                ? 'bg-white text-[#80142b] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>ስካነር (Scan)</span>
          </button>

          <button
            onClick={() => setActiveView('recorder')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
              activeView === 'recorder'
                ? 'bg-white text-[#80142b] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>የመዝጋቢ QR</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6">
          
          {/* ======================================================== */}
          {/* VIEW 1: STUDENT / MEMBER QR CODE BADGE */}
          {/* ======================================================== */}
          {activeView === 'member' && member && (
            <div className="space-y-4">
              <div className="bg-[#faf7f2] p-5 rounded-2xl border-2 border-dashed border-amber-500/40 text-center relative shadow-inner">
                {/* Church Logo Stamp */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GeezCross className="w-4 h-4 text-amber-700" size={16} />
                  <span className="text-[11px] font-bold text-[#80142b] uppercase tracking-wider">
                    ምክሃ ደናግል ሰንበት ት/ቤት
                  </span>
                </div>

                {/* QR Code Graphic */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-stone-200 mx-auto">
                  <QRCodeSVG
                    value={qrPayload}
                    size={180}
                    level="H"
                    includeMargin
                    imageSettings={{
                      src: '/src/assets/images/mikha_danagil_emblem_1793395511751.jpg',
                      x: undefined,
                      y: undefined,
                      height: 34,
                      width: 34,
                      excavate: true
                    }}
                  />
                </div>

                {/* Student Info Details */}
                <div className="mt-3">
                  <h4 className="font-bold text-base text-stone-900">
                    {member.fullName}
                  </h4>
                  <div className="text-xs text-[#80142b] font-semibold mt-0.5">
                    የክርስትና ስም: {member.christianName}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 mt-1 font-mono">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold border border-amber-300">
                      {member.studentIdCode || `ምደ-${member.id}`}
                    </span>
                    <span>{member.classLevel.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                <span className="text-stone-400 text-[11px]">በማንኛውም የስልክ ካሜራ ይነበባል</span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#80142b] hover:bg-[#641322] text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>QR ኮዱን አትም</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: QR ATTENDANCE SCANNER (FOR RECORDERS) */}
          {/* ======================================================== */}
          {activeView === 'scanner' && (
            <div className="space-y-4">
              {/* Simulated Camera Viewfinder */}
              <div className="relative rounded-2xl bg-black aspect-square overflow-hidden flex flex-col items-center justify-center text-white border-2 border-amber-500 shadow-md">
                
                {/* Animated Scanner Laser Bar */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-bounce top-1/3 pointer-events-none" />

                {/* Corner reticle bounds */}
                <div className="absolute inset-8 border-2 border-amber-400/70 rounded-2xl pointer-events-none" />

                <Camera className="w-10 h-10 text-amber-400/80 mb-2" />
                <span className="text-xs font-semibold text-amber-200">
                  የተማሪውን QR ኮድ እዚህ ያሳዩ
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  ወዲያውኑ በሰከንድ ውስጥ "ተገኝቷል" ተብሎ ይመዘገባል
                </span>

                {/* If scanned successfully */}
                {scannedSuccessMember && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-4 text-center z-20 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                    <h4 className="font-bold text-white text-base">
                      {scannedSuccessMember.fullName}
                    </h4>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      የክርስትና ስም: {scannedSuccessMember.christianName}
                    </p>
                    <span className="mt-2 px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">
                      ተገኝቷል ተብሎ ተመዝግቧል!
                    </span>
                    <button
                      onClick={() => setScannedSuccessMember(null)}
                      className="mt-3 text-[11px] text-white/80 hover:text-white underline cursor-pointer"
                    >
                      ቀጣይ ተማሪ ስካን አድርግ
                    </button>
                  </div>
                )}
              </div>

              {/* Fast Quick Select from Member List to Test Scan */}
              <div className="border-t border-stone-100 pt-3">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  በካሜራ ምትክ በቀጥታ ለመሞከር ተማሪ ይምረጡ (Quick Scan Test):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {members
                    .filter(m => m.group === (currentSession?.group || 'STUDENTS') && m.status === 'ACTIVE')
                    .slice(0, 6)
                    .map(m => {
                      const isPresent = currentSession?.records[m.id]?.status === 'PRESENT';
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSimulateScan(m)}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                            isPresent 
                              ? 'bg-emerald-50/70 border-emerald-300' 
                              : 'bg-stone-50 hover:bg-amber-50 border-stone-200'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-stone-900">{m.fullName}</span>
                            <span className="text-stone-500 text-[11px] ml-1">({m.christianName})</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isPresent ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {isPresent ? 'ተመዝግቧል ✓' : 'ስካን አድርግ ⚡'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: RECORDER DIGITAL QR BADGE (FOR መዝጋቢዎች) */}
          {/* ======================================================== */}
          {activeView === 'recorder' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#2a0810] via-[#4d0b19] to-[#1e050b] text-white p-5 rounded-2xl border-2 border-amber-400/50 shadow-xl text-center relative overflow-hidden">
                <div className="absolute right-[-15px] top-[-15px] opacity-10 pointer-events-none">
                  <GeezCross className="w-40 h-40 text-amber-300" size={160} />
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>የተረጋገጠ የሰንበት ት/ቤት መዝጋቢ</span>
                </div>

                <h4 className="font-bold text-lg text-amber-50">
                  {recorderUser?.name || currentUser?.name || 'ዲ/ን ቴዎድሮስ ሰለሞን'}
                </h4>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  {recorderUser?.title || currentUser?.title || 'የተማሪዎች አቴንዳንስ መዝጋቢ'}
                </p>

                {/* Recorder Official QR Code */}
                <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border border-amber-400/40 mx-auto my-3">
                  <QRCodeSVG
                    value={recorderPayload || (currentUser ? JSON.stringify(currentUser) : 'OFFICIAL_RECORDER')}
                    size={150}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="text-xs text-stone-200 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ስልክ ቁጥር: <strong className="text-emerald-300 font-mono">{recorderUser?.phone || currentUser?.phone || '0922-345678'}</strong></span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-amber-200/70">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>መሣሪያ: {recorderUser?.deviceInfo || currentUser?.deviceInfo || 'ስማርት ስልክ (Android Mobile)'}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-500/30 text-[10px] text-amber-300/80">
                  ምክሃ ደናግል ሰንበት ት/ቤት · ይፋዊ ዲጂታል መለያ
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#80142b] hover:bg-[#641322] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>የመዝጋቢ መታወቂያ ካርድ አትም</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="text-[11px]">QR ኮድ በሲስተሙ የተረጋገጠ ነው</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium cursor-pointer"
          >
            ዝጋ
          </button>
        </div>

      </div>
    </div>
  );
};
