import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { createWindow } from '../utils/window';
import { sendEvent, getLongEventClient } from '../ipc/demo';
import { LongEventClient } from "../utils/ipc";

@observer
class Home extends React.Component {
    window?: Electron.BrowserWindow = null;

    @observable counter: number = 0;
    @observable connectClient?: LongEventClient = null;

    constructor(props) {
        super(props);
    }

    async onSendClick() {
        const result = await sendEvent({ message: 'text' });
        alert(result);
    }

    onStartConnectClick() {
        this.connectClient = getLongEventClient();
        this.connectClient.connect();
        this.connectClient.on('count', (counter) => {
            this.counter = counter;
        });
        this.connectClient.start();
    }

    onStopConnectClick() {
        this.connectClient.stop();
        this.connectClient = null;
    }

    onCreateClick() {
        if (this.window) {
            return;
        }
        this.window = createWindow(`${location.protocol}//${location.pathname}#/other`);
        this.window.on('closed', () => window = null);
    }

    onFullScreenClick() {
        if (!this.window) {
            return;
        }
        this.window.webContents.send('full-screen', true);
    }

    render() {
        return (
            <div>
                <h1>Hello world</h1>
                <hr/>
                <div>
                    <button onClick={() => this.onSendClick()}>发送事件</button>
                    {
                        !this.connectClient
                            ? <button onClick={() => this.onStartConnectClick()}>开启持续事件</button>
                            : <button onClick={() => this.onStopConnectClick()}>停止持续事件</button>
                    }
                    <br/>
                    counter: { this.counter }
                </div>
                <hr/>
                <div>
                    <button onClick={() => this.onCreateClick()}>新建窗口</button>
                    <button onClick={() => this.onFullScreenClick()}>全屏另一窗口</button>
                </div>

            </div>
        );
    }
}

export default Home;
