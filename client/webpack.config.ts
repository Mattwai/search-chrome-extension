import webpack from 'webpack';
import path from 'path';
import fs from 'fs-extra';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { Environment } from './utils/env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const env: Environment = require('./utils/env');

const ASSET_PATH = process.env.ASSET_PATH || '/';
const isDevelopment = process.env.NODE_ENV !== 'production';

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

// load the secrets
const secretsPath = path.join(__dirname, `secrets.${env.NODE_ENV}.js`);

const alias: { [key: string]: string } = {
  'react-dom': 'react-dom'
};

if (fs.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

const config: Configuration = {
  mode: process.env.NODE_ENV as 'development' | 'production' || 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.tsx'),
    options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.ts'),
    contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
    newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.tsx'),
    devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.ts')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.cjs'),
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': 'react-dom'
    },
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css', '.scss']),
    fallback: {
      "path": false
    }
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    !isDevelopment && new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content: Buffer) {
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
        {
          from: 'src/assets/img',
          to: path.join(__dirname, 'build'),
          force: true
        }
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
      meta: {
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self' 'unsafe-eval' http://localhost:* http://127.0.0.1:*; connect-src 'self' http://localhost:* http://127.0.0.1:*; worker-src 'self'"
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.html'),
      filename: 'newtab.html',
      chunks: ['newtab'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
      filename: 'panel.html',
      chunks: ['devtools'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
      filename: 'devtools.html',
      chunks: ['devtools'],
      cache: false,
    }),
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => {
        // Special handling for content script CSS
        if (chunk?.name === 'contentScript') {
          return 'content.styles.css';
        }
        return '[name].styles.css';
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || 'http://localhost:6900')
      }
    }),
  ].filter(Boolean) as webpack.WebpackPluginInstance[],
  infrastructureLogging: {
    level: 'info',
  },
  devServer: {
    hot: true,
    // other devServer options...
  },
  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
};

if (env.NODE_ENV === 'development') {
  config.devtool = 'cheap-module-source-map';
} else {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

export default config;