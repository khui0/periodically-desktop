interface Time {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

// Return time until date in units of time
export function timeUntil(date: string | number | Date): Time {
  const target: number = Date.parse(date as string) || (date as number);
  const milliseconds: number = target - Date.now();
  const seconds: number = Math.floor(Math.abs(milliseconds / 1000));
  const minutes: number = Math.floor(Math.abs(seconds / 60));
  const hours: number = Math.floor(Math.abs(minutes / 60));
  const days: number = Math.floor(Math.abs(hours / 24));
  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    passed: milliseconds < 0,
  };
}

// Format the date provided
export function timeToString(timestamp): string {
  const date = new Date(timestamp);
  if (timestamp) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    let period;
    if (hours > 12) {
      hours %= 12;
      period = "PM";
    } else {
      period = "AM";
    }
    if (hours == 0) {
      hours = 12;
    }
    const deltaDay = getDeltaDay(timestamp);
    if (deltaDay === 0) {
      return `Today at ${hours}:${minutes} ${period}`;
    } else if (deltaDay === 1) {
      return `Tomorrow at ${hours}:${minutes} ${period}`;
    } else if (deltaDay === -1) {
      return `Yesterday at ${hours}:${minutes} ${period}`;
    } else {
      return `${month}/${day}/${year} ${hours}:${minutes} ${period}`;
    }
  } else {
    return "Invalid timestamp";
  }
}

export function getTime(): string {
  const time: string = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return time;
}

// Returns the difference in days between a date and now
export function getDeltaDay(date: string): number {
  const DAY: number = 86_400_000;
  const TIMEZONE_OFFSET: number = new Date().getTimezoneOffset() * 60_000;
  const target: number = Math.floor((new Date(date).getTime() - TIMEZONE_OFFSET) / DAY);
  const now: number = Math.floor((Date.now() - TIMEZONE_OFFSET) / DAY);
  return target - now;
}

// Convert date into ISO format for use in datetime-local input
export function timeToISO(timestamp): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Return 11:59 PM in ISO format
export function endOfToday(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}T23:59`;
}
