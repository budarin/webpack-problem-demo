export type TEnv = {
    NODE_ENV: string;
    PORT: number;
    REDIS_HOST: string;
    REDIS_PORT: string;
    KILL_TIMEOUT: number;
    API_HOST: string;
    API_PORT: string;
    LOG_LEVEL: string;
    KEYGRIP_KEYS: string;
};

// eslint-disable-next-line max-lines-per-function
const getEnvironments = (): TEnv => {
    const {
        NODE_ENV = 'development',

        PORT = '5000',
        KILL_TIMEOUT = '3000',
        LOG_LEVEL = 'info',

        REDIS_HOST = 'localhost',
        REDIS_PORT = '6379',

        API_HOST = 'localhost',
        API_PORT = '5000',

        KEYGRIP_KEYS = '',
    } = process.env;

    return {
        NODE_ENV,
        PORT: parseInt(PORT, 10),
        KILL_TIMEOUT: parseInt(KILL_TIMEOUT, 10),
        REDIS_HOST,
        REDIS_PORT,
        API_HOST,
        API_PORT,
        LOG_LEVEL,
        KEYGRIP_KEYS,
    };
};

export default getEnvironments;
