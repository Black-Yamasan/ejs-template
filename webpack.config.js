const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const entries = {};
const minimist = require('minimist');
const config = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
}
const options = minimist(process.argv.slice(2), config);
let isProd = (options.env === 'prod') ? true : false;
let modeValue = null;
if (isProd) {
  modeValue = 'production';
} else {
  modeValue = 'development';
}


glob.sync('./src/pc/**/*.js', {
  ignore: './src/**/_*.js'
}).map(function (file) {
  const regExp = new RegExp(`./src/pc/js/`);
  const key = file.replace(regExp, 'assets/js/');
  entries[key] = ['babel-polyfill', file];
});

glob.sync('./src/sp/**/*.js', {
  ignore: './src/**/_*.js'
}).map(function (file) {
  const regExp = new RegExp(`./src/sp/js/`);
  const key = file.replace(regExp, 'sp/assets/js/');
  entries[key] = ['babel-polyfill', file];
});

module.exports = {
  entry: entries,
  mode: modeValue,
  output: {
    path: path.resolve(__dirname, ''),
    filename: '[name]'
  },
  devtool: !isProd ? 'inline-source-map' : false,
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env']
          ]
        }
      }],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery',
      imagesLoaded: 'imagesLoaded',
      velocity: 'velocity-animate'
    })
  ]
};
