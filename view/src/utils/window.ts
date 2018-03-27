import { remote } from 'electron';
import BrowserWindow = Electron.BrowserWindow;

export const createWindow = (url, options?: Electron.BrowserWindowConstructorOptions): BrowserWindow => {
    let win = new remote.BrowserWindow({
        // 设置一些通用的默认参数
        ...options
    });
    const pid = win.webContents.getOSProcessId();
    console.log(pid);
    win.on('close', () => win = null);
    win.loadURL(url);
    return win;
};
