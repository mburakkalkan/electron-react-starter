const { app, BrowserWindow } = require('electron');
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "mburakkalkan/electron-react-starter",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680, 
    show: false,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.once("ready-to-show", () => { mainWindow.show(); });
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// kill development server process before quit
if (isDev) {
  const find = require("find-process");
  let devServerPid = null;
  find("port", 3000).then(list => {
    if(list[0]) {
      devServerPid = list[0].pid;
    }
  });
  app.on("will-quit", e => {
    if (devServerPid) {
      process.kill(devServerPid, "SIGINT");
    }
  });
}