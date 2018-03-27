import { app, BrowserWindow } from 'electron';
import * as path from 'path';

import './ipcRegister';

let win:BrowserWindow = null;

app.on('ready', () => {
    // 初始化启动页
    let startupWin = new BrowserWindow({
        title: 'Electron DEMO Startup'
    });
    startupWin.loadURL(`file://${path.resolve(__dirname, '../resources/startup.html')}`);

    // 初始化首页
    win = new BrowserWindow({
        title: 'Electron DEMO',
        show: false
    });
    // 首页加载好之后再显示
    win.once('ready-to-show', () => {
        win.show();
        startupWin.close();
        startupWin = null;
    });
    win.on('closed', () => win = null);

    // 模拟延时
    setTimeout(() => win.loadURL(`file://${path.resolve(__dirname, '../resources/index.html')}`), 3000);
});

app.on('window-all-closed', () => {
    app.quit();
});
