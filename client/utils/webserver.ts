const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const config = require('../webpack.config');

const options = {
  port: 3000,
  hot: true,
  devMiddleware: {
    writeToDisk: true,
  },
  static: {
    directory: path.join(__dirname, '../build'),
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const compiler = webpack(config);
const server = new WebpackDevServer(options, compiler);

server.startCallback(() => {
  console.log('Starting server on http://localhost:3000');
});