import { notify } from ".";
import { getLists, getSetting, getTasks } from "./data";

const timeouts: NodeJS.Timeout[] = [];

export function update(): void {
  const enabled = getSetting("notifications") === "true";
  // Clear existing timeouts
  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  if (enabled) {
    // Calculate timetable
    const timetable = getTimetable();
    // Add notification timeouts
    Object.keys(timetable).forEach((timestamp) => {
      const tasks = timetable[timestamp];
      const delay = parseInt(timestamp) - Date.now() - 300_000;
      // Set timeout for notifcation to appear
      if (delay >= 0) {
        const title =
          tasks.length === 1
            ? `${tasks[0]} is due in around 5 minutes`
            : `${tasks.length} tasks are due in around 5 minutes`;
        const timeout = setTimeout(() => {
          notify(title, "Click to open Periodically");
        }, delay);
        timeouts.push(timeout);
      }
    });
  }
}

interface Timetable {
  [key: string]: string[];
}

function getTimetable(): Timetable {
  const timetable: Timetable = {};
  const listCount: number = getLists().length;
  for (let i = 0; i < listCount; i++) {
    const tasks = getTasks(i);
    for (let j = 0; j < tasks.length; j++) {
      const task = tasks[j];
      const rounding = 300_000;
      const timestamp = Math.floor(new Date(task.timestamp).getTime() / rounding) * rounding;
      if (timestamp > Date.now()) {
        timetable[timestamp] ??= [];
        timetable[timestamp].push(task.title);
      }
    }
  }
  return timetable;
}
