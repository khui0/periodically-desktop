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

export function deleteTask(uuid: string): boolean {
  const list: Task[] = store.get("tasks") as Task[];
  const exists: boolean = Boolean(list.find((task) => task.uuid === uuid));

  const filtered = list.filter((tasks) => tasks.uuid !== uuid);

  store.set("tasks", filtered);

  return exists;
}

export function getTasks(): Task[] {
  const list = store.get("tasks") as Task[];
  // Sort tasks by due date
  list.sort((a, b) => (a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0));
  return list;
}
