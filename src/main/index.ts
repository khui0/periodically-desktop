import { app, shell, BrowserWindow, ipcMain, Tray, Menu, Notification } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.ico?asset";

import * as notifications from "./notifications";

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
  moveTask,
  renameList,
  getSetting,
  setSetting,
} from "./data";

let tray: Tray;

let window: BrowserWindow;

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

  window = mainWindow;

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

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([{ label: "Quit", type: "normal", role: "quit" }]);
  tray.setToolTip("Periodically Desktop");
  tray.setContextMenu(contextMenu);
  tray.addListener("double-click", () => mainWindow.show());

  mainWindow.on("close", (e) => {
    // Hide window to tray
    if (mainWindow.isVisible() && getSetting("enable-tray") === "true") {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

app.on("second-instance", () => {
  if (window) {
    if (window.isMinimized()) window.restore();
    window.show();
    window.focus();
  }
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.periodicallydesktop");

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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && getSetting("enable-tray") === "false") {
    app.quit();
  }
});

export function notify(title: string, body: string): void {
  const notification = new Notification({
    title,
    body,
  });
  notification.show();
  notification.on("click", () => {
    window.show();
  });
}

ipcMain.on("setup", (event) => {
  event.sender.send("res:lists", getLists());
  event.sender.send("res:index", getIndex());
  notifications.update();
});

ipcMain.on("settings:set", (_event, id: string, value: string) => {
  setSetting(id, value);
  notifications.update();
});

ipcMain.on("notify", (_event, title: string, body: string) => {
  notify(title, body);
});

ipcMain.on("settings:get", (event, id: string, defaultValue: string) => {
  const value = getSetting(id, defaultValue);
  event.sender.send(`settings:res-${id}`, value);
});

ipcMain.on("task:create", (event, index: number, arg) => {
  const uuid: string | undefined = createTask(index, arg.title, arg.details, arg.date);
  if (typeof uuid === "string") {
    event.sender.send("task:status", uuid);
    event.sender.send("res:tasks", getTasks(index));
  } else {
    event.sender.send("task:status", null);
  }
  notifications.update();
});

ipcMain.on("task:edit", (event, index: number, arg) => {
  editTask(index, arg.uuid, arg.title, arg.details, arg.date);
  event.sender.send("res:tasks", getTasks(index));
  notifications.update();
});

ipcMain.on("task:archive", (event, index: number, uuid: string) => {
  moveTask(index, uuid, "archive");
  event.sender.send("res:tasks", getTasks(index));
  event.sender.send("res:archive", getArchive(index));
  notifications.update();
});

ipcMain.on("task:delete", (event, index: number, uuid: string) => {
  deleteTask(index, uuid, "tasks");
  event.sender.send("res:tasks", getTasks(index));
  notifications.update();
});

ipcMain.on("archived:unarchive", (event, index: number, uuid: string) => {
  moveTask(index, uuid, "tasks");
  event.sender.send("res:tasks", getTasks(index));
  event.sender.send("res:archive", getArchive(index));
  notifications.update();
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
