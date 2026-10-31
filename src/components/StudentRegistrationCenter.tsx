import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Member, GroupType } from '../types';
import { 
  STUDENT_CLASSES, 
  MOTHER_CLASSES, 
  CHURCH_DEPARTMENTS, 
  COMMON_CHRISTIAN_NAMES, 
  RESIDENTIAL_AREAS 
} from '../data/mockData';
import { formatToEthiopianDate, getTodayISODate } from '../utils/ethiopianDate';
import { GeezCross } from './CrossIcon';
import { 
  UserPlus, 
  Users, 
  Sparkles, 
  Printer, 
  Check, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Calendar,
  CreditCard,
  QrCode,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StudentRegistrationCenterProps {
  onClose?: () => void;
  onRegisteredSuccess?: (member: Member) => void;
}

export const StudentRegistrationCenter: React.FC<StudentRegistrationCenterProps> = ({ 
  onClose,
  onRegisteredSuccess 
}) => {
  const { addMember, showToast, members } = useApp();

  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'id_card'>('single');

  // Single Registration Form State
  const todayISO = getTodayISODate();
  const todayEth = formatToEthiopianDate(todayISO);

  const [group, setGroup] = useState<GroupType>('STUDENTS');
  const [fullName, setFullName] = useState('');
  const [christianName, setChristianName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState<string>('');
  const [classLevel, setClassLevel] = useState<string>(STUDENT_CLASSES[0]);
  const [academicGrade, setAcademicGrade] = useState<string>('');
  const [department, setDepartment] = useState<string>(CHURCH_DEPARTMENTS[0]);
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState<string>(RESIDENTIAL_AREAS[0]);
  const [notes, setNotes] = useState('');

  // Auto-generate next Student ID code
  const studentCount = members.filter(m => m.group === 'STUDENTS').length;
  const generatedIdCode = `ምደ-${group === 'STUDENTS' ? 'ተማ' : 'እናት'}-${String(studentCount + 1).padStart(3, '0')}`;

  // Bulk Registration rows state
  const [bulkRows, setBulkRows] = useState<Array<{
    id: string;
    fullName: string;
    christianName: string;
    classLevel: string;
    phone: string;
    parentPhone: string;
  }>>([
    { id: '1', fullName: '', christianName: '', classLevel: STUDENT_CLASSES[0], phone: '', parentPhone: '' },
    { id: '2', fullName: '', christianName: '', classLevel: STUDENT_CLASSES[0], phone: '', parentPhone: '' },
    { id: '3', fullName: '', christianName: '', classLevel: STUDENT_CLASSES[0], phone: '', parentPhone: '' }
  ]);

  // ID Card Preview Member
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Member | null>(() => {
    return members.find(m => m.group === 'STUDENTS') || null;
  });

  // Handle Single Submission
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('እባክዎ የተማሪውን ሙሉ ስም ያስገቡ', 'error');
      return;
    }

    if (!christianName.trim()) {
      showToast('እባክዎ የተማሪውን የክርስትና ስም ያስገቡ', 'error');
      return;
    }

    const newMemberData: Omit<Member, 'id'> = {
      studentIdCode: generatedIdCode,
      fullName: fullName.trim(),
      christianName: christianName.trim(),
      group,
      classLevel,
      phone: phone.trim(),
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      academicGrade: academicGrade.trim() || undefined,
      address,
      department,
      joinedDate: todayISO,
      ethiopianJoinedDate: todayEth,
      status: 'ACTIVE',
      notes: notes.trim() || undefined
    };

    const created = addMember(newMemberData);
    setSelectedStudentForCard(created);

    // Reset fields
    setFullName('');
    setChristianName('');
    setAge('');
    setAcademicGrade('');
    setPhone('');
    setParentName('');
    setParentPhone('');
    setNotes('');

    showToast(`ተማሪ ${newMemberData.fullName} በተሳካ ሁኔታ ተመዝግቧል! (መለያ: ${generatedIdCode})`, 'success');

    if (onRegisteredSuccess) {
      onRegisteredSuccess(created);
    }
  };

  // Add Row to Bulk Registration
  const handleAddBulkRow = () => {
    setBulkRows(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        fullName: '',
        christianName: '',
        classLevel: STUDENT_CLASSES[0],
        phone: '',
        parentPhone: ''
      }
    ]);
  };

  const handleRemoveBulkRow = (id: string) => {
    if (bulkRows.length <= 1) return;
    setBulkRows(prev => prev.filter(r => r.id !== id));
  };

  const handleBulkChange = (id: string, field: string, value: string) => {
    setBulkRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = bulkRows.filter(r => r.fullName.trim() && r.christianName.trim());

    if (validRows.length === 0) {
      showToast('እባክዎ ቢያንስ የአንድ ተማሪ ሙሉ ስም እና የክርስትና ስም ያስገቡ', 'error');
      return;
    }

    validRows.forEach((r, idx) => {
      addMember({
        studentIdCode: `ምደ-ተማ-${String(studentCount + idx + 1).padStart(3, '0')}`,
        fullName: r.fullName.trim(),
        christianName: r.christianName.trim(),
        group: 'STUDENTS',
        classLevel: r.classLevel,
        phone: r.phone.trim(),
        parentPhone: r.parentPhone.trim() || undefined,
        gender: 'M',
        joinedDate: todayISO,
        ethiopianJoinedDate: todayEth,
        status: 'ACTIVE'
      });
    });

    showToast(`${validRows.length} ተማሪዎች በጅምላ በተሳካ ሁኔታ ተመዝግበዋል!`, 'success');
    setBulkRows([
      { id: '1', fullName: '', christianName: '', classLevel: STUDENT_CLASSES[0], phone: '', parentPhone: '' },
      { id: '2', fullName: '', christianName: '', classLevel: STUDENT_CLASSES[0], phone: '', parentPhone: '' }
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#4d0b19] via-[#80142b] to-[#4d0b19] p-5 sm:p-6 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <GeezCross className="w-7 h-7 text-amber-300" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                  የሰንበት ት/ቤት አስተዳደር
                </span>
                <span className="text-[11px] text-amber-200/70">· {todayEth}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                የተማሪዎች ይፋዊ መመዝገቢያ ማዕከል
              </h2>
            </div>
          </div>

          {/* Registration Mode Toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-black/30 rounded-xl backdrop-blur-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'single'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ነጠላ ምዝገባ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bulk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bulk'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ፈጣን የጅምላ ምዝገባ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('id_card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'id_card'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>የተማሪ መታወቂያ / ካርድ</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-white/70 hover:text-white rounded-lg transition"
                title="ዝጋ"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SINGLE REGISTRATION FORM */}
      {/* ======================================================== */}
      {activeTab === 'single' && (
        <form onSubmit={handleSingleSubmit} className="p-5 sm:p-8 space-y-6">
          
          {/* Group and ID Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700">የአባል ምድብ:</span>
              <div className="inline-flex rounded-xl p-1 bg-stone-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setGroup('STUDENTS');
                    setClassLevel(STUDENT_CLASSES[0]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    group === 'STUDENTS' ? 'bg-[#80142b] text-white shadow-xs' : 'text-stone-700'
                  }`}
                >
                  የሰንበት ተማሪ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGroup('MOTHERS');
                    setClassLevel(MOTHER_CLASSES[0]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    group === 'MOTHERS' ? 'bg-[#80142b] text-white shadow-xs' : 'text-stone-700'
                  }`}
                >
                  የእናቶች ማኅበር
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">የተመደበ መለያ ቁጥር:</span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg font-mono">
                {generatedIdCode}
              </span>
            </div>
          </div>

          {/* Section 1: የግል ማንነት (Personal Identity) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <div className="w-6 h-6 rounded-md bg-[#80142b]/10 text-[#80142b] flex items-center justify-center font-bold text-xs">
                ፩
              </div>
              <h3 className="font-bold text-sm text-stone-900">የግል ማንነት እና የክርስትና ስም</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የተማሪው ሙሉ ስም (የአያት ስምን ጨምሮ) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ለምሳሌ፡ ዮናታን ተስፋዬ ገብረ ማርያም"
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b] focus:bg-white transition"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የክርስትና ስም (የጥምቀት ስም) *
                </label>
                <input
                  type="text"
                  required
                  value={christianName}
                  onChange={(e) => setChristianName(e.target.value)}
                  placeholder="ለምሳሌ፡ ገብረ መድኅን ወይም ወለተ ማርያም"
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-[#80142b] focus:outline-none focus:border-[#80142b] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ፆታ (Gender)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#80142b]"
                >
                  <option value="M">ወንድ</option>
                  <option value="F">ሴት</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ዕድሜ (Age)
                </label>
                <input
                  type="number"
                  min="3"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="ለምሳሌ፡ 14"
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የተማሪው ስልክ ቁጥር
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0911223344"
                    className="w-full h-11 pl-9 pr-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b]"
                  />
                </div>
              </div>
            </div>

            {/* Quick Suggestions for Christian Names */}
            <div>
              <span className="text-[11px] text-stone-500 mr-2">ፈጣን የክርስትና ስም ምርጫዎች:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {COMMON_CHRISTIAN_NAMES.slice(0, 8).map(cn => (
                  <button
                    key={cn}
                    type="button"
                    onClick={() => setChristianName(cn)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 transition cursor-pointer"
                  >
                    {cn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: የሰንበት ት/ቤት እና የመደበኛ ትምህርት መረጃ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <div className="w-6 h-6 rounded-md bg-[#80142b]/10 text-[#80142b] flex items-center justify-center font-bold text-xs">
                ፪
              </div>
              <h3 className="font-bold text-sm text-stone-900">የሰንበት ት/ቤት ክፍል እና የአገልግሎት ዘርፍ</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የሰንበት ት/ቤት ክፍል / ደረጃ *
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#80142b]"
                >
                  {(group === 'STUDENTS' ? STUDENT_CLASSES : MOTHER_CLASSES).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የመደበኛ ትምህርት ክፍል (አካዳሚክ ደረጃ)
                </label>
                <input
                  type="text"
                  value={academicGrade}
                  onChange={(e) => setAcademicGrade(e.target.value)}
                  placeholder="ለምሳሌ፡ 7ኛ ክፍል ወይም ዩኒቨርሲቲ"
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የአገልግሎት ዘርፍ / ክፍል ፍላጎት
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#80142b]"
                >
                  {CHURCH_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: የወላጅና የመኖሪያ አድራሻ መረጃ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <div className="w-6 h-6 rounded-md bg-[#80142b]/10 text-[#80142b] flex items-center justify-center font-bold text-xs">
                ፫
              </div>
              <h3 className="font-bold text-sm text-stone-900">የወላጅ/አሳዳጊ መረጃ እና የመኖሪያ አድራሻ</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የወላጅ / አሳዳጊ ሙሉ ስም
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="ለምሳሌ፡ አቶ ዳዊት በቀለ"
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የወላጅ ስልክ ቁጥር (ለአደጋ ጊዜ እና ለክትትል)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full h-11 pl-9 pr-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  የመኖሪያ አድራሻ / ሰፈር
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#80142b]"
                  >
                    {RESIDENTIAL_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                ተጨማሪ ማስታወሻ / ልዩ ሁኔታዎች (አስፈላጊ ከሆነ)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ለምሳሌ፡ የቀድሞ የሰንበት ት/ቤት ልምድ፣ የጤና ሁኔታ..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#80142b] focus:bg-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>የተመዘገበው ተማሪ በቀጥታ በሞባይል አቴንዳንስ መዝገብ ላይ ይካተታል።</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  ተመለስ
                </button>
              )}
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-[#80142b] to-[#a31a37] hover:from-[#641322] hover:to-[#80142b] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#80142b]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>ተማሪውን መዝግብ (Register Student)</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* ======================================================== */}
      {/* 2. BULK REGISTRATION FORM */}
      {/* ======================================================== */}
      {activeTab === 'bulk' && (
        <form onSubmit={handleBulkSubmit} className="p-5 sm:p-8 space-y-6">
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  ፈጣን የበርካታ ተማሪዎች የጅምላ ምዝገባ
                </h4>
                <p className="text-[11px] text-amber-900/80">
                  ሙሉ ስማቸውንና የክርስትና ስማቸውን በፍጥነት ሞልተው በአንድ ጊዜ መመዝገብ ይችላሉ።
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddBulkRow}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ተማሪ ጨምር</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">የተማሪው ሙሉ ስም *</th>
                  <th className="py-2.5 px-3">የክርስትና ስም *</th>
                  <th className="py-2.5 px-3">የሰንበት ት/ቤት ክፍል</th>
                  <th className="py-2.5 px-3">የተማሪ ስልክ</th>
                  <th className="py-2.5 px-3">የወላጅ ስልክ</th>
                  <th className="py-2.5 px-3 text-center w-12">ሰርዝ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bulkRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-stone-50/60">
                    <td className="py-2 px-3 text-stone-400 font-mono text-center">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        required
                        value={row.fullName}
                        onChange={(e) => handleBulkChange(row.id, 'fullName', e.target.value)}
                        placeholder="ሙሉ ስም"
                        className="w-full h-9 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:bg-white focus:border-[#80142b]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        required
                        value={row.christianName}
                        onChange={(e) => handleBulkChange(row.id, 'christianName', e.target.value)}
                        placeholder="የክርስትና ስም"
                        className="w-full h-9 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-[#80142b] focus:bg-white focus:border-[#80142b]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        value={row.classLevel}
                        onChange={(e) => handleBulkChange(row.id, 'classLevel', e.target.value)}
                        className="w-full h-9 px-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:bg-white focus:border-[#80142b]"
                      >
                        {STUDENT_CLASSES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="tel"
                        value={row.phone}
                        onChange={(e) => handleBulkChange(row.id, 'phone', e.target.value)}
                        placeholder="09..."
                        className="w-full h-9 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:bg-white"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="tel"
                        value={row.parentPhone}
                        onChange={(e) => handleBulkChange(row.id, 'parentPhone', e.target.value)}
                        placeholder="09..."
                        className="w-full h-9 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:bg-white"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveBulkRow(row.id)}
                        disabled={bulkRows.length <= 1}
                        className="p-1.5 text-stone-400 hover:text-rose-600 disabled:opacity-30 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddBulkRow}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ሌላ ተማሪ ጨምር</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#80142b] hover:bg-[#641322] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition"
            >
              ሁሉንም በጅምላ መዝግብ ({bulkRows.filter(r => r.fullName.trim()).length} ተማሪዎች)
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT ID CARD / REGISTRATION SLIP */}
      {/* ======================================================== */}
      {activeTab === 'id_card' && (
        <div className="p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-stone-700">ተማሪ ይምረጡ:</label>
              <select
                value={selectedStudentForCard?.id || ''}
                onChange={(e) => {
                  const found = members.find(m => m.id === e.target.value);
                  if (found) setSelectedStudentForCard(found);
                }}
                className="h-10 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#80142b]"
              >
                {members.filter(m => m.group === 'STUDENTS').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.christianName})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#80142b] hover:bg-[#641322] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>መታወቂያውን / ደረሰኙን አትም (Print Card)</span>
            </button>
          </div>

          {selectedStudentForCard && (
            <div className="max-w-md mx-auto bg-gradient-to-br from-[#2a0810] via-[#4d0b19] to-[#1e050b] text-white p-6 rounded-3xl shadow-2xl border-2 border-amber-400/50 relative overflow-hidden">
              {/* Watermark Cross */}
              <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
                <GeezCross className="w-48 h-48 text-amber-300" size={192} />
              </div>

              {/* Card Header */}
              <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-amber-400/60 shrink-0 bg-black">
                  <img
                    src="/src/assets/images/mikha_danagil_emblem_1793395511751.jpg"
                    alt="ምክሃ ደናግል"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-100 leading-tight">
                    ምክሃ ደናግል ሰንበት ትምህርት ቤት
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    ይፋዊ የሰንበት ተማሪ መታወቂያ ካርድ
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo & QR Pair */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <div className="w-20 h-24 rounded-2xl bg-amber-950/60 border border-amber-400/40 flex flex-col items-center justify-center text-amber-300 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-lg text-amber-200 mb-1">
                      {selectedStudentForCard.fullName.slice(0, 1)}
                    </div>
                    <span className="text-[9px] text-amber-300/60 font-medium">ፎቶ</span>
                  </div>

                  {/* High Quality Student Scannable QR Code */}
                  <div className="bg-white p-1.5 rounded-xl border border-amber-400/80 shadow-md flex flex-col items-center">
                    <QRCodeSVG 
                      value={`MDSS:${selectedStudentForCard.id}:${selectedStudentForCard.studentIdCode || selectedStudentForCard.id}`}
                      size={72}
                      level="H"
                      includeMargin={false}
                    />
                    <span className="text-[8px] font-mono font-bold text-stone-800 mt-0.5">መለያ QR</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-xs w-full">
                  <div>
                    <span className="text-[10px] text-amber-300/70 block">ሙሉ ስም</span>
                    <strong className="text-amber-50 font-bold text-sm block">
                      {selectedStudentForCard.fullName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-300/70 block">የክርስትና ስም</span>
                    <strong className="text-amber-300 font-semibold text-sm block">
                      {selectedStudentForCard.christianName}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-amber-300/70 block">ክፍል</span>
                      <span className="text-stone-200 font-medium text-xs">
                        {selectedStudentForCard.classLevel}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-300/70 block">መለያ ቁጥር</span>
                      <span className="text-amber-400 font-mono font-bold text-xs">
                        {selectedStudentForCard.studentIdCode || `ምደ-${selectedStudentForCard.id}`}
                      </span>
                    </div>
                  </div>

                  {/* Registrar Audit Tag */}
                  {selectedStudentForCard.registeredByUserName && (
                    <div className="pt-2 border-t border-amber-500/20 text-[10px] text-amber-200/70 flex items-center justify-between">
                      <span>መዝጋቢ: {selectedStudentForCard.registeredByUserName}</span>
                      {selectedStudentForCard.registeredByUserPhone && (
                        <span className="font-mono text-amber-300">ስልክ: {selectedStudentForCard.registeredByUserPhone}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-[10px] text-amber-200/70">
                <div>የተመዘገበበት ቀን: {selectedStudentForCard.ethiopianJoinedDate || todayEth}</div>
                <div className="font-semibold text-amber-400">የአስተዳዳሪ ማህተም ✝</div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
