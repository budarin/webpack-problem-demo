const path = require('path');
const webpack = require('webpack');

const HappyPack = require('happypack');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const babelConfig = require('../../babel/server.babel.config');
const cacheDir = path.resolve('./node_modules/.cache');
const getThreadLoader = (name) => ({
    loader: 'thread-loader',
    options: {
        name,
    },
});

module.exports = {
    watch: true,
    cache: true,
    target: 'node',
    profile: false,
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: './src/server/index.ts',
    output: {
        path: path.resolve('./dist/server'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: ['node_modules'],
        alias: {
            depd: path.resolve('./node_modules/depd'),
            'koa-compose': path.resolve('./node_modules/koa-compose'),
            'supports-color': path.resolve('./node_modules/supports-color'),
            'has-flag': path.resolve('./node_modules/has-flag'),
            debug: path.resolve('./node_modules/debug'),
            'ms@': path.resolve('./node_modules/ms@'),
            ioredis: 'ioredis/built/redis',
            extsprintf: path.resolve('./node_modules/extsprintf'),
            qs: path.resolve('./node_modules/qs'),
            'safe-buffer': path.resolve('./node_modules/safe-buffer'),
            // dev only for koa-static
            'http-errors': path.resolve('./node_modules/http-errors'),
            inherits: path.resolve('./node_modules/inherits'),
            setprototypeof: path.resolve('./node_modules/setprototypeof'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx|json)$/,
                include: /src/,
                exclude: /node_modules/,
                use: 'happypack/loader?id=jsx',
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(cacheDir, 'dev-client-css'),
                        },
                    },
                    getThreadLoader('client-css'),
                    'fake-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[folder]-[name]-[local]',
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    plugins: [
        new HappyPack({
            id: 'jsx',
            threads: 5,
            loaders: [
                {
                    loader: 'babel-loader',
                    babelrc: false,
                    options: Object.assign({}, babelConfig, { cacheDirectory: path.resolve(cacheDir, 'server') }),
                },
            ],
        }),

        // https://github.com/serverless-heaven/serverless-webpack/issues/78
        new webpack.IgnorePlugin(/^pg-native$/),
        new webpack.DefinePlugin({
            __PROD__: false,
            // https://github.com/felixge/node-formidable/issues/337
            'global.GENTLY': false,
        }),
        new UnusedFilesWebpackPlugin({
            failOnUnused: false,
            patterns: ['./src/server/**/*.*'],
            globOptions: {
                ignore: [
                    'node_modules/**/*',
                    './src/types/*',
                    './src/server/config/*',
                    './src/server/jest.config.js',
                    './src/**/__tests__/*',
                    './src/**/*.test.ts',
                ],
            },
        }),
        new DuplicatesPlugin(),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
        }),
    ],
};
