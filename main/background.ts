import { app, ipcMain } from 'electron';
import fs from 'fs';
import serve from 'electron-serve';

import { createWindow, versionCheck } from './helpers';
import { configEvent } from './events/config';
import { noteEvent } from './events/note';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    try {
        if (process.platform === 'win32' && process.arch === 'x64') {
            versionCheck({
                feedURL: 'https://raw.githubusercontent.com/baealex/Cally/remake/package.json',
                openURL: 'https://www.dropbox.com/sh/acxa647t1bazap6/AAAv0A-GPzLyeaotKFCuM7tHa?dl=1'
            });
        }
    } catch (e) {
        console.log('update-check-failure', e);
    }

    const userDataPath = app.getPath('appData') + '/CallyData';

    if (!fs.existsSync(userDataPath)) {
        fs.mkdir(userDataPath, (err) => {
            if (err) {
                console.log('mkdir', err);
            }
        });
    }

    configEvent(userDataPath);
    noteEvent(userDataPath);

    ipcMain.on('open-setting', async () => {
        const settingWindow = createWindow('setting', {
            width: 600,
            height: 500,
            autoHideMenuBar: isProd ? true : false
        });

        if (isProd) {
            await settingWindow.loadURL('app://./setting.html');
        } else {
            const port = process.argv[2];
            await settingWindow.loadURL(`http://localhost:${port}/setting`);
            // mainWindow.webContents.openDevTools();
        }
    });

    const mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        autoHideMenuBar: isProd ? true : false
    });

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        // mainWindow.webContents.openDevTools();
    }
})();

app.on('window-all-closed', () => {
    app.quit();
});