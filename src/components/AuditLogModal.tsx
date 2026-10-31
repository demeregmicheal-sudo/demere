import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLogItem } from '../types';
import { formatExactTimestampAmharic } from '../utils/deviceInfo';
import { GeezCross } from './CrossIcon';
import { 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  Calendar, 
  UserCheck, 
  Phone, 
  Search, 
  Filter, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Download,
  Laptop
} from 'lucide-react';

interface AuditLogModalProps {
  onClose: () => void;
  targetFilterMemberId?: string;
  targetFilterSessionId?: string;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ 
  onClose,
  targetFilterMemberId,
  targetFilterSessionId
}) => {
  const { auditLogs, members, sessions } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>('ALL');

  // Filtered Audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = 
        !searchTerm.trim() ||
        log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userPhone.includes(searchTerm) ||
        log.device.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
      const matchRegistrar = selectedRegistrar === 'ALL' || log.userName === selectedRegistrar;

      return matchSearch && matchAction && matchRegistrar;
    });
  }, [auditLogs, searchTerm, actionFilter, selectedRegistrar]);

  // Unique registrars in the log
  const registrars = useMemo(() => {
    const names = new Set(auditLogs.map(l => l.userName));
    return Array.from(names);
  }, [auditLogs]);

  const handleExportAuditCSV = () => {
    const headers = ['ተ.ቁ', 'ክንውን', 'የአባሉ ስም', 'የመዘገበው ሰው', 'የመዝጋቢው ስልክ', 'የመዘገበበት መሣሪያ/ስልክ', 'ቀንና ሰዓት', 'ዝርዝር'];
    const rows = filteredLogs.map((log, idx) => [
      idx + 1,
      `"${log.actionTitle}"`,
      `"${log.targetName}"`,
      `"${log.userName}"`,
      `"${log.userPhone}"`,
      `"${log.device}"`,
      `"${log.formattedDate}"`,
      `"${log.details}"`
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ምክሃ_ደናግል_የመዝጋቢና_ስልክ_ኦዲት_መረጃ_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2a0810] via-[#641322] to-[#3a0813] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition cursor-pointer"
            title="ዝጋ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  የአስተዳዳሪ ቁጥጥር (Admin Audit Trail)
                </span>
                <span className="text-xs text-amber-200/70">· {auditLogs.length} የተመዘገቡ ክንውኖች</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                የመዝጋቢ፣ የስልክ ቁጥር እና የሰዓት ኦዲት መረጃ
              </h2>
              <p className="text-xs text-amber-200/80 mt-0.5">
                ማን በምን ስልክ፣ በየትኛው መሣሪያ፣ በየትኛው ቀንና ሰከንድ እንደመዘገበ የሚያሳይ ይፋዊ መዝገብ
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="በመዝጋቢ ስም፣ በስልክ ቁጥር ወይም በተማሪ ስም ፈልግ..."
                className="w-full h-10 pl-8 pr-3 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#80142b]"
              />
            </div>

            {/* Registrar filter */}
            <select
              value={selectedRegistrar}
              onChange={(e) => setSelectedRegistrar(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-stone-300 rounded-xl font-medium focus:outline-none focus:border-[#80142b]"
            >
              <option value="ALL">ሁሉም መዝጋቢዎች</option>
              {registrars.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Action filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-stone-300 rounded-xl font-medium focus:outline-none focus:border-[#80142b]"
            >
              <option value="ALL">ሁሉም ክንውኖች</option>
              <option value="MEMBER_REGISTERED">አዲስ ተማሪ ምዝገባ</option>
              <option value="ATTENDANCE_MARKED">የአቴንዳንስ መገኘት</option>
              <option value="BATCH_MARKED">የጅምላ ምዝገባ</option>
              <option value="SESSION_LOCKED">የመዝገብ መቆለፍ</option>
            </select>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV አውርድ</span>
          </button>
        </div>

        {/* Audit Log Table / Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-8">
              <ShieldCheck className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600">ምንም የኦዲት መረጃ አልተገኘም</p>
              <p className="text-xs text-stone-400 mt-1">የፍለጋ ቃሉን ወይም የክንውን ማጣሪያውን ያስተካክሉ</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const exact = formatExactTimestampAmharic(log.timestamp);

              return (
                <div
                  key={log.id}
                  className="bg-white border border-stone-200 hover:border-amber-400/80 rounded-2xl p-4 shadow-xs transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.action === 'MEMBER_REGISTERED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : log.action === 'SESSION_LOCKED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {log.actionTitle}
                      </span>
                      <strong className="text-xs sm:text-sm text-stone-900 font-bold">
                        {log.targetName}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{exact.full}</span>
                    </div>
                  </div>

                  {/* Registrar and Device Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    {/* Column 1: Registrar Name & Role */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div className="w-8 h-8 rounded-lg bg-[#80142b]/10 text-[#80142b] font-bold flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-stone-400 block leading-tight">የመዘገበው ሰው</span>
                        <strong className="text-stone-800 font-semibold">{log.userName}</strong>
                        <span className="text-[10px] text-stone-500 block truncate">{log.userRole}</span>
                      </div>
                    </div>

                    {/* Column 2: Registrar Phone */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-stone-400 block leading-tight">የመዘገበበት ስልክ ቁጥር</span>
                        <a 
                          href={`tel:${log.userPhone}`}
                          className="font-mono font-bold text-emerald-800 hover:underline block truncate"
                        >
                          {log.userPhone}
                        </a>
                        <span className="text-[10px] text-stone-400">የተረጋገጠ መዝጋቢ</span>
                      </div>
                    </div>

                    {/* Column 3: Device / Browser Info */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-stone-400 block leading-tight">የመዘገበበት መሣሪያ / ስልክ</span>
                        <strong className="text-stone-800 font-semibold truncate block" title={log.device}>
                          {log.device}
                        </strong>
                        <span className="text-[10px] text-stone-400">የደብሩ ሲስተም ደንበኛ</span>
                      </div>
                    </div>
                  </div>

                  {log.details && (
                    <div className="mt-2.5 text-[11px] text-stone-600 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                      <strong>ማስታወሻ / ሁኔታ:</strong> {log.details}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 shrink-0 flex items-center justify-between text-xs text-stone-500">
          <div>
            ምክሃ ደናግል ሰንበት ትምህርት ቤት · የኦዲት መቆጣጠሪያ ሲስተም
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl transition cursor-pointer"
          >
            ዝጋ
          </button>
        </div>

      </div>
    </div>
  );
};
