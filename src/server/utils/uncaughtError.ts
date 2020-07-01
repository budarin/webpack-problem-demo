import { stdSerializers } from 'pino';

import { IAppContext } from '../../types/koa';

function uncaughtError(error: Error, ctx: IAppContext): void {
    ctx.log.fatal({
        msg: 'Uncaught app error',
        error: stdSerializers.err(error),
        req: stdSerializers.req(ctx.re),
        res: stdSerializers.res(ctx.res),
    });

    __PROD__ && ctx.log.flush();
}

export default uncaughtError;
