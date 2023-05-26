import { app, dialog, ipcMain, shell } from 'electron';
import axios from 'axios';
import fs from 'fs';
import serve from 'electron-serve';

import { CompareResult, createWindow, versionCompare } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    try {
        const res = await axios.get('https://raw.githubusercontent.com/baealex/IUCalendar/remake/package.json');
        const version = res.data.version;

        if (versionCompare(version, app.getVersion()) === CompareResult.AIsBigger) {
            const dialogOpts = {
                type: 'info',
                buttons: ['예', '아니요'],
                title: '업데이트 알림',
                message: `새로운 버전(${version})이 있습니다.`,
                detail: '다운로드 페이지로 이동하시겠습니까?'
            };

            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    shell.openExternal('https://github.com/baealex/IUCalendar/releases');
                }
            });
        }
    } catch (e) {
        console.log('update-check-failure', e);
    }


    if (!fs.existsSync('./data')) {
        fs.mkdir('./data', (err) => {
            if (err) {
                console.log('mkdir', err);
            }
        });
    }

    ipcMain.on('note-load-request', (event, arg) => {
        const fileName = `${arg.year}${('0' + arg.month).slice(-2)}.json`;
        const filePath = `./data/${fileName}`;

        if (!fs.existsSync(filePath)) {
            event.sender.send('note-load', {});
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log('note-load-request', err);
                event.sender.send('note-load', {});
            } else {
                event.sender.send('note-load', JSON.parse(data.toString()));
            }
        });
    });

    ipcMain.on('note-save', (_, arg) => {
        const fileName = `${arg.year}${('0' + arg.month).slice(-2)}.json`;
        const filePath = `./data/${fileName}`;

        fs.writeFile(filePath, JSON.stringify(arg.data), (err) => {
            if (err) {
                console.log('note-save', err);
            }
        });
    });

    ipcMain.on('config-load-request', (event) => {
        const filePath = './data/config.json';

        if (!fs.existsSync(filePath)) {
            event.sender.send('config-load', {});
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log('config-load-request', err);
                event.sender.send('config-load', {});
            } else {
                event.sender.send('config-load', JSON.parse(data.toString()));
            }
        });
    });

    ipcMain.on('config-save', (_, arg) => {
        const filePath = './data/config.json';

        fs.writeFile(filePath, JSON.stringify(arg), (err) => {
            if (err) {
                console.log('config-save', err);
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