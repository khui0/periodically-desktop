import { v4 as uuidv4 } from "uuid";
import Store from "electron-store";

const store = new Store({
  schema: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          uuid: { type: "string" },
          title: { type: "string" },
          details: { type: "string" },
          timestamp: { type: "string" },
        },
      },
      default: [],
    },
  },
});

interface Task {
  uuid: string;
  title: string;
  details?: string;
  timestamp: string;
}

export function createTask(title: string, details: string, date: string): string | null {
  if (!title?.trim() || !date?.trim()) return null;
  const uuid = uuidv4();

  const list: Task[] = store.get("tasks") as Task[];
  list.push({
    uuid: uuid,
    title: title,
    details: details,
    timestamp: date,
  });
  store.set("tasks", list);

  return uuid;
}

export function getTasks(): Task[] {
  return store.get("tasks") as Task[];
}
