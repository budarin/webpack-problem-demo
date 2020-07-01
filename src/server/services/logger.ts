import os from 'os';
import pino from 'pino';

import apiVerion from '../utils/apiVersion';

if (!__PROD__) {
    // loadEnvs - нужен для инициализации dotenv при разработке
    // eslint-disable-next-line node/no-missing-require
    require('../../common/utils/loadEnvs');
}
const DEFAULT_REACT = {
    paths: ['environments.KEYGRIP_KEYS'],
    censor: '**Censored**',
};

const { CI = false, PORT, LOG_REDACT, LOG_LEVEL = 'info', LOGGER_FLUSH_INTERVAL = '10000' } = process.env;

const logFlushInterval = parseInt(LOGGER_FLUSH_INTERVAL, 10);

// пишем кастомную функцию чтобы не делать цикл с logger
const parseRedact = (): string[] | pino.redactOptions => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (LOG_REDACT && JSON.parse(LOG_REDACT)) || DEFAULT_REACT;
    } catch ({ message, stack }) {
        return [];
    }
};
const redact = parseRedact();
const prettyPrint = {
    prettyPrint: {
        crlf: true,
        colorize: true,
        ignore: 'role,port,version',
    },
};

const opts = {
    // не подключаем prettyPrint на проде и в тестах на CI
    ...(!__PROD__ && !CI && prettyPrint),
    // только в проде включаем цензурирование логов
    ...(__PROD__ && { redact }),
    level: LOG_LEVEL,
    base: {
        service: 'admin.web.app',
        'service-ver': apiVerion,
        hostname: os.hostname(),
        port: PORT,
    },
};

// eslint-disable-next-line fp/no-let
let logger!: pino.BaseLogger;

if (!__PROD__) {
    // eslint-disable-next-line fp/no-mutation
    logger = pino(opts, pino.destination(1));
}

if (__PROD__) {
    // eslint-disable-next-line fp/no-mutation
    logger = pino(opts, pino.destination({ minLength: 4096, sync: false }));

    if (Array.isArray(redact) && redact.length === 0) {
        logger.warn('Logger REDACT is not defined');
    }

    // asynchronously flush every 10 seconds to keep the buffer empty
    // in periods of low activity
    setInterval(function () {
        logger.flush();
    }, logFlushInterval).unref();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default logger;
