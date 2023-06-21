import fs from 'fs';
import { ipcMain } from 'electron';
import { tryJsonParse } from '../helpers/json-parse';

export function noteEvent(userDataPath: string) {
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
}