/**
 * Ethiopian Calendar utilities for Mikha Danagil Sunday School
 */

export const ETHIOPIAN_MONTHS = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜን'
];

export const ETHIOPIAN_WEEKDAYS = [
  'እሑድ (ሰንበት)',
  'ሰኞ',
  'ማክሰኞ',
  'ረቡዕ',
  'ሐሙስ',
  'ዓርብ',
  'ቅዳሜ'
];

export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Approximate conversion from Gregorian Date to Ethiopian Date
 * Sufficient for standard church attendance display and record keeping
 */
export function formatToEthiopianDate(gregorianDateStr: string): string {
  try {
    const parts = gregorianDateStr.split('-');
    if (parts.length !== 3) return gregorianDateStr;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // 1-12
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);
    const dayOfWeek = ETHIOPIAN_WEEKDAYS[date.getDay()];

    // Approximate Ethiopian conversion
    // Ethiopian new year is typically Sept 11 (or 12 in leap year)
    let ethYear = year - 8;
    let ethMonth = 1;
    let ethDay = 1;

    // Approximate calculation table for calendar display
    if (month === 9 && day >= 11) {
      ethMonth = 1; // መስከረም
      ethDay = day - 10;
      ethYear = year - 7;
    } else if (month === 10) {
      if (day <= 10) {
        ethMonth = 1;
        ethDay = day + 20;
      } else {
        ethMonth = 2; // ጥቅምት
        ethDay = day - 10;
      }
      ethYear = year - 7;
    } else if (month === 11) {
      if (day <= 9) {
        ethMonth = 2;
        ethDay = day + 21;
      } else {
        ethMonth = 3; // ኅዳር
        ethDay = day - 9;
      }
      ethYear = year - 7;
    } else if (month === 12) {
      if (day <= 9) {
        ethMonth = 3;
        ethDay = day + 21;
      } else {
        ethMonth = 4; // ታኅሣሥ
        ethDay = day - 9;
      }
      ethYear = year - 7;
    } else if (month === 1) {
      if (day <= 8) {
        ethMonth = 4;
        ethDay = day + 22;
      } else {
        ethMonth = 5; // ጥር
        ethDay = day - 8;
      }
      ethYear = year - 8;
    } else if (month === 2) {
      if (day <= 7) {
        ethMonth = 5;
        ethDay = day + 23;
      } else {
        ethMonth = 6; // የካቲት
        ethDay = day - 7;
      }
      ethYear = year - 8;
    } else if (month === 3) {
      if (day <= 9) {
        ethMonth = 6;
        ethDay = day + 21;
      } else {
        ethMonth = 7; // መጋቢት
        ethDay = day - 9;
      }
      ethYear = year - 8;
    } else if (month === 4) {
      if (day <= 8) {
        ethMonth = 7;
        ethDay = day + 22;
      } else {
        ethMonth = 8; // ሚያዝያ
        ethDay = day - 8;
      }
      ethYear = year - 8;
    } else if (month === 5) {
      if (day <= 8) {
        ethMonth = 8;
        ethDay = day + 22;
      } else {
        ethMonth = 9; // ግንቦት
        ethDay = day - 8;
      }
      ethYear = year - 8;
    } else if (month === 6) {
      if (day <= 7) {
        ethMonth = 9;
        ethDay = day + 23;
      } else {
        ethMonth = 10; // ሰኔ
        ethDay = day - 7;
      }
      ethYear = year - 8;
    } else if (month === 7) {
      if (day <= 7) {
        ethMonth = 10;
        ethDay = day + 23;
      } else {
        ethMonth = 11; // ሐምሌ
        ethDay = day - 7;
      }
      ethYear = year - 8;
    } else if (month === 8) {
      if (day <= 6) {
        ethMonth = 11;
        ethDay = day + 24;
      } else {
        ethMonth = 12; // ነሐሴ
        ethDay = day - 6;
      }
      ethYear = year - 8;
    } else if (month === 9 && day < 11) {
      if (day <= 5) {
        ethMonth = 12;
        ethDay = day + 25;
      } else {
        ethMonth = 13; // ጳጉሜን
        ethDay = day - 5;
      }
      ethYear = year - 8;
    }

    const monthName = ETHIOPIAN_MONTHS[ethMonth - 1] || 'ጥቅምት';
    return `${dayOfWeek}፣ ${monthName} ${ethDay} ቀን ${ethYear} ዓ.ም`;
  } catch {
    return gregorianDateStr;
  }
}
