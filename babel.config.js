const isTesting = process.env.NODE_ENV === 'test';

module.exports = {
    comments: false,
    presets: [
        [
            '@babel/preset-env',
            {
                loose: true,
                debug: false,
                modules: isTesting ? 'commonjs' : false,
                corejs: {
                    version: 3,
                    proposals: true,
                },
                useBuiltIns: 'usage',
                targets: { node: 'current' },
            },
        ],
        '@babel/typescript',
    ],
    plugins: ['transform-promise-to-bluebird', 'preval'],
    env: {
        production: {
            ignore: ['**/*.test.tsx', '**/*.test.ts', '__snapshots__', '__tests__'],
        },
        development: {
            ignore: ['**/*.test.tsx', '**/*.test.ts', '__snapshots__', '__tests__'],
        },
        test: {
            ignore: ['__snapshots__'],
        },
    },
};
