import * as IPC from '../utils/ipc';

export const sendEvent = async (data: any) => {
    return await IPC.send('event', data);
};

export const getLongEventClient = () => {
    return IPC.connect('long-event');
};
