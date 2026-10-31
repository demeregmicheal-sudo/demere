import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Member, AttendanceSession, GroupType } from '../types';
import { STUDENT_CLASSES, MOTHER_CLASSES, SESSION_TYPES } from '../data/mockData';
import { GeezCross } from './CrossIcon';
import { StudentRegistrationCenter } from './StudentRegistrationCenter';
import { AuditLogModal } from './AuditLogModal';
import { StudentQRModal } from './StudentQRModal';
import { MobileConnectModal } from './MobileConnectModal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  Heart, 
  BarChart3, 
  Calendar, 
  FileSpreadsheet, 
  Printer, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  Unlock,
  ChevronRight,
  ExternalLink,
  Download,
  GraduationCap,
  Sparkles,
  MapPin,
  CreditCard,
  Eye,
  Plus,
  QrCode,
  ShieldCheck,
  Smartphone,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { 
    members, 
    addMember, 
    updateMember, 
    deleteMember, 
    sessions, 
    currentSession, 
    selectSession, 
    toggleLockSession, 
    deleteSession,
    getSummary,
    auditLogs,
    resetToSampleData,
    currentUser,
    showToast
  } = useApp();

  // Tab state within Admin: 'overview' | 'register' | 'members' | 'sessions' | 'reports' | 'settings'
  const currentAdminTab = ['dashboard', 'register', 'members', 'sessions', 'reports', 'settings'].includes(activeTab)
    ? activeTab
    : 'dashboard';

  // Selected student to view full profile dossier
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Member | null>(null);

  // Audit Log & QR Code Modal States
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedStudentForQR, setSelectedStudentForQR] = useState<Member | null>(null);
  const [isMobileConnectOpen, setIsMobileConnectOpen] = useState(false);

  // Sub-filter for Members Tab
  const [memberGroupFilter, setMemberGroupFilter] = useState<GroupType | 'ALL'>('ALL');
  const [memberClassFilter, setMemberClassFilter] = useState<string>('ALL');
  const [memberSearch, setMemberSearch] = useState<string>('');

  // Add/Edit Member Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState<{
    fullName: string;
    christianName: string;
    group: GroupType;
    classLevel: string;
    phone: string;
    parentName: string;
    gender: 'M' | 'F';
  }>({
    fullName: '',
    christianName: '',
    group: 'STUDENTS',
    classLevel: STUDENT_CLASSES[0],
    phone: '',
    parentName: '',
    gender: 'M'
  });

  // Selected session to inspect in Session Explorer
  const [inspectedSessionId, setInspectedSessionId] = useState<string>(sessions[0]?.id || '');
  const inspectedSession = sessions.find((s) => s.id === inspectedSessionId) || sessions[0] || null;

  // Overview Analytics Calculations
  const totalStudents = members.filter((m) => m.group === 'STUDENTS');
  const totalMothers = members.filter((m) => m.group === 'MOTHERS');

  const todaySummary = getSummary(currentSession);

  // Absentee follow-up list (Members who were absent in the latest session)
  const latestSessionAbsentees = useMemo(() => {
    if (!currentSession) return [];
    return members.filter((m) => {
      if (m.group !== currentSession.group || m.status !== 'ACTIVE') return false;
      const rec = currentSession.records[m.id];
      return !rec || rec.status === 'ABSENT';
    });
  }, [members, currentSession]);

  // Filtered members for Member Management table
  const filteredMemberList = useMemo(() => {
    return members.filter((m) => {
      const matchGroup = memberGroupFilter === 'ALL' || m.group === memberGroupFilter;
      const matchClass = memberClassFilter === 'ALL' || m.classLevel === memberClassFilter;
      const matchSearch =
        !memberSearch.trim() ||
        m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.christianName.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.phone.includes(memberSearch);
      return matchGroup && matchClass && matchSearch;
    });
  }, [members, memberGroupFilter, memberClassFilter, memberSearch]);

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      fullName: '',
      christianName: '',
      group: 'STUDENTS',
      classLevel: STUDENT_CLASSES[0],
      phone: '',
      parentName: '',
      gender: 'M'
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      fullName: member.fullName,
      christianName: member.christianName,
      group: member.group,
      classLevel: member.classLevel,
      phone: member.phone,
      parentName: member.parentName || '',
      gender: member.gender || 'M'
    });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.fullName.trim() || !memberForm.christianName.trim()) {
      showToast('እባክዎ ሙሉ ስም እና የክርስትና ስም ያስገቡ', 'error');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        fullName: memberForm.fullName.trim(),
        christianName: memberForm.christianName.trim(),
        group: memberForm.group,
        classLevel: memberForm.classLevel,
        phone: memberForm.phone.trim(),
        parentName: memberForm.parentName.trim() || undefined,
        gender: memberForm.gender
      });
    } else {
      addMember({
        fullName: memberForm.fullName.trim(),
        christianName: memberForm.christianName.trim(),
        group: memberForm.group,
        classLevel: memberForm.classLevel,
        phone: memberForm.phone.trim(),
        parentName: memberForm.parentName.trim() || undefined,
        gender: memberForm.gender,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      });
    }

    setIsMemberModalOpen(false);
  };

  // Export CSV with UTF-8 BOM for Excel compatibility
  const handleExportCSV = () => {
    if (!inspectedSession) return;
    const sessionMembers = members.filter((m) => m.group === inspectedSession.group);
    
    // Header
    const headers = ['መለያ ቁጥር', 'ሙሉ ስም', 'የክርስትና ስም', 'ክፍል', 'የመገኘት ሁኔታ', 'ሰዓት', 'ማስታወሻ', 'ስልክ'];
    
    const rows = sessionMembers.map((m) => {
      const rec = inspectedSession.records[m.id];
      const statusMap = {
        PRESENT: 'ተገኝቷል',
        LATE: 'አርፍዷል',
        EXCUSED: 'በፈቃድ',
        ABSENT: 'አልተገኘም'
      };
      const statusText = rec ? statusMap[rec.status] : 'አልተመዘገበም';
      return [
        m.id,
        `"${m.fullName}"`,
        `"${m.christianName}"`,
        `"${m.classLevel}"`,
        `"${statusText}"`,
        `"${rec?.timeMarked || '-'}"`,
        `"${rec?.note || '-'}"`,
        `"${m.phone}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ምክሃ_ደናግል_አቴንዳንስ_${inspectedSession.date}_${inspectedSession.group}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('የአቴንዳንስ መረጃ በ CSV ተዘጋጅቶ ወርዷል', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl mb-6 overflow-x-auto no-scrollbar no-print">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            currentAdminTab === 'dashboard'
              ? 'bg-white text-[#80142b] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline-block mr-1.5 text-stone-500" />
          አጠቃላይ ዳሽቦርድ (Overview)
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            currentAdminTab === 'register'
              ? 'bg-[#80142b] text-white shadow-xs'
              : 'text-[#80142b] bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30'
          }`}
        >
          <UserPlus className="w-4 h-4 inline-block mr-1.5" />
          የተማሪዎች አዲስ ምዝገባ (New Registration)
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            currentAdminTab === 'members'
              ? 'bg-white text-[#80142b] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-1.5 text-stone-500" />
          የአባላት ቁጥጥርና ምዝገባ ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            currentAdminTab === 'sessions'
              ? 'bg-white text-[#80142b] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-1.5 text-stone-500" />
          የአቴንዳንስ ታሪክና ክፍለ-ጊዜዎች ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            currentAdminTab === 'reports'
              ? 'bg-white text-[#80142b] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Printer className="w-4 h-4 inline-block mr-1.5 text-stone-500" />
          ማተሚያና ሪፖርት (Print & Export)
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Mobile Connect / QR Button */}
          <button
            onClick={() => setIsMobileConnectOpen(true)}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-stone-300 shadow-xs"
            title="አፑን በስልክ ለመክፈትና ለሌሎች መዝጋቢዎች ለማጋራት (QR Code)"
          >
            <Smartphone className="w-4 h-4 text-[#80142b]" />
            <span className="hidden sm:inline">በስልክ ክፈት (QR)</span>
          </button>

          {/* User Requested Audit Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 border border-amber-500/40"
            title="በማን ስልክ መቼ ስንት ሰዓት ላይ እንደተመዘገበ ሙሉውን መረጃ ለማግኘት"
          >
            <ShieldCheck className="w-4 h-4 text-[#80142b]" />
            <span>የመዝጋቢና የስልክ ኦዲት መረጃ (Audit Log 🔍)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 0. STUDENT REGISTRATION CENTER TAB */}
      {/* ======================================================== */}
      {currentAdminTab === 'register' && (
        <StudentRegistrationCenter 
          onRegisteredSuccess={(newStudent) => {
            setSelectedStudentProfile(newStudent);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 1. OVERVIEW & ANALYTICS TAB */}
      {/* ======================================================== */}
      {currentAdminTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Quick Registration Hero Action Banner */}
          <div className="bg-gradient-to-r from-[#4d0b19] via-[#80142b] to-[#3a0813] text-white p-5 rounded-3xl shadow-sm border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-amber-300">አዲስ ምዝገባ</span>
                  <span className="text-[11px] text-amber-200/70">· {totalStudents.length} ተማሪዎች ተመዝግበዋል</span>
                </div>
                <h3 className="font-bold text-base text-amber-50">አዳዲስ የሰንበት ተማሪዎችን መመዝገብ ይፈልጋሉ?</h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  በነጠላ ፎርም ወይም በጅምላ (Bulk) በፍጥነት ይመዝገቡ፤ መለያ ቁጥር እና መታወቂያ ካርድ ያዘጋጁ።
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>ተማሪ መመዝገቢያ ማዕከል ክፈት</span>
            </button>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">የሰንበት ተማሪዎች</span>
                <Users className="w-4 h-4 text-[#80142b]" />
              </div>
              <div className="text-3xl font-bold text-stone-900 tabular-nums">
                {totalStudents.length}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totalStudents.filter(s => s.status === 'ACTIVE').length} ንቁ ተማሪዎች
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">የእናቶች ማኅበር</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-bold text-stone-900 tabular-nums">
                {totalMothers.length}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totalMothers.filter(m => m.status === 'ACTIVE').length} ንቁ አባላት
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">የዛሬው ተሳትፎ ምጣኔ</span>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700 tabular-nums">
                {todaySummary.presentRate}%
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {todaySummary.present + todaySummary.late} ከተመዘገቡ {todaySummary.total}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">የተመዘገቡ ክፍለ-ጊዜዎች</span>
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-stone-900 tabular-nums">
                {sessions.length}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                የቅርብ: {sessions[0]?.ethiopianDate || '-'}
              </div>
            </div>
          </div>

          {/* 2-Column Split: Absentee Follow-Up Alert & Class Attendance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Absentee Follow-Up Alert Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">
                      የክትትል ዝርዝር (ያልተገኙ አባላት)
                    </h3>
                    <p className="text-xs text-stone-400">
                      በቅርብ ክፍለ-ጊዜ ያልተገኙ እና ስልክ ተደውሎ ሊጠየቁ የሚገባቸው
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md">
                  {latestSessionAbsentees.length} አባላት
                </span>
              </div>

              {latestSessionAbsentees.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  በቅርብ ክፍለ-ጊዜ የቀረ አባል የለም! ሁሉም ተሳትፈዋል ወይም ተፈቅዶላቸዋል።
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {latestSessionAbsentees.map((m) => {
                    const rec = currentSession?.records[m.id];
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">
                            {m.fullName}
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            የክርስትና ስም: <span className="text-[#80142b] font-medium">{m.christianName}</span> · {m.classLevel}
                          </div>
                          {rec?.note && (
                            <div className="text-amber-800 text-[10px] mt-0.5">
                              ምክንያት: {rec.note}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {m.phone && (
                            <a
                              href={`tel:${m.phone}`}
                              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 font-medium text-xs transition"
                              title="ደውል"
                            >
                              <Phone className="w-3 h-3" />
                              <span>ደውል ({m.phone})</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Attendance by Class Level Breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                የተማሪዎች ክፍሎች ተሳትፎ ዝርዝር
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                በእያንዳንዱ የሰንበት ት/ቤት ክፍል የተመዘገቡ ተማሪዎች ብዛት
              </p>

              <div className="space-y-3.5">
                {STUDENT_CLASSES.map((cls) => {
                  const classMembers = totalStudents.filter((m) => m.classLevel === cls);
                  const activeCount = classMembers.filter((m) => m.status === 'ACTIVE').length;
                  const ratio = totalStudents.length > 0 ? (classMembers.length / totalStudents.length) * 100 : 0;

                  return (
                    <div key={cls}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-stone-800">{cls}</span>
                        <span className="text-stone-500 tabular-nums">
                          {classMembers.length} ተማሪዎች ({Math.round(ratio)}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#80142b] h-full rounded-full transition-all duration-500"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mothers sections */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-semibold text-stone-700 mb-2">
                  የእናቶች ማኅበር ክፍሎች
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {MOTHER_CLASSES.map((cls) => {
                    const count = totalMothers.filter((m) => m.classLevel === cls).length;
                    return (
                      <div key={cls} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                        <div className="text-[11px] text-stone-500 truncate">{cls}</div>
                        <div className="text-base font-bold text-rose-700 tabular-nums mt-0.5">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <GeezCross className="w-5 h-5 text-amber-700 shrink-0" size={20} />
              <div className="text-xs text-amber-950">
                <span className="font-semibold">ምክሃ ደናግል ሰንበት ት/ቤት፡</span> መረጃዎችን በቀጥታ በሞባይል መተግበሪያው ላይ መመዝገብ ይችላሉ።
              </div>
            </div>
            <button
              onClick={resetToSampleData}
              className="text-xs text-amber-900 hover:text-amber-700 underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>የናሙና መረጃዎችን እንደገና ሙላ (Reset Data)</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MEMBERS MANAGEMENT TAB */}
      {/* ======================================================== */}
      {currentAdminTab === 'members' && (
        <div className="space-y-4">
          {/* Action and Filter Header */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Group Filter */}
              <select
                value={memberGroupFilter}
                onChange={(e) => {
                  setMemberGroupFilter(e.target.value as GroupType | 'ALL');
                  setMemberClassFilter('ALL');
                }}
                className="h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#80142b]"
              >
                <option value="ALL">ሁሉንም አባላት (ተማሪዎችና እናቶች)</option>
                <option value="STUDENTS">የሰንበት ተማሪዎች ብቻ</option>
                <option value="MOTHERS">የእናቶች ማኅበር ብቻ</option>
              </select>

              {/* Class Filter */}
              <select
                value={memberClassFilter}
                onChange={(e) => setMemberClassFilter(e.target.value)}
                className="h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#80142b]"
              >
                <option value="ALL">ሁሉም ክፍሎች</option>
                {(memberGroupFilter === 'STUDENTS' ? STUDENT_CLASSES : memberGroupFilter === 'MOTHERS' ? MOTHER_CLASSES : [...STUDENT_CLASSES, ...MOTHER_CLASSES]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="በስም ወይም በስልክ ፈልግ..."
                  className="h-10 pl-8 pr-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                />
              </div>
            </div>

            {/* Registration Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('register')}
                className="h-10 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>የተማሪዎች ምዝገባ ማዕከል</span>
              </button>

              <button
                onClick={handleOpenAddMember}
                className="h-10 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                title="ፈጣን ምዝገባ"
              >
                <Plus className="w-4 h-4" />
                <span>ፈጣን</span>
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">ሙሉ ስም</th>
                    <th className="py-3 px-4">የክርስትና ስም</th>
                    <th className="py-3 px-4">ዓይነት</th>
                    <th className="py-3 px-4">ክፍል</th>
                    <th className="py-3 px-4">ስልክ ቁጥር</th>
                    <th className="py-3 px-4">ሁኔታ</th>
                    <th className="py-3 px-4 text-right">ድርጊቶች</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMemberList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-400">
                        ምንም አባል አልተገኘም
                      </td>
                    </tr>
                  ) : (
                    filteredMemberList.map((member) => (
                      <tr key={member.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentProfile(member)}
                            className="font-semibold text-stone-900 hover:text-[#80142b] text-left transition flex items-center gap-1.5 cursor-pointer group"
                          >
                            <span>{member.fullName}</span>
                            <Eye className="w-3 h-3 text-stone-400 group-hover:text-[#80142b]" />
                          </button>
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                            {member.studentIdCode && (
                              <span className="font-mono text-amber-700 bg-amber-50 px-1 rounded border border-amber-200/60">
                                {member.studentIdCode}
                              </span>
                            )}
                            {member.parentName && (
                              <span>ወላጅ: {member.parentName}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#80142b] font-medium">
                          {member.christianName}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-medium ${
                            member.group === 'STUDENTS' ? 'text-indigo-700' : 'text-rose-700'
                          }`}>
                            {member.group === 'STUDENTS' ? 'ተማሪ' : 'እናት'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {member.classLevel}
                        </td>
                        <td className="py-3 px-4 text-stone-600 tabular-nums">
                          {member.phone ? (
                            <a href={`tel:${member.phone}`} className="hover:text-emerald-700 hover:underline">
                              {member.phone}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              updateMember(member.id, {
                                status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                              })
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                              member.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}
                          >
                            {member.status === 'ACTIVE' ? 'ንቁ (Active)' : 'ያረፈ (Inactive)'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setSelectedStudentProfile(member)}
                              className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="የተማሪውን ማኅደር ተመልከት"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditMember(member)}
                              className="p-1.5 text-stone-500 hover:text-[#80142b] hover:bg-stone-100 rounded-lg transition cursor-pointer"
                              title="አሻሽል"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`እርግጠኛ ነዎት ${member.fullName} ይሰረዝ?`)) {
                                  deleteMember(member.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="ሰርዝ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SESSIONS & HISTORY TAB */}
      {/* ======================================================== */}
      {currentAdminTab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Sessions List */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="font-bold text-sm text-stone-900">የክፍለ-ጊዜዎች መዝገብ</h3>
                <span className="text-xs text-stone-500">{sessions.length} ክፍለ-ጊዜዎች</span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {sessions.map((sess) => {
                  const sSummary = getSummary(sess);
                  const isSelected = sess.id === inspectedSessionId;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => setInspectedSessionId(sess.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-[#80142b] bg-[#80142b]/5 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-900">
                          {sess.ethiopianDate}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          sess.group === 'STUDENTS' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {sess.group === 'STUDENTS' ? 'የሰንበት ተማሪዎች' : 'የእናቶች ማኅበር'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 mb-2 truncate">
                        {sess.sessionType}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-1.5">
                        <span>ተገኝቷል: <strong className="text-emerald-700 tabular-nums">{sSummary.present}</strong>/{sSummary.total} ({sSummary.presentRate}%)</span>
                        <span className="flex items-center gap-1">
                          {sess.isLocked ? (
                            <Lock className="w-3 h-3 text-stone-400" />
                          ) : (
                            <Unlock className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>{sess.isLocked ? 'የተቆለፈ' : 'ክፍት'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Session Inspection & Actions */}
            <div className="lg:col-span-2 space-y-4">
              {inspectedSession ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  {/* Session Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                    <div>
                      <div className="text-xs text-amber-800 font-medium">
                        {inspectedSession.ethiopianDate} ({inspectedSession.date})
                      </div>
                      <h2 className="text-lg font-bold text-stone-900 mt-0.5">
                        {inspectedSession.sessionType}
                      </h2>
                      <div className="text-xs text-stone-500 mt-0.5">
                        የመዘገበው/ችው: <strong>{inspectedSession.recordedByName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLockSession(inspectedSession.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center gap-1 cursor-pointer"
                      >
                        {inspectedSession.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{inspectedSession.isLocked ? 'መዝገብ ክፈት' : 'መዝገብ ቆልፍ'}</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV አውርድ</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  {(() => {
                    const sSum = getSummary(inspectedSession);
                    return (
                      <div className="grid grid-cols-4 gap-2 my-4 text-center">
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                          <div className="text-[11px] text-emerald-800">ተገኝቷል</div>
                          <div className="text-base font-bold text-emerald-700 tabular-nums">{sSum.present}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                          <div className="text-[11px] text-amber-800">አርፍዷል</div>
                          <div className="text-base font-bold text-amber-700 tabular-nums">{sSum.late}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                          <div className="text-[11px] text-sky-800">በፈቃድ</div>
                          <div className="text-base font-bold text-sky-700 tabular-nums">{sSum.excused}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                          <div className="text-[11px] text-rose-800">አልተገኘም</div>
                          <div className="text-base font-bold text-rose-700 tabular-nums">{sSum.absent}</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Detailed Member Attendance Roster Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">አባል</th>
                          <th className="py-2.5 px-3">የክርስትና ስም</th>
                          <th className="py-2.5 px-3">ክፍል</th>
                          <th className="py-2.5 px-3">ሁኔታ</th>
                          <th className="py-2.5 px-3">ሰዓት</th>
                          <th className="py-2.5 px-3">ማስታወሻ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {members
                          .filter((m) => m.group === inspectedSession.group)
                          .map((member) => {
                            const rec = inspectedSession.records[member.id];
                            return (
                              <tr key={member.id} className="hover:bg-stone-50">
                                <td className="py-2.5 px-3 font-semibold text-stone-900">
                                  {member.fullName}
                                </td>
                                <td className="py-2.5 px-3 text-[#80142b] font-medium">
                                  {member.christianName}
                                </td>
                                <td className="py-2.5 px-3 text-stone-500">
                                  {member.classLevel}
                                </td>
                                <td className="py-2.5 px-3">
                                  {rec?.status === 'PRESENT' && (
                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>ተገኝቷል</span>
                                    </span>
                                  )}
                                  {rec?.status === 'LATE' && (
                                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>አርፍዷል</span>
                                    </span>
                                  )}
                                  {rec?.status === 'EXCUSED' && (
                                    <span className="inline-flex items-center gap-1 text-sky-600 font-semibold">
                                      <HelpCircle className="w-3.5 h-3.5" />
                                      <span>በፈቃድ</span>
                                    </span>
                                  )}
                                  {(!rec || rec.status === 'ABSENT') && (
                                    <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>አልተገኘም</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-stone-400 tabular-nums">
                                  {rec?.timeMarked || '-'}
                                </td>
                                <td className="py-2.5 px-3 text-stone-600 text-[11px]">
                                  {rec?.note || '-'}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400">
                  እባክዎ ከግራ በኩል ክፍለ-ጊዜ ይምረጡ
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PRINT & OFFICIAL REPORT TAB */}
      {/* ======================================================== */}
      {currentAdminTab === 'reports' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between no-print">
            <div className="text-xs text-stone-600">
              ይህ ገጽ ለደብሩ አስተዳደር እና ለሰንበት ት/ቤት ቦርድ በወረቀት ታትሞ የሚቀርብ ይፋዊ የመገኘት መዝገብ ነው።
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>CSV ኤክስፖርት</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#80142b] hover:bg-[#641322] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>አትም (Print / PDF)</span>
              </button>
            </div>
          </div>

          {/* Official Printable Sheet Container */}
          <div className="bg-white rounded-2xl border border-stone-300 p-8 shadow-sm print:p-0 print:border-none print:shadow-none max-w-4xl mx-auto">
            
            {/* Church Letterhead */}
            <div className="border-b-2 border-[#80142b] pb-4 mb-6 text-center relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-2 border border-amber-500/40 shadow-xs">
                <img
                  src="/src/assets/images/mikha_danagil_emblem_1793395511751.jpg"
                  alt="ምክሃ ደናግል"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-[#80142b]">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን
              </h1>
              <h2 className="text-lg font-bold text-stone-900 mt-0.5">
                ምክሃ ደናግል ሰንበት ትምህርት ቤት
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                ይፋዊ የሰንበት ተማሪዎች እና የእናቶች ማኅበር የመገኘት መቆጣጠሪያ መዝገብ
              </p>

              <div className="grid grid-cols-2 text-xs text-stone-700 mt-4 pt-3 border-t border-stone-200 text-left">
                <div>
                  <strong>የተመዘገበበት ቀን:</strong> {inspectedSession?.ethiopianDate || 'ጥቅምት 2018 ዓ.ም'}
                </div>
                <div className="text-right">
                  <strong>የመርሐ ግብር ዓይነት:</strong> {inspectedSession?.sessionType || 'የጧት መርሐ ግብር'}
                </div>
                <div className="mt-1">
                  <strong>የአባላት ክፍል:</strong> {inspectedSession?.group === 'STUDENTS' ? 'የሰንበት ተማሪዎች' : 'የእናቶች ማኅበር'}
                </div>
                <div className="text-right mt-1">
                  <strong>መዝጋቢ:</strong> {inspectedSession?.recordedByName || currentUser?.name}
                </div>
              </div>
            </div>

            {/* Attendance Roster Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800 bg-stone-50">
                  <th className="py-2 px-2 text-center w-10">ተ.ቁ</th>
                  <th className="py-2 px-3">የአባሉ ሙሉ ስም</th>
                  <th className="py-2 px-3">የክርስትና ስም</th>
                  <th className="py-2 px-3">ክፍል</th>
                  <th className="py-2 px-3 text-center">ሁኔታ</th>
                  <th className="py-2 px-3">ምክንያት / ማስታወሻ</th>
                  <th className="py-2 px-3 text-center">ፊርማ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {members
                  .filter((m) => m.group === (inspectedSession?.group || 'STUDENTS'))
                  .map((member, idx) => {
                    const rec = inspectedSession?.records[member.id];
                    const statusText =
                      rec?.status === 'PRESENT'
                        ? 'ተገኝቷል'
                        : rec?.status === 'LATE'
                        ? 'አርፍዷል'
                        : rec?.status === 'EXCUSED'
                        ? 'በፈቃድ'
                        : 'አልተገኘም';

                    return (
                      <tr key={member.id} className="leading-tight">
                        <td className="py-2 px-2 text-center text-stone-500 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-semibold text-stone-900">
                          {member.fullName}
                        </td>
                        <td className="py-2 px-3 text-[#80142b] font-medium">
                          {member.christianName}
                        </td>
                        <td className="py-2 px-3 text-stone-600">
                          {member.classLevel.split(' ')[0]}
                        </td>
                        <td className="py-2 px-3 text-center font-medium">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] ${
                              rec?.status === 'PRESENT'
                                ? 'text-emerald-800'
                                : rec?.status === 'LATE'
                                ? 'text-amber-800'
                                : rec?.status === 'EXCUSED'
                                ? 'text-sky-800'
                                : 'text-rose-800 font-bold'
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-stone-600 text-[11px]">
                          {rec?.note || '-'}
                        </td>
                        <td className="py-2 px-3 text-center border-b border-dashed border-stone-300 w-20">
                          {/* Signature line for church physical archives */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* Attendance Summary and Official Sign-Off Block */}
            <div className="mt-8 pt-4 border-t-2 border-stone-800 grid grid-cols-2 gap-8 text-xs">
              <div>
                <h4 className="font-bold text-stone-900 mb-1">የመገኘት ማጠቃለያ:</h4>
                {(() => {
                  const sum = getSummary(inspectedSession);
                  return (
                    <div className="text-stone-600 space-y-0.5">
                      <div>አጠቃላይ አባላት: {sum.total}</div>
                      <div>የተገኙ: {sum.present + sum.late} (ወቅቱን የጠበቁ: {sum.present}፣ ያረፈዱ: {sum.late})</div>
                      <div>በፈቃድ የቀሩ: {sum.excused} · ያልተገኙ: {sum.absent}</div>
                      <div>የተሳትፎ ምጣኔ: <strong>{sum.presentRate}%</strong></div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-6 text-right">
                <div>
                  <div className="font-semibold text-stone-900">የመዝጋቢው ስም እና ፊርማ:</div>
                  <div className="mt-6 border-b border-stone-400 w-48 ml-auto" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">የሰንበት ትምህርት ቤቱ ዋና ኃላፊ:</div>
                  <div className="mt-6 border-b border-stone-400 w-48 ml-auto" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT MEMBER MODAL */}
      {/* ======================================================== */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              {editingMember ? 'የአባል መረጃ ማሻሻያ' : 'አዲስ አባል መዝግብ'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              የሰንበት ተማሪ ወይም የእናቶች ማኅበር አባል ሙሉ ዝርዝር ያስገቡ
            </p>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    የአባላት ክፍል
                  </label>
                  <select
                    value={memberForm.group}
                    onChange={(e) => {
                      const grp = e.target.value as GroupType;
                      setMemberForm({
                        ...memberForm,
                        group: grp,
                        classLevel: grp === 'STUDENTS' ? STUDENT_CLASSES[0] : MOTHER_CLASSES[0]
                      });
                    }}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  >
                    <option value="STUDENTS">የሰንበት ተማሪ</option>
                    <option value="MOTHERS">የእናቶች ማኅበር</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ፆታ (Gender)
                  </label>
                  <select
                    value={memberForm.gender}
                    onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value as 'M' | 'F' })}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  >
                    <option value="M">ወንድ</option>
                    <option value="F">ሴት</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ሙሉ ስም *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.fullName}
                    onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                    placeholder="ለምሳሌ፡ ዮናታን ተስፋዬ"
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    የክርስትና ስም *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.christianName}
                    onChange={(e) => setMemberForm({ ...memberForm, christianName: e.target.value })}
                    placeholder="ለምሳሌ፡ ገብረ መድኅን"
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  የክፍል ደረጃ / ምድብ
                </label>
                <select
                  value={memberForm.classLevel}
                  onChange={(e) => setMemberForm({ ...memberForm, classLevel: e.target.value })}
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                >
                  {(memberForm.group === 'STUDENTS' ? STUDENT_CLASSES : MOTHER_CLASSES).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ስልክ ቁጥር
                  </label>
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="0911..."
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    የወላጅ / አሳዳጊ ስም
                  </label>
                  <input
                    type="text"
                    value={memberForm.parentName}
                    onChange={(e) => setMemberForm({ ...memberForm, parentName: e.target.value })}
                    placeholder="ለሕፃናት ተማሪዎች"
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#80142b]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#80142b] text-white rounded-xl hover:bg-[#641322] shadow-xs cursor-pointer"
                >
                  {editingMember ? 'አሻሽልና አስቀምጥ' : 'መዝግብ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STUDENT / MEMBER PROFILE DOSSIER MODAL */}
      {/* ======================================================== */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#3a0813] via-[#80142b] to-[#4d0b19] p-5 text-white relative">
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xl flex items-center justify-center shrink-0">
                  {selectedStudentProfile.fullName.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-300 bg-black/30 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {selectedStudentProfile.studentIdCode || `ምደ-${selectedStudentProfile.id}`}
                    </span>
                    <span className="text-xs text-amber-200/80">
                      {selectedStudentProfile.group === 'STUDENTS' ? 'የሰንበት ተማሪ' : 'የእናቶች ማኅበር'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedStudentProfile.fullName}
                  </h3>
                  <div className="text-xs text-amber-200 flex items-center gap-1.5 mt-0.5">
                    <span>የክርስትና ስም:</span>
                    <strong className="text-amber-300 font-semibold">{selectedStudentProfile.christianName}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Attendance Statistics for this member */}
              {(() => {
                const memberSessions = sessions.filter(s => s.group === selectedStudentProfile.group);
                let presentCount = 0;
                let lateCount = 0;
                let excusedCount = 0;
                let absentCount = 0;

                memberSessions.forEach(sess => {
                  const rec = sess.records[selectedStudentProfile.id];
                  if (!rec || rec.status === 'ABSENT') absentCount++;
                  else if (rec.status === 'PRESENT') presentCount++;
                  else if (rec.status === 'LATE') lateCount++;
                  else if (rec.status === 'EXCUSED') excusedCount++;
                });

                const totalAttended = presentCount + lateCount;
                const rate = memberSessions.length > 0 ? Math.round((totalAttended / memberSessions.length) * 100) : 0;

                return (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-700">የአቴንዳንስ ተሳትፎ ምጣኔ:</span>
                      <span className="text-sm font-bold text-emerald-700 tabular-nums">{rate}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500">ተገኝቷል</div>
                        <div className="font-bold text-emerald-700 tabular-nums">{presentCount}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500">አርፍዷል</div>
                        <div className="font-bold text-amber-600 tabular-nums">{lateCount}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500">በፈቃድ</div>
                        <div className="font-bold text-sky-600 tabular-nums">{excusedCount}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500">የቀረ</div>
                        <div className="font-bold text-rose-600 tabular-nums">{absentCount}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">የሰንበት ት/ቤት ክፍል</span>
                  <strong className="text-stone-800">{selectedStudentProfile.classLevel}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">የአገልግሎት ዘርፍ</span>
                  <strong className="text-stone-800">{selectedStudentProfile.department || 'አጠቃላይ ትምህርት'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">የተማሪ ስልክ</span>
                  {selectedStudentProfile.phone ? (
                    <a href={`tel:${selectedStudentProfile.phone}`} className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedStudentProfile.phone}</span>
                    </a>
                  ) : <span className="text-stone-400">ያልተመዘገበ</span>}
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">የወላጅ ስልክ</span>
                  {selectedStudentProfile.parentPhone ? (
                    <a href={`tel:${selectedStudentProfile.parentPhone}`} className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedStudentProfile.parentPhone}</span>
                    </a>
                  ) : <span className="text-stone-400">{selectedStudentProfile.parentName ? `${selectedStudentProfile.parentName} (ስልክ የለም)` : 'ያልተመዘገበ'}</span>}
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">መኖሪያ ሰፈር</span>
                  <strong className="text-stone-800">{selectedStudentProfile.address || 'ደብሩ አካባቢ'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block mb-0.5">የምዝገባ ቀን</span>
                  <strong className="text-stone-800">{selectedStudentProfile.ethiopianJoinedDate || selectedStudentProfile.joinedDate}</strong>
                </div>
              </div>

              {/* Student Unique QR Code Card */}
              <div className="bg-[#faf7f2] p-4 rounded-2xl border border-amber-300 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#80142b]">
                    <QrCode className="w-4 h-4 text-amber-700" />
                    <span>የተማሪው ይፋዊ QR ኮድ</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    ይህ QR ኮድ የተማሪውን መለያ፣ የክርስትና ስም እና ክፍል በውስጡ የያዘ ነው።
                  </p>
                  <button
                    onClick={() => setSelectedStudentForQR(selectedStudentProfile)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>በትልቁ ተመልከት እና አትም</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-xs border border-stone-200 shrink-0">
                  <QRCodeSVG
                    value={JSON.stringify({
                      org: 'MIKHA_DANAGIL_SUNDAY_SCHOOL',
                      id: selectedStudentProfile.id,
                      code: selectedStudentProfile.studentIdCode || `MD-${selectedStudentProfile.id}`,
                      name: selectedStudentProfile.fullName,
                      christianName: selectedStudentProfile.christianName,
                      class: selectedStudentProfile.classLevel
                    })}
                    size={80}
                    level="M"
                  />
                </div>
              </div>

              {/* Verified Registrar Audit Card (Who, Phone, Device, Exact Time) */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>የመዝጋቢና የስልክ ኦዲት መረጃ (Audit Verification)</span>
                  </div>
                  <button
                    onClick={() => setIsAuditModalOpen(true)}
                    className="text-[11px] font-semibold text-amber-900 underline hover:text-amber-700 cursor-pointer"
                  >
                    ሙሉ ሎግ እይ
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-stone-500 block">የመዘገበው ሰው:</span>
                    <strong className="text-stone-800">
                      {selectedStudentProfile.registeredByUserName || 'ቀሲስ ዳንኤል ከበደ (አስተዳዳሪ)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">የመዘገበበት ስልክ:</span>
                    <strong className="text-emerald-800 font-mono">
                      {selectedStudentProfile.registeredByUserPhone || '0911-234567'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">የመዘገበበት መሣሪያ:</span>
                    <strong className="text-stone-800">
                      {selectedStudentProfile.registeredDevice || 'ስማርት ስልክ (Android Mobile)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">የተመዘገበበት ሰዓት:</span>
                    <strong className="text-stone-800">
                      {selectedStudentProfile.registeredAtExactTime 
                        ? new Date(selectedStudentProfile.registeredAtExactTime).toLocaleTimeString('am-ET') 
                        : '09:30:15 ጠዋት'}
                    </strong>
                  </div>
                </div>
              </div>

              {selectedStudentProfile.notes && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-[10px] text-stone-400 font-bold block mb-0.5">ልዩ ማስታወሻ:</span>
                  <p className="text-stone-700">{selectedStudentProfile.notes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const memberToEdit = selectedStudentProfile;
                    setSelectedStudentProfile(null);
                    handleOpenEditMember(memberToEdit);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>መረጃ አሻሽል</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const studentForQR = selectedStudentProfile;
                      setSelectedStudentProfile(null);
                      setSelectedStudentForQR(studentForQR);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-xs cursor-pointer font-bold"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR ኮድ ክፈት</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentProfile(null);
                      setActiveTab('register');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#80142b] hover:bg-[#641322] text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>መታወቂያ አትም</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal (Requested by Admin to view Who, Phone, Exact Time and Device) */}
      {isAuditModalOpen && (
        <AuditLogModal onClose={() => setIsAuditModalOpen(false)} />
      )}

      {/* Student QR Code Modal */}
      {selectedStudentForQR && (
        <StudentQRModal
          member={selectedStudentForQR}
          onClose={() => setSelectedStudentForQR(null)}
        />
      )}

      {/* Mobile Connect & Installation Guide Modal */}
      {isMobileConnectOpen && (
        <MobileConnectModal 
          isOpen={isMobileConnectOpen} 
          onClose={() => setIsMobileConnectOpen(false)} 
        />
      )}
    </div>
  );
};
