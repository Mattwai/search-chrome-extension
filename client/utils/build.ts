import webpack from 'webpack';
import config from '../webpack.config';

webpack(config, (err) => {
  if (err) throw err;
  console.log('Build completed successfully!');
});