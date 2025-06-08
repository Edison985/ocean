const { app, BrowserWindow, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
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

// Ocultar menú de navegación
const emptyMenu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(emptyMenu);

app.whenReady().then(() => {
  createWindow();


  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    console.log('Hay una actualización disponible. Descargando...');
  });

  autoUpdater.on('update-downloaded', () => {
    const result = dialog.showMessageBoxSync({
      type: 'info',
      buttons: ['Reiniciar ahora', 'Después'],
      title: 'Actualización descargada',
      message: 'Una nueva versión ha sido descargada. ¿Deseas reiniciar para aplicar la actualización?',
    });

    if (result === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cerrar app si todas las ventanas están cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
