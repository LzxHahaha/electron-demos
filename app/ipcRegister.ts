import * as IPC from './utils/ipc';

IPC.on('event', (data) => {
    const str = JSON.stringify(data);
    console.log('Get event with ', str);
    return `Get data: ${str}`;
});

IPC.connection('long-event', (server) => {
    let counter = 0;
    let timer = null;

    server.onStart = () => {
        timer = setInterval(() => server.emit('count', ++counter), 1000);
    };

    server.onStop = () => {
        clearInterval(timer);
        timer = null;
    };
});
