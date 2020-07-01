const path = require('path');
const webpack = require('webpack');

const HappyPack = require('happypack');
const TerserPlugin = require('terser-webpack-plugin');
const ShakePlugin = require('webpack-common-shake').Plugin;
const { DuplicatesPlugin } = require('inspectpack/plugin');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;

const babelConfig = require('../../babel/server.babel.config');
const cacheDir = path.resolve('./node_modules/.cache');
const getThreadLoader = (name) => ({
    loader: 'thread-loader',
    options: {
        name,
    },
});

const config = {
    mode: 'production',
    target: 'node',
    entry: './src/server/index.ts',
    devtool: 'source-map',
    output: {
        path: path.resolve('./dist/server'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    optimization: {
        minimize: true,
        sideEffects: false,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    // mangle: false,
                    // keep_classnames: true,
                    // keep_fnames: true,
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
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
            // 'http-errors': path.resolve('./node_modules/http-errors'),
            // inherits: path.resolve('./node_modules/inherits'),
            // setprototypeof: path.resolve('./node_modules/setprototypeof'),
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
                    getThreadLoader('server-css'),
                    'fake-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[hash:8]',
                            },
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                        },
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

        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'md4',
            hashDigest: 'base64',
            hashDigestLength: 8,
        }),
        new webpack.IgnorePlugin(/pino-pretty$/),
        // https://github.com/serverless-heaven/serverless-webpack/issues/78
        new webpack.IgnorePlugin(/^pg-native$/),
        // @ts-ignore
        new DuplicatesPlugin({
            emitErrors: true,
        }),
        new webpack.DefinePlugin({
            __PROD__: true,
            // fix error https://github.com/felixge/node-formidable/issues/337
            'global.GENTLY': false,
        }),
        new UnusedFilesWebpackPlugin({
            failOnUnused: false,
            patterns: ['./src/server/**/*.*'],
            globOptions: {
                ignore: [
                    'node_modules/**/*',
                    './src/server/types/*',
                    './src/server/config/*',
                    './src/server/jest.config.js',
                    './src/**/__tests__/*.*',
                    './src/**/*.test.ts',
                ],
            },
        }),
        new WebpackDeepScopeAnalysisPlugin(),
        new ShakePlugin({
            warnings: {
                global: true,
                module: false,
            } /* default */,
        }),
    ],
};

if (!process.env.CI) {
    const StatsPlugin = require('stats-webpack-plugin');
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    config.plugins.push(
        //@ts-ignore
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'stats_report.html',
        }),
        // http://webpack.github.io/analyse/
        new StatsPlugin(
            'stats.json',
            {
                chunkModules: true,
                exclude: [/node_modules/],
            },
            {},
        ),
    );
}

module.exports = config;
