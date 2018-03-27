import * as React from 'react';

import { ipcRenderer, remote } from 'electron';

export default class Other extends React.Component {
    componentWillMount() {
        ipcRenderer.on('full-screen', () => {
            const window = remote.getCurrentWindow();
            window.focus();
            window.setFullScreen(true);
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('full-screen');
    }

    render() {
        return (<h1>Other page.</h1>);
    }
}