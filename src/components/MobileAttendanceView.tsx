import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus, GroupType, Member } from '../types';
import { STUDENT_CLASSES, MOTHER_CLASSES, SESSION_TYPES } from '../data/mockData';
import { StudentQRModal } from './StudentQRModal';
import { MobileConnectModal } from './MobileConnectModal';
import { usePWAInstall } from '../utils/usePWAInstall';
import { 
  Users, 
  Heart, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  XCircle, 
  Search, 
  Phone, 
  Sparkles, 
  Lock, 
  Unlock, 
  Plus, 
  Calendar, 
  FileText, 
  Check, 
  ChevronDown,
  Filter,
  UserCheck,
  QrCode,
  Camera,
  Scan,
  Smartphone
} from 'lucide-react';

export const MobileAttendanceView: React.FC = () => {
  const { 
    members, 
    currentSession, 
    createSession, 
    updateMemberAttendance, 
    markAllMembers, 
    toggleLockSession, 
    selectedGroup, 
    setSelectedGroup,
    getSummary,
    sessions,
    selectSession,
    currentUser,
    showToast
  } = useApp();

  const [activeClassFilter, setActiveClassFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'attendance' | 'summary' | 'new_session'>('attendance');

  // PWA & Mobile Installation state
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showConnectModal, setShowConnectModal] = useState(false);

  // QR Code States (for students and recorders)
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isRecorderBadgeOpen, setIsRecorderBadgeOpen] = useState(false);
  
  // Note dialog state
  const [noteMemberId, setNoteMemberId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // New session modal
  const [showNewSessionModal, setShowNewSessionModal] = useState<boolean>(false);
  const [newSessionType, setNewSessionType] = useState<string>(SESSION_TYPES[0]);
  const [newSessionGroup, setNewSessionGroup] = useState<GroupType>(selectedGroup);

  // Filter members belonging to selected group
  const groupMembers = useMemo(() => {
    return members.filter((m) => m.group === selectedGroup && m.status === 'ACTIVE');
  }, [members, selectedGroup]);

  // Available classes for selected group
  const availableClasses = selectedGroup === 'STUDENTS' ? STUDENT_CLASSES : MOTHER_CLASSES;

  // Filtered members by class & search
  const filteredMembers = useMemo(() => {
    return groupMembers.filter((m) => {
      const matchClass = activeClassFilter === 'ALL' || m.classLevel === activeClassFilter;
      const matchSearch =
        !searchQuery.trim() ||
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.christianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);
      return matchClass && matchSearch;
    });
  }, [groupMembers, activeClassFilter, searchQuery]);

  const summary = getSummary(currentSession);

  const handleOpenNote = (memberId: string) => {
    const currentNote = currentSession?.records[memberId]?.note || '';
    setNoteText(currentNote);
    setNoteMemberId(memberId);
  };

  const handleSaveNote = () => {
    if (noteMemberId && currentSession) {
      const existingStatus = currentSession.records[noteMemberId]?.status || 'PRESENT';
      updateMemberAttendance(currentSession.id, noteMemberId, existingStatus, noteText);
      showToast('ማስታወሻው ተመዝግቧል', 'success');
      setNoteMemberId(null);
    }
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    createSession(newSessionGroup, newSessionType);
    setShowNewSessionModal(false);
    showToast('አዲስ የአቴንዳንስ ክፍለ-ጊዜ በተሳካ ሁኔታ ተከፍቷል!', 'success');
  };

  return (
    <div className="max-w-xl mx-auto pb-28 pt-2 px-3 sm:px-4">
      {/* Install App Banner if not yet installed as standalone */}
      {!isInstalled && (
        <div className="mb-2.5 px-3 py-2 bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-xs font-semibold text-stone-800">
              ይህንን አፕ በስልክዎ መነሻ ገጽ ላይ ይጫኑ
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isInstallable ? (
              <button
                type="button"
                onClick={install}
                className="px-2.5 py-1 bg-[#80142b] hover:bg-[#6b1022] text-white text-[11px] font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                ጫን (Install)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                መመሪያ (Guide)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Banner with Sunday School Imagery */}
      <div className="relative rounded-2xl overflow-hidden mb-3 shadow-md border border-amber-900/20 bg-[#350914] text-white">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/sunday_school_gathering_1793395513039.jpg"
            alt="የሰንበት ተማሪዎች"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-3.5 sm:p-4 z-10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-amber-300 flex items-center gap-1.5 mb-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentSession?.ethiopianDate || 'የዛሬ ቀን'}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-amber-50">
              {currentSession?.sessionType || 'የመገኘት መመዝገቢያ'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-amber-200/80">
                መዝጋቢ: <strong className="font-semibold text-white">{currentSession?.recordedByName || currentUser?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsRecorderBadgeOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 text-[10px] font-semibold transition cursor-pointer"
                title="የመዝጋቢ ዲጂታል QR መታወቂያ ይመልከቱ"
              >
                <QrCode className="w-3 h-3 text-amber-300" />
                <span>የመዝጋቢ QR</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {currentSession && (
              <button
                onClick={() => toggleLockSession(currentSession.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  currentSession.isLocked
                    ? 'bg-rose-900/60 border-rose-500/50 text-rose-200'
                    : 'bg-emerald-900/60 border-emerald-500/50 text-emerald-200'
                }`}
                title={currentSession.isLocked ? 'መዝገቡ ተቆልፏል' : 'መዝገቡ ክፍት ነው'}
              >
                {currentSession.isLocked ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>ተቆልፏል</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>ክፍት ነው</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setShowNewSessionModal(true)}
              className="flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-white bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-400/30 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>አዲስ ክፍለ-ጊዜ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group Switcher (Interactive Segmented Control: Students vs Mothers) */}
      <div className="grid grid-cols-2 p-1 bg-stone-200/80 dark:bg-stone-800/80 rounded-xl mb-3 shadow-inner">
        <button
          onClick={() => {
            setSelectedGroup('STUDENTS');
            setActiveClassFilter('ALL');
          }}
          className={`h-11 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedGroup === 'STUDENTS'
              ? 'bg-[#80142b] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>የሰንበት ተማሪዎች ({members.filter(m => m.group === 'STUDENTS' && m.status === 'ACTIVE').length})</span>
        </button>

        <button
          onClick={() => {
            setSelectedGroup('MOTHERS');
            setActiveClassFilter('ALL');
          }}
          className={`h-11 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedGroup === 'MOTHERS'
              ? 'bg-[#80142b] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-300" />
          <span>የእናቶች ማኅበር ({members.filter(m => m.group === 'MOTHERS' && m.status === 'ACTIVE').length})</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-white border border-stone-200 rounded-xl p-2 text-center shadow-xs">
          <div className="text-[11px] text-stone-500">ተገኝቷል</div>
          <div className="text-lg font-bold text-emerald-700 tabular-nums">
            {summary.present}
          </div>
          <div className="text-[10px] text-stone-400">ወቅቱ የጠበቀ</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-2 text-center shadow-xs">
          <div className="text-[11px] text-stone-500">አርፍዷል</div>
          <div className="text-lg font-bold text-amber-600 tabular-nums">
            {summary.late}
          </div>
          <div className="text-[10px] text-stone-400">ዘግይቶ የገባ</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-2 text-center shadow-xs">
          <div className="text-[11px] text-stone-500">በፈቃድ</div>
          <div className="text-lg font-bold text-sky-600 tabular-nums">
            {summary.excused}
          </div>
          <div className="text-[10px] text-stone-400">የተፈቀደለት</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-2 text-center shadow-xs">
          <div className="text-[11px] text-stone-500">አልተገኘም</div>
          <div className="text-lg font-bold text-rose-600 tabular-nums">
            {summary.absent}
          </div>
          <div className="text-[10px] text-stone-400">የቀረ</div>
        </div>
      </div>

      {/* Search and Fast Actions Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-2.5 shadow-xs mb-3 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="በስም፣ በክርስትና ስም ወይም በስልክ ፈልግ..."
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#80142b] focus:bg-white transition"
          />
        </div>

        {/* Class level filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setActiveClassFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 font-medium transition cursor-pointer ${
              activeClassFilter === 'ALL'
                ? 'bg-[#80142b] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            ሁሉም ክፍሎች ({groupMembers.length})
          </button>

          {availableClasses.map((cls) => {
            const count = groupMembers.filter((m) => m.classLevel === cls).length;
            const isSelected = activeClassFilter === cls;
            return (
              <button
                key={cls}
                onClick={() => setActiveClassFilter(cls)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#80142b] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cls} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick Batch and QR Scanner Buttons for Recorders */}
        {currentSession && !currentSession.isLocked && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#80142b] hover:bg-[#641322] text-white rounded-lg font-bold transition cursor-pointer active:scale-95 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>በ QR ኮድ መዝግብ (Scan)</span>
            </button>

            <button
              onClick={() => markAllMembers(currentSession.id, 'PRESENT')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-medium transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ሁሉንም ተገኝተዋል በል (Mark All)</span>
            </button>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-2.5">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-6">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-600">ምንም አባል አልተገኘም</p>
            <p className="text-xs text-stone-400 mt-1">የፍለጋ ቃሉን ወይም የክፍል ምርጫውን ያስተካክሉ</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const record = currentSession?.records[member.id];
            const currentStatus = record?.status;

            return (
              <div
                key={member.id}
                className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs hover:border-stone-300 transition"
              >
                {/* Member Header Info */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#80142b]/10 text-[#80142b] font-bold text-sm flex items-center justify-center shrink-0 border border-[#80142b]/20">
                      {member.fullName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-stone-900 leading-tight">
                          {member.fullName}
                        </h3>
                        {record?.note && (
                          <span
                            onClick={() => handleOpenNote(member.id)}
                            className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-amber-100"
                            title={record.note}
                          >
                            ማስታወሻ
                          </span>
                        )}
                      </div>
                      
                      {/* Christian Name & Metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                        <span className="text-[#80142b] font-medium">የክርስትና ስም:</span>
                        <span className="font-medium text-stone-700">{member.christianName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{member.classLevel.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Quick Call and QR Code View */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQrModalMember(member)}
                      className="p-1.5 text-stone-400 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                      title="የተማሪውን QR ኮድ አሳይ"
                    >
                      <QrCode className="w-4 h-4 text-amber-700" />
                    </button>

                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title={`ደውል: ${member.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Attendance 4-State Buttons (Generous Touch Hitbox >= 44px) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {/* PRESENT */}
                  <button
                    disabled={currentSession?.isLocked}
                    onClick={() =>
                      currentSession &&
                      updateMemberAttendance(currentSession.id, member.id, 'PRESENT')
                    }
                    className={`min-h-[44px] rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40'
                        : 'bg-stone-50 hover:bg-emerald-50/70 text-stone-600 border border-stone-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mb-0.5" />
                    <span>ተገኝቷል</span>
                  </button>

                  {/* LATE */}
                  <button
                    disabled={currentSession?.isLocked}
                    onClick={() =>
                      currentSession &&
                      updateMemberAttendance(currentSession.id, member.id, 'LATE')
                    }
                    className={`min-h-[44px] rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'LATE'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-stone-50 hover:bg-amber-50/70 text-stone-600 border border-stone-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 mb-0.5" />
                    <span>አርፍዷል</span>
                  </button>

                  {/* EXCUSED */}
                  <button
                    disabled={currentSession?.isLocked}
                    onClick={() =>
                      currentSession &&
                      updateMemberAttendance(currentSession.id, member.id, 'EXCUSED')
                    }
                    className={`min-h-[44px] rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'EXCUSED'
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/40'
                        : 'bg-stone-50 hover:bg-sky-50/70 text-stone-600 border border-stone-200'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 mb-0.5" />
                    <span>በፈቃድ</span>
                  </button>

                  {/* ABSENT */}
                  <button
                    disabled={currentSession?.isLocked}
                    onClick={() =>
                      currentSession &&
                      updateMemberAttendance(currentSession.id, member.id, 'ABSENT')
                    }
                    className={`min-h-[44px] rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40'
                        : 'bg-stone-50 hover:bg-rose-50/70 text-stone-600 border border-stone-200'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5 mb-0.5" />
                    <span>አልተገኘም</span>
                  </button>
                </div>

                {/* Quick Add/Edit Note button */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100 text-[11px] text-stone-400">
                  <span>
                    {record?.timeMarked ? `የተመዘገበበት ሰዓት: ${record.timeMarked}` : 'አልተመዘገበም'}
                  </span>
                  <button
                    onClick={() => handleOpenNote(member.id)}
                    className="text-[#80142b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>{record?.note ? 'ማስታወሻ አሻሽል' : '+ ማስታወሻ ጻፍ'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Sticky Action Bar (Thumb Zone Ergonomics) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs">
            <div className="font-semibold text-stone-900">
              የዛሬው ተሳትፎ: <span className="text-[#80142b] tabular-nums font-bold text-sm">{summary.presentRate}%</span>
            </div>
            <div className="text-[11px] text-stone-500">
              {summary.present + summary.late} ከተመዘገቡ {summary.total} ተገኝተዋል
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentSession && (
              <button
                onClick={() => {
                  toggleLockSession(currentSession.id);
                }}
                className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                  currentSession.isLocked
                    ? 'bg-stone-800 hover:bg-stone-700 text-white'
                    : 'bg-[#80142b] hover:bg-[#641322] text-white'
                }`}
              >
                {currentSession.isLocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>መዝገብ ክፈት</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>አጠናቅቅና ቆልፍ</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Note Edit Modal */}
      {noteMemberId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="font-semibold text-stone-900 text-sm mb-1">
              የአቴንዳንስ ማስታወሻ ወይም ምክንያት
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              ለምሳሌ፡ የትራንስፖርት መዘግየት፣ የታመመ ሰው ለመጠየቅ፣ የትምህርት ፈተና...
            </p>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="ምክንያት ወይም ማስታወሻ እዚህ ይጻፉ..."
              className="w-full p-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-[#80142b] focus:ring-1 focus:ring-[#80142b] mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setNoteMemberId(null)}
                className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                ተመለስ
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 text-xs font-semibold bg-[#80142b] text-white rounded-lg hover:bg-[#641322] cursor-pointer"
              >
                አስቀምጥ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              አዲስ የአቴንዳንስ ክፍለ-ጊዜ ክፈት
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              የሚመዘገበውን ክፍል እና የመርሐ ግብሩን ዓይነት ይምረጡ
            </p>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  የአባላት ዓይነት
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSessionGroup('STUDENTS')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      newSessionGroup === 'STUDENTS'
                        ? 'bg-[#80142b] text-white border-[#80142b]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>የሰንበት ተማሪዎች</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSessionGroup('MOTHERS')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      newSessionGroup === 'MOTHERS'
                        ? 'bg-[#80142b] text-white border-[#80142b]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-300" />
                    <span>የእናቶች ማኅበር</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  የመርሐ ግብሩ ዓይነት (Session Type)
                </label>
                <select
                  value={newSessionType}
                  onChange={(e) => setNewSessionType(e.target.value)}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#80142b]"
                >
                  {SESSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#80142b] text-white rounded-xl hover:bg-[#641322] shadow-sm cursor-pointer"
                >
                  ክፍለ-ጊዜውን ጀምር
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modals (Member QR / Scanner / Recorder Staff Badge) */}
      {(qrModalMember || isScannerOpen || isRecorderBadgeOpen) && (
        <StudentQRModal
          member={qrModalMember}
          recorderUser={currentUser}
          mode={isScannerOpen ? 'scanner' : isRecorderBadgeOpen ? 'recorder' : 'member'}
          onClose={() => {
            setQrModalMember(null);
            setIsScannerOpen(false);
            setIsRecorderBadgeOpen(false);
          }}
        />
      )}

      {/* Mobile Connect & Installation Guide Modal */}
      <MobileConnectModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)} 
      />
    </div>
  );
};
