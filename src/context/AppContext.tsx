import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Member, AttendanceSession, AttendanceRecord, AttendanceStatus, GroupType, AttendanceSummary, AuditLogItem } from '../types';
import { INITIAL_USERS, INITIAL_MEMBERS, INITIAL_SESSIONS } from '../data/mockData';
import { getTodayISODate, formatToEthiopianDate } from '../utils/ethiopianDate';
import { detectClientDevice, formatExactTimestampAmharic } from '../utils/deviceInfo';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  
  viewMode: 'MOBILE' | 'ADMIN';
  setViewMode: (mode: 'MOBILE' | 'ADMIN') => void;
  
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  sessions: AttendanceSession[];
  currentSession: AttendanceSession | null;
  selectSession: (sessionId: string) => void;
  createSession: (group: GroupType, sessionType: string, date?: string) => AttendanceSession;
  updateMemberAttendance: (sessionId: string, memberId: string, status: AttendanceStatus, note?: string) => void;
  markAllMembers: (sessionId: string, status: AttendanceStatus) => void;
  toggleLockSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  selectedGroup: GroupType;
  setSelectedGroup: (group: GroupType) => void;
  
  getSummary: (session: AttendanceSession | null) => AttendanceSummary;
  
  // --- Audit Trail & Device Tracking ---
  auditLogs: AuditLogItem[];
  logAuditEvent: (item: Omit<AuditLogItem, 'id' | 'timestamp' | 'formattedDate'>) => void;

  resetToSampleData: () => void;
  
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const STORAGE_KEYS = {
  USER: 'mikha_danagil_user',
  MEMBERS: 'mikha_danagil_members',
  SESSIONS: 'mikha_danagil_sessions',
  VIEW_MODE: 'mikha_danagil_viewmode',
  AUDIT_LOGS: 'mikha_danagil_audit_logs'
};

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    action: 'MEMBER_REGISTERED',
    actionTitle: 'አዲስ ተማሪ ምዝገባ',
    targetName: 'ዮናታን ተስፋዬ (ገብረ መድኅን)',
    userName: 'ቀሲስ ዳንኤል ከበደ',
    userPhone: '0911-234567',
    userRole: 'ዋና አስተዳዳሪ',
    device: 'Admin Management Console (PC/Tablet)',
    timestamp: '2026-10-30T08:30:15.000Z',
    formattedDate: 'ጥቅምት 20 2018 ዓ.ም በ8:30:15 ጠዋት',
    details: 'በማዕከላዊያን (ከ9-12ኛ ክፍል) ተመዝግቧል፤ መለያ ኮድ ምደ-ተማ-001'
  },
  {
    id: 'log-02',
    action: 'ATTENDANCE_MARKED',
    actionTitle: 'የአቴንዳንስ መገኘት',
    targetName: 'ዮናታን ተስፋዬ',
    userName: 'ዲ/ን ቴዎድሮስ ሰለሞን',
    userPhone: '0922-345678',
    userRole: 'የተማሪዎች አቴንዳንስ መዝጋቢ',
    device: 'Samsung Galaxy A54 (Android Mobile)',
    timestamp: '2026-10-30T09:05:14.000Z',
    formattedDate: 'ጥቅምት 20 2018 ዓ.ም በ9:05:14 ጠዋት',
    details: 'ሁኔታ: ተገኝቷል (ወቅቱን ጠብቆ)'
  },
  {
    id: 'log-03',
    action: 'ATTENDANCE_MARKED',
    actionTitle: 'የአቴንዳንስ መገኘት',
    targetName: 'ሄለን ዳዊት',
    userName: 'ዲ/ን ቴዎድሮስ ሰለሞን',
    userPhone: '0922-345678',
    userRole: 'የተማሪዎች አቴንዳንስ መዝጋቢ',
    device: 'Samsung Galaxy A54 (Android Mobile)',
    timestamp: '2026-10-30T09:40:22.000Z',
    formattedDate: 'ጥቅምት 20 2018 ዓ.ም በ9:40:22 ጠዋት',
    details: 'ሁኔታ: አርፍዷል (ማስታወሻ፡ የትራንስፖርት መዘግየት)'
  },
  {
    id: 'log-04',
    action: 'ATTENDANCE_MARKED',
    actionTitle: 'የእናቶች አቴንዳንስ',
    targetName: 'ወ/ሮ ዘውድነሽ ታደሰ',
    userName: 'ወ/ሮ ዘውድነሽ ታደሰ',
    userPhone: '0933-456789',
    userRole: 'የእናቶች ማኅበር አስተባባሪ',
    device: 'iPhone 13 (iOS Safari Mobile)',
    timestamp: '2026-10-30T10:30:45.000Z',
    formattedDate: 'ጥቅምት 20 2018 ዓ.ም በ10:30:45 ጠዋት',
    details: 'ሁኔታ: ተገኝቷል (በቅድስት ማርያም ክፍል)'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USERS[0]; // Default logged in as admin for ease of preview, can logout anytime
  });

  // 2. View Mode (Mobile view vs Admin portal view)
  const [viewMode, setViewModeState] = useState<'MOBILE' | 'ADMIN'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (saved === 'MOBILE' || saved === 'ADMIN') return saved;
    } catch {
      // ignore
    }
    return 'MOBILE'; // Start with mobile view as user emphasized mobile app
  });

  const setViewMode = (mode: 'MOBILE' | 'ADMIN') => {
    setViewModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    } catch {}
  };

  // 3. Selected Group filter (Students vs Mothers)
  const [selectedGroup, setSelectedGroup] = useState<GroupType>('STUDENTS');

  // 4. Members
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMBERS;
  });

  // 5. Sessions
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SESSIONS;
  });

  // 6. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  // 7. Current active session
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return INITIAL_SESSIONS[0]?.id || '';
  });

  // 8. Toast feedback
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  // Log an Audit Event
  const logAuditEvent = (item: Omit<AuditLogItem, 'id' | 'timestamp' | 'formattedDate'>) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const formatted = formatExactTimestampAmharic(timestamp);
    const newLog: AuditLogItem = {
      ...item,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp,
      formattedDate: formatted.full
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch {}
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  // Auth methods
  const login = (username: string, password?: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    if (cleanUser === 'admin' && (cleanPass === 'admin123' || cleanPass === '123456' || cleanPass === '')) {
      setCurrentUser(INITIAL_USERS[0]);
      showToast(`እንኳን ደህና መጡ! ${INITIAL_USERS[0].name} (አስተዳዳሪ)`, 'success');
      return true;
    }
    if (cleanUser === 'mezgabi' && (cleanPass === '123456' || cleanPass === 'admin123' || cleanPass === '')) {
      setCurrentUser(INITIAL_USERS[1]);
      showToast(`እንኳን ደህና መጡ! ${INITIAL_USERS[1].name} (መዝጋቢ)`, 'success');
      return true;
    }
    if (cleanUser === 'enat' && (cleanPass === '123456' || cleanPass === 'admin123' || cleanPass === '')) {
      setCurrentUser(INITIAL_USERS[2]);
      setSelectedGroup('MOTHERS');
      showToast(`እንኳን ደህና መጡ! ${INITIAL_USERS[2].name} (የእናቶች አስተባባሪ)`, 'success');
      return true;
    }

    if (cleanUser.length >= 3) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: username,
        username: cleanUser,
        role: cleanUser.includes('admin') ? 'ADMIN' : 'RECORDER',
        title: cleanUser.includes('admin') ? 'አስተዳዳሪ (Admin)' : 'አቴንዳንስ መዝጋቢ (Recorder)',
        phone: '0911-000000',
        deviceInfo: detectClientDevice()
      };
      setCurrentUser(newUser);
      showToast(`እንኳን ደህና መጡ! ${username}`, 'success');
      return true;
    }

    showToast('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('በሰላም ወጥተዋል!', 'info');
  };

  // Member CRUD with Full Audit Trail
  const addMember = (memberData: Omit<Member, 'id'>): Member => {
    const now = new Date();
    const isoTime = now.toISOString();
    const device = detectClientDevice(currentUser?.deviceInfo);
    const registrarName = currentUser?.name || 'አስተዳዳሪ';
    const registrarPhone = currentUser?.phone || '0911-234567';

    const newMember: Member = {
      ...memberData,
      id: `${memberData.group === 'STUDENTS' ? 'stu' : 'mth'}-${Date.now().toString().slice(-4)}`,
      registeredByUserId: currentUser?.id || 'u-admin',
      registeredByUserName: registrarName,
      registeredByUserPhone: registrarPhone,
      registeredAtExactTime: isoTime,
      registeredDevice: device
    };

    setMembers((prev) => [newMember, ...prev]);

    // Log this registration event
    logAuditEvent({
      action: 'MEMBER_REGISTERED',
      actionTitle: newMember.group === 'STUDENTS' ? 'አዲስ ተማሪ ምዝገባ' : 'የእናት አባል ምዝገባ',
      targetName: `${newMember.fullName} (${newMember.christianName})`,
      userName: registrarName,
      userPhone: registrarPhone,
      userRole: currentUser?.title || 'አስተዳዳሪ',
      device: device,
      details: `ክፍል፡ ${newMember.classLevel} · መለያ ቁጥር፡ ${newMember.studentIdCode || newMember.id}`
    });

    showToast(`አዲሱ አባል ${newMember.fullName} በተሳካ ሁኔታ ተመዝግቧል`, 'success');
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('የአባሉ መረጃ ታድሷል', 'success');
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast(`${member?.fullName || 'አባል'} ተሰርዟል`, 'info');
  };

  // Attendance Session Operations
  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0] || null;

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const sess = sessions.find((s) => s.id === sessionId);
    if (sess) {
      setSelectedGroup(sess.group);
    }
  };

  const createSession = (group: GroupType, sessionType: string, dateStr?: string): AttendanceSession => {
    const date = dateStr || getTodayISODate();
    const ethDate = formatToEthiopianDate(date);
    
    // Auto populate existing members of this group with null or default
    const initialRecords: Record<string, AttendanceRecord> = {};

    const newSession: AttendanceSession = {
      id: `sess-${Date.now()}`,
      date,
      ethiopianDate: ethDate,
      group,
      sessionType,
      records: initialRecords,
      recordedBy: currentUser?.id || 'u-admin',
      recordedByName: currentUser?.name || 'መዝጋቢ',
      recordedAt: new Date().toISOString(),
      isLocked: false,
      notes: ''
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSelectedGroup(group);
    showToast('አዲስ የአቴንዳንስ ክፍለ-ጊዜ ተከፍቷል', 'success');
    return newSession;
  };

  const updateMemberAttendance = (
    sessionId: string,
    memberId: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    const targetMember = members.find(m => m.id === memberId);
    const now = new Date();
    const isoTime = now.toISOString();
    const exactFormatted = formatExactTimestampAmharic(isoTime);
    const timeMarked = exactFormatted.time;
    const registrarName = currentUser?.name || 'መዝጋቢ';
    const registrarPhone = currentUser?.phone || '0922-345678';
    const device = detectClientDevice(currentUser?.deviceInfo);

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== sessionId) return sess;
        if (sess.isLocked) {
          showToast('ይህ መዝገብ ተዘግቷል (የተቆለፈ ነው)', 'error');
          return sess;
        }

        const existingRecord = sess.records[memberId];
        return {
          ...sess,
          records: {
            ...sess.records,
            [memberId]: {
              memberId,
              status,
              note: note !== undefined ? note : existingRecord?.note,
              timeMarked: existingRecord?.timeMarked || timeMarked,
              markedByUserId: currentUser?.id,
              markedByUserName: registrarName,
              markedByUserPhone: registrarPhone,
              markedAtExactTime: isoTime,
              deviceInfo: device
            }
          }
        };
      })
    );

    // Also append audit entry
    const statusLabel = status === 'PRESENT' ? 'ተገኝቷል' : status === 'LATE' ? 'አርፍዷል' : status === 'EXCUSED' ? 'በፈቃድ' : 'አልተገኘም';
    logAuditEvent({
      action: 'ATTENDANCE_MARKED',
      actionTitle: `የአቴንዳንስ መገኘት (${statusLabel})`,
      targetName: targetMember ? `${targetMember.fullName} (${targetMember.christianName})` : memberId,
      userName: registrarName,
      userPhone: registrarPhone,
      userRole: currentUser?.title || 'መዝጋቢ',
      device: device,
      details: note ? `ሁኔታ፡ ${statusLabel} · ማስታወሻ፡ ${note}` : `ሁኔታ፡ ${statusLabel}`
    });
  };

  const markAllMembers = (sessionId: string, status: AttendanceStatus) => {
    const now = new Date();
    const isoTime = now.toISOString();
    const exactFormatted = formatExactTimestampAmharic(isoTime);
    const timeMarked = exactFormatted.time;
    const registrarName = currentUser?.name || 'መዝጋቢ';
    const registrarPhone = currentUser?.phone || '0922-345678';
    const device = detectClientDevice(currentUser?.deviceInfo);

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== sessionId) return sess;
        if (sess.isLocked) {
          showToast('መዝገቡ የተቆለፈ ስለሆነ ማሻሻል አይቻልም', 'error');
          return sess;
        }

        const groupMembers = members.filter((m) => m.group === sess.group && m.status === 'ACTIVE');
        
        const newRecords = { ...sess.records };
        groupMembers.forEach((m) => {
          newRecords[m.id] = {
            memberId: m.id,
            status,
            timeMarked,
            markedByUserId: currentUser?.id,
            markedByUserName: registrarName,
            markedByUserPhone: registrarPhone,
            markedAtExactTime: isoTime,
            deviceInfo: device
          };
        });

        return {
          ...sess,
          records: newRecords
        };
      })
    );

    const statusText = status === 'PRESENT' ? 'ተገኝቷል' : status === 'ABSENT' ? 'አልተገኘም' : status;
    
    logAuditEvent({
      action: 'BATCH_MARKED',
      actionTitle: `የጅምላ አቴንዳንስ ምዝገባ (${statusText})`,
      targetName: `የክፍለ-ጊዜው ሁሉም አባላት (${statusText})`,
      userName: registrarName,
      userPhone: registrarPhone,
      userRole: currentUser?.title || 'መዝጋቢ',
      device: device,
      details: `ለሁሉም ንቁ አባላት "${statusText}" ተብሎ በጅምላ ተመዝግቧል`
    });

    showToast(`ለሁሉም አባላት "${statusText}" ተብሎ ተመዝግቧል`, 'success');
  };

  const toggleLockSession = (sessionId: string) => {
    const now = new Date();
    const registrarName = currentUser?.name || 'አስተዳዳሪ';
    const registrarPhone = currentUser?.phone || '0911-234567';
    const device = detectClientDevice(currentUser?.deviceInfo);

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const newLockState = !s.isLocked;

        logAuditEvent({
          action: 'SESSION_LOCKED',
          actionTitle: newLockState ? 'መዝገብ ተቆልፏል' : 'መዝገብ ተከፍቷል',
          targetName: `${s.sessionType} (${s.ethiopianDate})`,
          userName: registrarName,
          userPhone: registrarPhone,
          userRole: currentUser?.title || 'አስተዳዳሪ',
          device: device,
          details: newLockState ? 'መዝገቡ ተቆልፎ ተጠናቋል' : 'መዝገቡ እንደገና ለለውጥ ክፍት ተደርጓል'
        });

        showToast(newLockState ? 'መዝገቡ ተቆልፏል' : 'መዝገቡ ክፍት ሆኗል', 'info');
        return { ...s, isLocked: newLockState };
      })
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(remaining[0]?.id || '');
      }
      return remaining;
    });
    showToast('የአቴንዳንስ መዝገቡ ተሰርዟል', 'info');
  };

  const getSummary = (session: AttendanceSession | null): AttendanceSummary => {
    if (!session) {
      return { total: 0, present: 0, late: 0, excused: 0, absent: 0, presentRate: 0 };
    }

    const groupMembers = members.filter((m) => m.group === session.group && m.status === 'ACTIVE');
    const total = groupMembers.length;
    let present = 0;
    let late = 0;
    let excused = 0;
    let absent = 0;

    groupMembers.forEach((m) => {
      const record = session.records[m.id];
      if (!record) {
        // Not marked yet defaults to unrecorded or absent
        absent++;
      } else if (record.status === 'PRESENT') {
        present++;
      } else if (record.status === 'LATE') {
        late++;
      } else if (record.status === 'EXCUSED') {
        excused++;
      } else if (record.status === 'ABSENT') {
        absent++;
      }
    });

    const attended = present + late;
    const presentRate = total > 0 ? Math.round((attended / total) * 100) : 0;

    return { total, present, late, excused, absent, presentRate };
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    setMembers(INITIAL_MEMBERS);
    setSessions(INITIAL_SESSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentSessionId(INITIAL_SESSIONS[0].id);
    showToast('የናሙና መረጃዎች ወደ መጀመሪያው ተመልሰዋል', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        viewMode,
        setViewMode,
        members,
        addMember,
        updateMember,
        deleteMember,
        sessions,
        currentSession,
        selectSession,
        createSession,
        updateMemberAttendance,
        markAllMembers,
        toggleLockSession,
        deleteSession,
        selectedGroup,
        setSelectedGroup,
        getSummary,
        auditLogs,
        logAuditEvent,
        resetToSampleData,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
