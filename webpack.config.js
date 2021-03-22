const webpack = require('webpack')
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: {
    'beat-js-slider': [ path.join(__dirname, 'src', 'beat-js-slider') ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      '@app': path.resolve(__dirname, 'src'),
    },
    fallback: {
      fs: false,
      net: false,
      process: false,
    }
  },
  module: {
    rules: [{
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: 'tslint.json',
              tsConfigFile: 'tsconfig.json'
            },
          }
        ],
      },
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `chunk-[name].css`,
    }),
    new CleanWebpackPlugin({
      allowExternal: false,
      exclude:  [],
      verbose:  true,
      dry:      false,
    }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise-promise', // works as expected
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          ecma: 5,
          warnings: false,
          parse: {},
          compress: {
            sequences: true,
            dead_code: true,
            unused: true,
            join_vars: true,
            drop_console: false,
            drop_debugger: true,
            inline: false,
            passes: 2
          },
          mangle: {
            reserved: ['beat']
          },
          module: false,
          output: {
            indent_level: 0,
            quote_style: 1,
            wrap_iife: true,
          },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      maxSize: 300000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendor: {
          test: path.resolve(process.cwd(), 'node_modules'),
          name: 'vendor',
          priority: -10,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    },
    runtimeChunk: false,
  },
}
