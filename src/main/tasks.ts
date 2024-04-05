import { v4 as uuidv4 } from "uuid";
import Store from "electron-store";

export type { Task };

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
  details: string | undefined;
  timestamp: string;
}

export function createTask(title: string, details: string, date: string): string | undefined {
  if (!title?.trim() || !date?.trim()) return;
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

export function editTask(uuid: string, title: string, details: string, date: string): void {
  const list: Task[] = store.get("tasks") as Task[];
  const index: number = list.findIndex((task) => task.uuid === uuid);
  list[index] = {
    uuid: uuid,
    title: title,
    details: details,
    timestamp: date,
  };
  store.set("tasks", list);
}

export function archiveTask(uuid: string): void {
  const list: Task[] = store.get("tasks") as Task[];
  // const task: Task | undefined = list.find((task) => task.uuid === uuid);

  const filtered = list.filter((tasks) => tasks.uuid !== uuid);

  store.set("tasks", filtered);
}

export function deleteTask(uuid: string): void {
  const list: Task[] = store.get("tasks") as Task[];
  const filtered = list.filter((tasks) => tasks.uuid !== uuid);
  store.set("tasks", filtered);
}

export function getTasks(): Task[] {
  const list = store.get("tasks") as Task[];
  // Sort tasks by due date
  list.sort((a, b) => (a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0));
  return list;
}
