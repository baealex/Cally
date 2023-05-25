import { createStore } from 'badland'
import { ipcRenderer } from 'electron'

export const configStore = createStore({
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
    backgroundOpacity: '0',
})

configStore.afterStateChange = () => {
    ipcRenderer.send('config-save', configStore.state)
}