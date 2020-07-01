import Application from 'koa';
import { Server } from 'http';

import { IAppState, IAppContext } from './koa';

declare interface TGracefullShutdown {
    app: Application<IAppState, IAppContext>;
    server: Server;
}
