import { v4 as uuidv4 } from "uuid";
import Store from "electron-store";

export type { Task };

const store = new Store({
  defaults: {
    lists: [
      {
        name: "Default",
        tasks: [],
      },
    ],
  },
  schema: {
    lists: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
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
          },
        },
      },
    },
  },
});

interface Task {
  uuid: string;
  title: string;
  details: string | undefined;
  timestamp: string;
}

interface List {
  name: string;
  tasks: Task[];
}

export function createTask(
  index: number,
  title: string,
  details: string,
  date: string,
): string | undefined {
  if (!title?.trim() || !date?.trim()) return;
  const uuid = uuidv4();

  const lists: List[] = store.get("lists") as List[];
  lists[index]["tasks"].push({
    uuid: uuid,
    title: title,
    details: details,
    timestamp: date,
  });
  store.set("lists", lists);

  return uuid;
}

export function editTask(
  index: number,
  uuid: string,
  title: string,
  details: string,
  date: string,
): void {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index]["tasks"];
  const targetIndex: number = tasks.findIndex((task) => task.uuid === uuid);
  lists[0]["tasks"][targetIndex] = {
    uuid: uuid,
    title: title,
    details: details,
    timestamp: date,
  };
  store.set("lists", lists);
}

export function archiveTask(uuid: string): void {
  console.log(uuid);
}

export function deleteTask(index: number, uuid: string): void {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index]["tasks"];
  lists[0]["tasks"] = tasks.filter((task) => task.uuid !== uuid);
  store.set("lists", lists);
}

export function getTasks(index: number = 0): Task[] {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index]["tasks"];
  // Sort tasks by due date
  tasks.sort((a, b) => (a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0));
  return tasks;
}

export function getLists(): string[] {
  const lists: List[] = store.get("lists") as List[];
  return lists.map((list) => list.name);
}
