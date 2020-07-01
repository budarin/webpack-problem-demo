import type { BaseLogger } from 'pino';
import Application, { ParameterizedContext, Context, Middleware, DefaultState } from 'koa';

interface IncomingError {
    message: string;
    code?: number;
    stack?: string;
    name?: string;
    [key: string]: any;
}

// https://github.com/koajs/koa/issues/1333
// https://github.com/ricardocasares/koats/blob/master/src/test/utils.ts\
interface IAppContext extends Context {
    state: {
        'response-time': number;
        redisTime: number;
    };
    log: BaseLogger;
    isShuttingDown: boolean;
}

interface IAppState extends DefaultState {
    body: IApiRequest;
}

type TAppContext = ParameterizedContext<IAppState, IAppContext>;
type TAppMiddleware = Middleware<IAppState, IAppContext>;
