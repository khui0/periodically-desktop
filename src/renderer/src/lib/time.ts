// Return time until date in units of time
export function timeUntil(date: string | number | Date): object {
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
    if (isToday(timestamp)) {
      return `Today at ${hours}:${minutes} ${period}`;
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

// Check if the date provided the same date as today
export function isToday(timestamp): boolean {
  const target = new Date(timestamp);
  const today = new Date();
  const comparisons = [
    target.getFullYear() == today.getFullYear(),
    target.getMonth() == today.getMonth(),
    target.getDate() == today.getDate(),
  ];
  return comparisons.every((value) => value);
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
