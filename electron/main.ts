import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { open } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//
// Create the default file save location
//

const home = os.homedir();
const defaultPath = `${home}${path.sep}Documents${path.sep}SquidInk`;

if (!fs.existsSync(defaultPath)) {
	fs.mkdirSync(defaultPath);
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ["ENV_NAME"] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		title: "Squid Ink",
		icon: path.join(__dirname, "..", "public", "squid-ink-logo.png"),
		width: 1920,
		height: 1080,
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", (new Date).toLocaleString())
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	}
	else {
		// win.loadFile("dist/index.html")
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it"s common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);

// Handle saving a file
ipcMain.handle("saveFile", async (_event: Electron.IpcMainInvokeEvent, data: string) => {
	const result = await dialog.showSaveDialog({
		title: "Save file",
		buttonLabel: "Save",
		defaultPath: `${defaultPath}${path.sep}Untitled.json`,
		properties: ["createDirectory", "showOverwriteConfirmation"],
	});

	const { canceled, filePath } = result;

	if (canceled || !filePath) {
		return;
	}

	const file = await open(`${filePath}${path.extname(filePath) === ".json"? "" : ".json"}`, "w");
	await file.writeFile(data);
});
