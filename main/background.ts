import { app, ipcMain } from 'electron';
import fs from 'fs';
import serve from 'electron-serve';

import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    if (!fs.existsSync('./data')) {
        fs.mkdir('./data', (err) => {
            if (err) {
                console.log('mkdir', err);
            }
        });
    }

    ipcMain.on('note-save', (_, arg) => {
        fs.writeFile(`./data/${arg.year}${('0' + arg.month).slice(-2)}.json`, JSON.stringify(arg.data), (err) => {
            if (err) {
                console.log('note-save', err);
            }
        });
    });

    ipcMain.on('config-load-request', (event) => {
        fs.readFile('./data/config.json', (err, data) => {
            if (err) {
                console.log('config-load-request', err);
                event.sender.send('config-load', {});
            } else {
                event.sender.send('config-load', JSON.parse(data.toString()));
            }
        });
    });

    ipcMain.on('config-save', (_, arg) => {
        fs.writeFile('./data/config.json', JSON.stringify(arg), (err) => {
            if (err) {
                console.log('config-save', err);
            }
        });
    });

    ipcMain.on('note-load-request', (event, arg) => {
        fs.readFile(`./data/${arg.year}${('0' + arg.month).slice(-2)}.json`, (err, data) => {
            if (err) {
                console.log('note-load-request', err);
                event.sender.send('note-load', {});
            } else {
                event.sender.send('note-load', JSON.parse(data.toString()));
            }
        });
    });

    const mainWindow = createWindow('main', {
        width: 1000,
        height: 600
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