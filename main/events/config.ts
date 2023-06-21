import fs from 'fs';
import { ipcMain } from 'electron';

import { tryJsonParse } from '../helpers/json-parse';

export function configEvent(userDataPath: string) {
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

    let configSaveTimer: NodeJS.Timeout;

    ipcMain.on('config-save', (_, arg) => {
        clearTimeout(configSaveTimer);
        configSaveTimer = setTimeout(() => {
            const filePath = `${userDataPath}/config.json`;

            fs.writeFile(filePath, JSON.stringify(arg), (err) => {
                if (err) {
                    console.log('config-save', err);
                }
            });
        }, 1000);
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
}