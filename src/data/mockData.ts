import { User, Member, AttendanceSession } from '../types';
import { getTodayISODate, formatToEthiopianDate } from '../utils/ethiopianDate';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'ቀሲስ ዳንኤል ከበደ',
    username: 'admin',
    role: 'ADMIN',
    title: 'የሰንበት ት/ቤት ዋና አስተዳዳሪ (Admin)',
    phone: '0911-234567',
    deviceInfo: 'Admin Management Console (PC/Tablet)'
  },
  {
    id: 'u-recorder-1',
    name: 'ዲ/ን ቴዎድሮስ ሰለሞን',
    username: 'mezgabi',
    role: 'RECORDER',
    title: 'የተማሪዎች አቴንዳንስ መዝጋቢ (Recorder)',
    phone: '0922-345678',
    deviceInfo: 'Samsung Galaxy A54 (Android Mobile)'
  },
  {
    id: 'u-recorder-2',
    name: 'ወ/ሮ ዘውድነሽ ታደሰ',
    username: 'enat',
    role: 'RECORDER',
    title: 'የእናቶች ማኅበር አስተባባሪ (Mothers Lead)',
    phone: '0933-456789',
    deviceInfo: 'iPhone 13 (iOS Safari Mobile)'
  }
];

export const STUDENT_CLASSES = [
  'ሕፃናት ክፍል (ከ1-4ኛ ክፍል)',
  'አዕሩግና ታዳጊዎች (ከ5-8ኛ ክፍል)',
  'ማዕከላዊያን (ከ9-12ኛ ክፍል)',
  'ወጣቶችና አበው (መደበኛ ክፍል)'
];

export const MOTHER_CLASSES = [
  'ቅድስት አና ክፍል',
  'ቅድስት ኤልሳቤጥ ክፍል',
  'ቅድስት ማርያም ክፍል'
];

export const SESSION_TYPES = [
  'የጧት መርሐ ግብር (ቅዳሴና ትምህርት)',
  'የከሰዓት መደበኛ ትምህርት',
  'የዝማሬ ልምምድ',
  'ወርሃዊ የእናቶች ጉባኤ',
  'ልዩ በዓልና አገልግሎት'
];

export const CHURCH_DEPARTMENTS = [
  'አጠቃላይ ትምህርት ክፍል',
  'የዝማሬ ክፍል (መዘምራን)',
  'ስነ-ጽሑፍና ሚዲያ ክፍል',
  'ስነ-ስርዓትና መስተንግዶ ክፍል',
  'ኪነ-ጥበብና ቲያትር ክፍል',
  'ግብረ-ሰናይና አረጋውያን መጠየቅ'
];

export const COMMON_CHRISTIAN_NAMES = [
  'ገብረ መድኅን',
  'ወለተ ማርያም',
  'ተክለ ሃይማኖት',
  'ወለተ ኪዳን',
  'ኃይለ ሚካኤል',
  'ወለተ ሰንበት',
  'ገብረ ጊዮርጊስ',
  'ወለተ ጽዮን',
  'ወልደ ኢየሱስ',
  'ገብረ ክርስቶስ',
  'ወለተ ሐና',
  'ወለተ ሩፋኤል',
  'ገብረ መስቀል',
  'ወለተ ገብርኤል',
  'ኃይለ ማርያም',
  'ወለተ ሥላሴ',
  'ገብረ ዮሐንስ'
];

export const RESIDENTIAL_AREAS = [
  'ደብሩ አካባቢ',
  'መገናኛ',
  'ገርጂ',
  'ቦሌ',
  'ካዛንቺስ',
  'ፒያሳ',
  'አራት ኪሎ',
  'ቄራ',
  'ሳሪስ',
  'ኮተቤ',
  'ጎሮ',
  'የካ'
];

export const INITIAL_MEMBERS: Member[] = [
  // --- ተማሪዎች (STUDENTS) ---
  {
    id: 'stu-01',
    fullName: 'ዮናታን ተስፋዬ',
    christianName: 'ገብረ መድኅን',
    group: 'STUDENTS',
    classLevel: 'ማዕከላዊያን (ከ9-12ኛ ክፍል)',
    phone: '0911234567',
    joinedDate: '2023-09-15',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-02',
    fullName: 'ሰላማዊት አለማየሁ',
    christianName: 'ወለተ ማርያም',
    group: 'STUDENTS',
    classLevel: 'ማዕከላዊያን (ከ9-12ኛ ክፍል)',
    phone: '0912345678',
    joinedDate: '2023-09-15',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'stu-03',
    fullName: 'አማኑኤል ግርማ',
    christianName: 'ተክለ ሃይማኖት',
    group: 'STUDENTS',
    classLevel: 'ወጣቶችና አበው (መደበኛ ክፍል)',
    phone: '0922456789',
    joinedDate: '2022-10-01',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-04',
    fullName: 'ሄለን ዳዊት',
    christianName: 'ወለተ ኪዳን',
    group: 'STUDENTS',
    classLevel: 'አዕሩግና ታዳጊዎች (ከ5-8ኛ ክፍል)',
    phone: '0933567890',
    parentName: 'አቶ ዳዊት በቀለ',
    joinedDate: '2024-01-10',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'stu-05',
    fullName: 'ቢኒያም ከበደ',
    christianName: 'ኃይለ ሚካኤል',
    group: 'STUDENTS',
    classLevel: 'አዕሩግና ታዳጊዎች (ከ5-8ኛ ክፍል)',
    phone: '0944678901',
    parentName: 'ወ/ሮ ዘውድነሽ',
    joinedDate: '2024-02-12',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-06',
    fullName: 'ሩት ታደሰ',
    christianName: 'ወለተ ሰንበት',
    group: 'STUDENTS',
    classLevel: 'ሕፃናት ክፍል (ከ1-4ኛ ክፍል)',
    phone: '0955789012',
    parentName: 'አቶ ታደሰ ወርቁ',
    joinedDate: '2024-09-20',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'stu-07',
    fullName: 'ኤፍሬም መንግሥቱ',
    christianName: 'ገብረ ጊዮርጊስ',
    group: 'STUDENTS',
    classLevel: 'ሕፃናት ክፍል (ከ1-4ኛ ክፍል)',
    phone: '0966890123',
    parentName: 'አቶ መንግሥቱ ገብሬ',
    joinedDate: '2024-09-20',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-08',
    fullName: 'መክሊት ፍቃዱ',
    christianName: 'ወለተ ሩፋኤል',
    group: 'STUDENTS',
    classLevel: 'ማዕከላዊያን (ከ9-12ኛ ክፍል)',
    phone: '0977901234',
    joinedDate: '2023-11-05',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'stu-09',
    fullName: 'በረከት አስራት',
    christianName: 'ወልደ ኢየሱስ',
    group: 'STUDENTS',
    classLevel: 'ወጣቶችና አበው (መደበኛ ክፍል)',
    phone: '0988012345',
    joinedDate: '2022-09-10',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-10',
    fullName: 'ሳባ ዘውዴ',
    christianName: 'ወለተ ጽዮን',
    group: 'STUDENTS',
    classLevel: 'ሕፃናት ክፍል (ከ1-4ኛ ክፍል)',
    phone: '0911029384',
    parentName: 'ወ/ሮ አልማዝ',
    joinedDate: '2024-10-01',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'stu-11',
    fullName: 'ናትናኤል ታምራት',
    christianName: 'ገብረ ክርስቶስ',
    group: 'STUDENTS',
    classLevel: 'አዕሩግና ታዳጊዎች (ከ5-8ኛ ክፍል)',
    phone: '0922134567',
    parentName: 'አቶ ታምራት ሞላ',
    joinedDate: '2023-10-14',
    status: 'ACTIVE',
    gender: 'M'
  },
  {
    id: 'stu-12',
    fullName: 'ቤተልሔም ወርቁ',
    christianName: 'ወለተ ገብርኤል',
    group: 'STUDENTS',
    classLevel: 'ማዕከላዊያን (ከ9-12ኛ ክፍል)',
    phone: '0933245678',
    joinedDate: '2023-10-14',
    status: 'ACTIVE',
    gender: 'F'
  },

  // --- እናቶች (MOTHERS) ---
  {
    id: 'mth-01',
    fullName: 'ወ/ሮ ዘውድነሽ ታደሰ',
    christianName: 'ወለተ ማርያም',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ማርያም ክፍል',
    phone: '0911443322',
    joinedDate: '2021-01-10',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-02',
    fullName: 'እማሆይ አስካለ ብርሃኑ',
    christianName: 'ወለተ ኪዳን',
    group: 'MOTHERS',
    classLevel: 'ቅድስት አና ክፍል',
    phone: '0922554433',
    joinedDate: '2020-03-12',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-03',
    fullName: 'ወ/ሮ አልማዝ ገብሬ',
    christianName: 'ወለተ ሐና',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ኤልሳቤጥ ክፍል',
    phone: '0933665544',
    joinedDate: '2022-04-18',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-04',
    fullName: 'ወ/ሮ ሙሉእመቤት ደስታ',
    christianName: 'ወለተ ጽዮን',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ማርያም ክፍል',
    phone: '0944776655',
    joinedDate: '2021-08-25',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-05',
    fullName: 'ወ/ሮ እየሩሳሌም ካሳሁን',
    christianName: 'ወለተ ጊዮርጊስ',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ኤልሳቤጥ ክፍል',
    phone: '0955887766',
    joinedDate: '2023-02-14',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-06',
    fullName: 'ወ/ሮ ማርታ ተፈሪ',
    christianName: 'ወለተ ሚካኤል',
    group: 'MOTHERS',
    classLevel: 'ቅድስት አና ክፍል',
    phone: '0966998877',
    joinedDate: '2022-11-20',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-07',
    fullName: 'ወ/ሮ ትዕግሥት በቀለ',
    christianName: 'ወለተ ሰንበት',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ማርያም ክፍል',
    phone: '0977009988',
    joinedDate: '2023-05-10',
    status: 'ACTIVE',
    gender: 'F'
  },
  {
    id: 'mth-08',
    fullName: 'ወ/ሮ አበባ መኮንን',
    christianName: 'ወለተ ተክለ ሃይማኖት',
    group: 'MOTHERS',
    classLevel: 'ቅድስት ኤልሳቤጥ ክፍል',
    phone: '0988110099',
    joinedDate: '2024-01-15',
    status: 'ACTIVE',
    gender: 'F'
  }
];

// Pre-fill initial session for today so app is ready to use immediately
const today = getTodayISODate();
const ethToday = formatToEthiopianDate(today);

export const INITIAL_SESSIONS: AttendanceSession[] = [
  {
    id: 'sess-today-students',
    date: today,
    ethiopianDate: ethToday,
    group: 'STUDENTS',
    sessionType: 'የጧት መርሐ ግብር (ቅዳሴና ትምህርት)',
    recordedBy: 'u-recorder-1',
    recordedByName: 'ዲ/ን ቴዎድሮስ ሰለሞን',
    recordedAt: `${today}T09:30:00.000Z`,
    isLocked: false,
    notes: 'የሰንበት ጧት መደበኛ መርሐ ግብር የተማሪዎች መገኘት',
    records: {
      'stu-01': { memberId: 'stu-01', status: 'PRESENT', timeMarked: '09:05' },
      'stu-02': { memberId: 'stu-02', status: 'PRESENT', timeMarked: '09:08' },
      'stu-03': { memberId: 'stu-03', status: 'PRESENT', timeMarked: '09:12' },
      'stu-04': { memberId: 'stu-04', status: 'LATE', note: 'የትራንስፖርት መዘግየት', timeMarked: '09:40' },
      'stu-05': { memberId: 'stu-05', status: 'PRESENT', timeMarked: '09:15' },
      'stu-06': { memberId: 'stu-06', status: 'PRESENT', timeMarked: '09:10' },
      'stu-07': { memberId: 'stu-07', status: 'ABSENT', note: 'ያልተገለጸ', timeMarked: '09:50' },
      'stu-08': { memberId: 'stu-08', status: 'PRESENT', timeMarked: '09:02' },
      'stu-09': { memberId: 'stu-09', status: 'EXCUSED', note: 'የዩኒቨርሲቲ ፈተና ነበረው', timeMarked: '08:50' },
      'stu-10': { memberId: 'stu-10', status: 'PRESENT', timeMarked: '09:14' },
      'stu-11': { memberId: 'stu-11', status: 'PRESENT', timeMarked: '09:18' },
      'stu-12': { memberId: 'stu-12', status: 'LATE', note: 'ከቤተሰብ ጋር', timeMarked: '09:35' },
    }
  },
  {
    id: 'sess-today-mothers',
    date: today,
    ethiopianDate: ethToday,
    group: 'MOTHERS',
    sessionType: 'ወርሃዊ የእናቶች ጉባኤ',
    recordedBy: 'u-recorder-2',
    recordedByName: 'ወ/ሮ ዘውድነሽ ታደሰ',
    recordedAt: `${today}T11:00:00.000Z`,
    isLocked: false,
    notes: 'የእናቶች ማኅበር የዛሬው ወርሃዊ ጉባኤ መገኘት',
    records: {
      'mth-01': { memberId: 'mth-01', status: 'PRESENT', timeMarked: '10:30' },
      'mth-02': { memberId: 'mth-02', status: 'PRESENT', timeMarked: '10:35' },
      'mth-03': { memberId: 'mth-03', status: 'PRESENT', timeMarked: '10:40' },
      'mth-04': { memberId: 'mth-04', status: 'PRESENT', timeMarked: '10:45' },
      'mth-05': { memberId: 'mth-05', status: 'EXCUSED', note: 'የታመመ ሰው ለመጠየቅ', timeMarked: '10:20' },
      'mth-06': { memberId: 'mth-06', status: 'PRESENT', timeMarked: '10:50' },
      'mth-07': { memberId: 'mth-07', status: 'LATE', note: 'ከሰርግ መልስ', timeMarked: '11:15' },
      'mth-08': { memberId: 'mth-08', status: 'ABSENT', note: 'ስልክ አልተነሳም', timeMarked: '11:30' },
    }
  }
];
