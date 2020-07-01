import appCleanUp from './appCleanUp';
import logger from '../../services/logger';

const onServerClose = (error?: Error): void => {
    if (error) {
        // eslint-disable-next-line  fp/no-throw
        throw error;
    }

    appCleanUp();

    setTimeout(() => {
        logger.info('Service is stopped');

        // eslint-disable-next-line no-process-exit
        process.exit(0);
    }, 150);
};

export default onServerClose;
