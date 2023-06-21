import { createStore } from 'badland';
import { ipcRenderer } from 'electron';

export const configStore = createStore({
    style: 'table' as 'table' | 'line',
    canMove: true,
    top: 0,
    left: 0,
    right: null as number,
    bottom: null as number,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    image: null as ArrayBuffer,
    defaultColor: '#000000',
    pointColor: '#ff0000',
    backgroundColor: '#ffffff',
    backgroundOpacity: '0'
});

let saveTimer: NodeJS.Timeout;

configStore.afterStateChange = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        ipcRenderer.send('config-save', configStore.state);
    }, 1000);
};