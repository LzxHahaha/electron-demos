import { ipcRenderer } from 'electron';

let idCounter = 0;

function getID() {
    return ++idCounter;
}

export const send = (channel: string, data: any): Promise<Response> => {
    const id = getID();
    const responseEvent = `${channel}_res_${id}`;

    return new Promise((resolve, reject) => {
        ipcRenderer.once(responseEvent, (event, response) => {
            if (response.code === 200) {
                resolve(response.data);
            } else {
                console.error(response.message);
                reject(response);
            }
        });
        ipcRenderer.send(channel, { id, data });
    });
};

export const connect = (channel: string): LongEventClient => {
    return new LongEventClient(channel);
};

export class LongEventClient {
    private id: string|number;
    private channel: string;
    // 用于记录事件数量，在stop时全部取消监听
    private _events: Map<string, number> = new Map();

    constructor(channel: string) {
        this.id = getID();
        this.channel = channel;
    }

    private getEventName(event) {
        return `${this.channel}_${this.id}_${event}`;
    }

    connect() {
        ipcRenderer.send(this.channel, { id: this.id });
    }

    start(data?: any) {
        ipcRenderer.send(this.getEventName('start'), data);
    }

    stop(data?: any) {
        ipcRenderer.send(this.getEventName('stop'), data);
        this.clearEvents();
    }

    on(event: string, handler: Function): Function {
        let count = this._events.get(event);
        if (!count) {
            this._events.set(event, 1);
        } else {
            this._events.set(event, count + 1);
        }

        const listener = (e, response) => handler(response);
        ipcRenderer.on(this.getEventName(event), listener);
        return listener;
    }

    remove(event: string, listener: Function) {
        let count = this._events.get(event);
        if (!count) {
            return;
        }
        count -= 1;
        if (count === 0) {
            this._events.delete(event);
        }

        return ipcRenderer.removeListener(this.getEventName(event), listener);
    }

    removeAll(event: string) {
        this._events.delete(event);
        return ipcRenderer.removeAllListeners(this.getEventName(event));
    }

    clearEvents() {
        this._events.forEach((v, k) => this.removeAll(k));
    }
}