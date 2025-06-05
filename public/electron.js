const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = async () => {
  const isDev = (await import('electron-is-dev')).default;

  mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1200,
    height: 710,
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'icon', 'icono_vantor.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      experimentalFeatures: true,
      contextIsolation: true,
      webSecurity: true
    }
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;



  mainWindow.loadURL(startUrl);
 
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const emptyMenu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(emptyMenu);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
