import { Server, createServer } from 'http';
import Application from 'koa';

import { IAppState, IAppContext } from '../../../types/koa';

import getEnvironments from './getEnvironments';
import afterServerStart from './afterServerStart';
import subscribeToProcessEvents from './subscribeToProcessEvents';

const { PORT } = getEnvironments();
const ONE_KILOBYTE = 1024;

const runServer = (app: Application<IAppState, IAppContext>): Server => {
    const server = createServer(
        {
            maxHeaderSize: ONE_KILOBYTE,
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        app.callback(),
    );

    if (!module.parent) {
        server.listen(PORT, afterServerStart);

        subscribeToProcessEvents({ app, server });
    }

    return server;
};

export default runServer;
