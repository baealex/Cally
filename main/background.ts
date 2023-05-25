import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import fs from 'fs';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('config-load-request', (event) => {
  fs.readFile('./config.json', (err, data) => {
    if (err) {
      console.log('config-load-request', err);
      event.sender.send('config-load', {});
    } else {
      event.sender.send('config-load', JSON.parse(data.toString()));
    }
  });
});

ipcMain.on('config-save', (_, arg) => {
  fs.writeFile('./config.json', JSON.stringify(arg), (err) => {
    if (err) {
      console.log('config-save', err);
    }
  });
});