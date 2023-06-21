import { app, ipcMain } from 'electron';
import fs from 'fs';
import serve from 'electron-serve';

import { createWindow, versionCheck } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

function tryJsonParse<T>(str: string): T {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

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

    ipcMain.on('note-load-request', (event, arg) => {
        const fileName = `${arg.year}${('0' + arg.month).slice(-2)}.json`;
        const filePath = `${userDataPath}/${fileName}`;

        if (!fs.existsSync(filePath)) {
            event.sender.send('note-load', {});
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log('note-load-request', err);
                event.sender.send('note-load', {});
            } else {
                event.sender.send('note-load', tryJsonParse(data.toString()) || {});
            }
        });
    });

    ipcMain.on('note-save', (_, arg) => {
        const fileName = `${arg.year}${('0' + arg.month).slice(-2)}.json`;
        const filePath = `${userDataPath}/${fileName}`;

        fs.writeFile(filePath, JSON.stringify(arg.data), (err) => {
            if (err) {
                console.log('note-save', err);
            }
        });
    });

    ipcMain.on('config-load-request', (event) => {
        const filePath = `${userDataPath}/config.json`;

        if (!fs.existsSync(filePath)) {
            event.sender.send('config-load', {});
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log('config-load-request', err);
                event.sender.send('config-load', {});
            } else {
                event.sender.send('config-load', tryJsonParse(data.toString()) || {});
            }
        });
    });

    ipcMain.on('config-save', (_, arg) => {
        const filePath = `${userDataPath}/config.json`;

        fs.writeFile(filePath, JSON.stringify(arg), (err) => {
            if (err) {
                console.log('config-save', err);
            }
        });
    });

    const configChangeSubscribers: ((arg: any) => void)[] = [];

    ipcMain.on('config-change-subscribe', (event) => {
        configChangeSubscribers.push(event.sender.send.bind(event.sender, 'config-change-response'));
    });

    ipcMain.on('config-change', (_, arg) => {
        configChangeSubscribers.forEach((subscriber) => {
            subscriber(arg);
        });
    });

    ipcMain.on('open-setting', async () => {
        const settingWindow = createWindow('setting', {
            width: 500,
            height: 300,
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