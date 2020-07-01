import { TGracefullShutdown } from '../../../types/app';

import logger from '../../services/logger';
import uncaughtError from '../uncaughtError';
import getShutdown from './gracefullShutdown';

const SIGINT = 'SIGINT';
const SIGQUIT = 'SIGQUIT';
const SIGTERM = 'SIGTERM';

const onExit = () => {
    logger.debug(`exit`);
    __PROD__ && logger.flush();
};

const onUnhandledRejection = (err: string) => {
    logger.fatal(`unhandledRejection: reason: ${err}`);
    __PROD__ && logger.flush();
};

const onUncaughtException = (err: Error) => {
    logger.fatal({ msg: 'uncaughtException:', error: err, stack: (err || {}).stack });
    __PROD__ && logger.flush();

    // eslint-disable-next-line no-process-exit
    process.exit(1);
};

const subscribeToProcessEvents = ({ app, server }: TGracefullShutdown): void => {
    const shutdown = getShutdown({ app, server });

    app.on('error', uncaughtError);

    process.on(SIGINT, shutdown);
    process.on(SIGQUIT, shutdown);
    process.on(SIGTERM, shutdown);
    process.on('exit', onExit);
    process.on('uncaughtException', onUncaughtException);
    process.on('unhandledRejection', onUnhandledRejection);

    logger.debug('Subscribed to process events');
};

export default subscribeToProcessEvents;
