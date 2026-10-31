import { formatToEthiopianDate } from './ethiopianDate';

export function detectClientDevice(defaultFallback = 'ስማርት ስልክ (Mobile App)'): string {
  if (typeof window === 'undefined' || !window.navigator) {
    return defaultFallback;
  }

  const ua = window.navigator.userAgent;

  if (/iPhone/i.test(ua)) {
    return 'iPhone (Apple iOS)';
  } else if (/iPad/i.test(ua)) {
    return 'iPad Tablet (iOS)';
  } else if (/Android/i.test(ua)) {
    if (/Samsung/i.test(ua)) {
      return 'Samsung Galaxy (Android)';
    }
    return 'Android ስማርት ስልክ';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    return 'MacBook / Mac OS ኮምፒውተር';
  } else if (/Windows/i.test(ua)) {
    return 'Windows PC / ላፕቶፕ';
  } else if (/Linux/i.test(ua)) {
    return 'Linux መሣሪያ';
  }

  return defaultFallback;
}

export function formatExactTimestampAmharic(isoString: string): {
  date: string;
  time: string;
  full: string;
} {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { date: isoString, time: '', full: isoString };
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const ethDate = formatToEthiopianDate(`${year}-${month}-${day}`);

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'ከሰዓት' : 'ጠዋት';
    const displayHour = hours % 12 || 12;

    const timeStr = `${displayHour}:${minutes}:${seconds} ${ampm}`;
    return {
      date: ethDate,
      time: timeStr,
      full: `${ethDate} በ${timeStr}`
    };
  } catch {
    return { date: isoString, time: '', full: isoString };
  }
}
