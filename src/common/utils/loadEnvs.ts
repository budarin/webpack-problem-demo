import path from 'path';
import fs from 'fs';

import dotenv from 'dotenv';

// not CI and not dev machine
if (!process.env.CI) {
    // const dotenv = require('dotenv');

    const getEnvPath = (): string => {
        switch (process.env.NODE_ENV) {
            case 'test':
                return './.env.test';
            case 'production':
                return './.env.prod';
            default:
                return './.env.dev';
        }
    };
    const envPath = getEnvPath();
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const isEnvExists = fs.existsSync(envPath);
    const result = dotenv.config({ path: path.resolve(envPath) });

    if (result.error && isEnvExists) {
        // eslint-disable-next-line fp/no-throw
        throw result.error;
    }
}
