import { ipcMain, WebContents, IpcMain } from 'electron';

interface ResponseData {
    code: number,
    data?: any,
    message?: string
}

// 监听并返回结果
export const on = (channel: string, listener: Function): IpcMain => {
    return ipcMain.on(channel, async (e, args) => {
        const { id, data } = args;
        const response: ResponseData = { code: 200 };
        try {
            response.data = await listener(data);
        } catch (err) {
            response.code = err.code || 500;
            response.message = err.message || 'Main process error.';
        }
        e.sender.send(`${channel}_res_${id}`, response);
    });
};

// 监听并持续返回结果，listener中会得到LongEventServer实例，通过该实例自行监听其他事件
export const connection = (channel: string, listener: Function): IpcMain => {
    return ipcMain.on(channel, (e, args) => {
        const { id } = args;
        const server = new LongEventServer({
            channel,
            id,
            sender: e.sender
        });

        server.once('start', (e, data) => server.start(data));
        server.once('stop', (e, data) => server.stop(data));

        listener(server);
    });
};

class LongEventServer {
    private running = false;
    private channel: string;
    private id: string|number;
    private sender: WebContents;

    onStart: Function = () => {};
    onStop: Function = () => {};

    constructor({ channel, id, sender }) {
        this.channel = channel;
        this.id = id;
        this.sender = sender;
    }

    private getEventName(event: string) {
        return `${this.channel}_${this.id}_${event}`;
    }

    start(data: any) {
        if (this.running) {
            return;
        }
        this.running = true;
        this.onStart(data);
    }

    stop(data: any) {
        if (!this.running) {
            return;
        }
        this.running = false;
        this.onStop(data);
    }

    emit(event: string, data: any) {
        this.sender.send(this.getEventName(event), data);
    }

    on(channel: string, listener: Function): IpcMain {
        return ipcMain.on(this.getEventName(channel), listener);
    }
    
    once(channel: string, listener: Function): IpcMain {
        return ipcMain.once(this.getEventName(channel), listener);
    }

    removeListener(channel: string, listener: Function): IpcMain {
        return ipcMain.removeListener(this.getEventName(channel), listener);
    }

    removeAllListeners(channel: string): IpcMain {
        return ipcMain.removeAllListeners(this.getEventName(channel));
    }
}