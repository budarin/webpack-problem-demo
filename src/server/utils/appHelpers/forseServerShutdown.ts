import appCleanUp from './appCleanUp';
import logger from '../../services/logger';
import getEnvironments from './getEnvironments';

const { KILL_TIMEOUT } = getEnvironments();

const forseServerShutdown = (): void => {
    setTimeout(() => {
        logger.warn('Force shutdown service');
        __PROD__ && logger.flush();

        appCleanUp();

        setTimeout(() => {
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }, 150);
    }, KILL_TIMEOUT).unref();
};

export default forseServerShutdown;
