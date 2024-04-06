import { v4 as uuidv4 } from "uuid";
import Store from "electron-store";

export type { Task };

const store = new Store({
  defaults: {
    index: 0,
    lists: [
      {
        name: "Default",
        tasks: [],
        archive: [],
      },
    ],
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
  archive: Task[];
}

type ListType = "tasks" | "archive";

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
  // Store lists
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
  lists[index]["tasks"][targetIndex] = {
    uuid: uuid,
    title: title,
    details: details,
    timestamp: date,
  };
  // Store lists
  store.set("lists", lists);
}

export function moveTask(index: number, uuid: string, target: ListType = "archive"): void {
  const lists: List[] = store.get("lists") as List[];
  const source: ListType = target === "tasks" ? "archive" : "tasks";
  const from: Task[] = lists[index][source];
  const to: Task[] = lists[index][target];
  // Find task with matching uuid
  const task: Task | undefined = from.find((task) => task.uuid === uuid);
  if (!task) return;
  to.push(task);
  // Set archive at index
  lists[index][target] = to;
  // Store lists
  store.set("lists", lists);
  // Delete task from source
  deleteTask(index, uuid, source);
}

export function deleteTask(index: number, uuid: string, list: ListType = "tasks"): void {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index][list];
  // Remove task with matching uuid
  lists[index][list] = tasks.filter((task) => task.uuid !== uuid);
  // Store lists
  store.set("lists", lists);
}

export function getTasks(index: number): Task[] {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index]["tasks"];
  // Sort tasks by due date
  tasks.sort((a, b) => (a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0));
  setIndex(index);
  return tasks;
}

export function getArchive(index: number): Task[] {
  const lists: List[] = store.get("lists") as List[];
  const tasks: Task[] = lists[index]["archive"];
  tasks.reverse();
  return tasks;
}

export function getLists(): string[] {
  const lists: List[] = store.get("lists") as List[];
  return lists.map((list) => list.name);
}

export function createList(): number {
  const lists: List[] = store.get("lists") as List[];

  lists.push({
    name: "New list",
    tasks: [],
    archive: [],
  });
  // Store lists
  store.set("lists", lists);
  return lists.length - 1;
}

export function deleteList(index: number): void {
  const lists: List[] = store.get("lists") as List[];
  lists.splice(index, 1);
  // Store lists
  store.set("lists", lists);
}

export function renameList(index: number, name: string): void {
  const lists: List[] = store.get("lists") as List[];
  if (lists.length < index) return;
  lists[index]["name"] = name;
  // Store lists
  store.set("lists", lists);
}

export function clearArchive(index: number): void {
  const lists: List[] = store.get("lists") as List[];
  lists[index]["archive"] = [];
  // Store lists
  store.set("lists", lists);
}

export function setIndex(index: number): void {
  store.set("index", index);
}

export function getIndex(): number {
  return store.get("index");
}
