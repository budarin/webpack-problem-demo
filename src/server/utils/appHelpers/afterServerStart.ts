import os from 'os';

import logger from '../../services/logger';
import getEnvironments from './getEnvironments';

const afterServerStart = (): void => {
    const { PORT } = getEnvironments();

    if (process.send) {
        process.send('ready');
    }

    logger.info({ msg: `Service is run on: ${os.hostname()}:${PORT}` });
};

export default afterServerStart;
