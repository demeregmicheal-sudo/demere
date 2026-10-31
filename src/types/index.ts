export type UserRole = 'ADMIN' | 'RECORDER';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  title: string; // e.g. "ዋና አስተዳዳሪ", "የተማሪዎች መዝጋቢ", "የእናቶች አስተባባሪ"
  phone: string; // የመዝጋቢው ስልክ ቁጥር
  deviceInfo: string; // የመዘገበበት ስልክ/መሣሪያ
}

export type GroupType = 'STUDENTS' | 'MOTHERS';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT';

export interface Member {
  id: string;
  studentIdCode?: string; // መለያ ቁጥር e.g. "MD-STU-101"
  fullName: string;
  christianName: string; // የክርስትና ስም (ወለተ ማርያም, ገብረ መድኅን...)
  group: GroupType;
  classLevel: string; // ክፍል (e.g. "ሕፃናት ክፍል (ከ1-4ኛ ክፍል)", "ማዕከላዊያን (ከ9-12ኛ ክፍል)")
  phone: string;
  parentName?: string; // የወላጅ/አሳዳጊ ስም
  parentPhone?: string; // የወላጅ ስልክ ቁጥር
  age?: number; // ዕድሜ
  gender?: 'M' | 'F'; // ፆታ
  academicGrade?: string; // የመደበኛ ትምህርት ክፍል (7ኛ፣ 10ኛ፣ ኮሌጅ...)
  address?: string; // የመኖሪያ አድራሻ / ሰፈር
  department?: string; // የአገልግሎት ዘርፍ (ዝማሬ፣ ስነ-ጽሑፍ፣ ስነ-ስርዓት...)
  joinedDate: string; // የተመዘገበበት ቀን
  ethiopianJoinedDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;

  // --- Audit Trail & Device Registration Info ---
  registeredByUserId?: string;
  registeredByUserName?: string; // የመዘገበው ሰው ስም
  registeredByUserPhone?: string; // የመዘገበው ሰው ስልክ ቁጥር
  registeredAtExactTime?: string; // ትክክለኛ የተመዘገበበት ሰዓትና ደቂቃ (ISO)
  registeredDevice?: string; // የተመዘገበበት ስልክ / መሣሪያ (e.g. "Samsung Galaxy A54")
  networkOrLocation?: string; // አውታረ መረብ / ሰፈር (e.g. "ደብሩ WiFi")
}

export interface AttendanceRecord {
  memberId: string;
  status: AttendanceStatus;
  note?: string;
  timeMarked?: string;

  // --- Audit Details ---
  markedByUserId?: string;
  markedByUserName?: string;
  markedByUserPhone?: string;
  markedAtExactTime?: string;
  deviceInfo?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  ethiopianDate: string;
  group: GroupType;
  classLevelFilter?: string; // 'ALL' or specific
  sessionType: string; // "የጧት መርሐ ግብር", "የከሰዓት ትምህርት", "የዝማሬ ልምምድ", "ወርሃዊ ጉባኤ"
  records: Record<string, AttendanceRecord>; // memberId -> Record
  recordedBy: string;
  recordedByName: string;
  recordedByUserPhone?: string;
  recordedByDevice?: string;
  recordedAt: string;
  isLocked: boolean;
  notes?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  presentRate: number;
}

export interface AuditLogItem {
  id: string;
  action: 'MEMBER_REGISTERED' | 'ATTENDANCE_MARKED' | 'BATCH_MARKED' | 'SESSION_LOCKED';
  actionTitle: string;
  targetName: string;
  userName: string;
  userPhone: string;
  userRole: string;
  device: string;
  timestamp: string; // ISO
  formattedDate: string;
  details: string;
}
