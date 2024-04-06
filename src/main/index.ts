import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.ico?asset";

import {
  clearArchive,
  createList,
  createTask,
  deleteList,
  deleteTask,
  editTask,
  getArchive,
  getIndex,
  getLists,
  getTasks,
  getTheme,
  moveTask,
  renameList,
  setTheme,
} from "./data";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 400,
    minHeight: 300,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("setup", (event) => {
  event.sender.send("res:lists", getLists());
  event.sender.send("res:index", getIndex());
  event.sender.send("res:theme", getTheme());
});

ipcMain.on("theme:set", (_event, theme: string) => {
  setTheme(theme);
});

ipcMain.on("task:create", (event, index: number, arg) => {
  const uuid: string | undefined = createTask(index, arg.title, arg.details, arg.date);
  if (typeof uuid === "string") {
    event.sender.send("task:status", uuid);
    event.sender.send("res:tasks", getTasks(index));
  } else {
    event.sender.send("task:status", null);
  }
});

ipcMain.on("task:edit", (event, index: number, arg) => {
  editTask(index, arg.uuid, arg.title, arg.details, arg.date);
  event.sender.send("res:tasks", getTasks(index));
});

ipcMain.on("task:archive", (event, index: number, uuid: string) => {
  moveTask(index, uuid, "archive");
  event.sender.send("res:tasks", getTasks(index));
  event.sender.send("res:archive", getArchive(index));
});

ipcMain.on("task:delete", (event, index: number, uuid: string) => {
  deleteTask(index, uuid, "tasks");
  event.sender.send("res:tasks", getTasks(index));
});

ipcMain.on("archived:unarchive", (event, index: number, uuid: string) => {
  moveTask(index, uuid, "tasks");
  event.sender.send("res:tasks", getTasks(index));
  event.sender.send("res:archive", getArchive(index));
});

ipcMain.on("archived:delete", (event, index: number, uuid: string) => {
  deleteTask(index, uuid, "archive");
  event.sender.send("res:archive", getTasks(index));
});

ipcMain.on("req:lists", (event) => {
  event.sender.send("res:lists", getLists());
});

ipcMain.on("req:tasks", (event, index: number = 0) => {
  event.sender.send("res:tasks", getTasks(index));
});

ipcMain.on("req:archive", (event, index: number = 0) => {
  event.sender.send("res:archive", getArchive(index));
});

ipcMain.on("list:create", (event) => {
  const index = createList();
  event.sender.send("res:lists", getLists());
  event.sender.send("res:index", index);
});

ipcMain.on("list:delete", (event, index: number) => {
  deleteList(index);
  event.sender.send("res:index", index - 1);
});

ipcMain.on("list:rename", (event, index: number, name: string) => {
  renameList(index, name);
  event.sender.send("res:lists", getLists());
});

ipcMain.on("clear:archive", (event, index: number) => {
  clearArchive(index);
  event.sender.send("res:archive", getArchive(index));
});
