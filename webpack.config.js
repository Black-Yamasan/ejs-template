const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const CopyPlugin = require('copy-webpack-plugin')

const constants = require('./webpack-extensions/constants')
const isProd = constants.isProd
const modeValue = constants.modeValue
const OUTPUT_DIR = constants.OUTPUT_DIR
const SRC_SCRIPT_DIR = constants.SRC_SCRIPT_DIR
const SRC_STYLE_DIR = constants.SRC_STYLE_DIR
const SRC_EJS_DIR = constants.SRC_EJS_DIR
const SRC_IMAGE_DIR = constants.SRC_IMAGE_DIR
const PORT = constants.PORT

const entries = {}
const plugins = [
  new webpack.ProvidePlugin({}),
  new RemoveEmptyScriptsPlugin({ remove: /(?<!\.rem)\.(js|mjs)$/ }),
  new MiniCssExtractPlugin({}),
  compiler => {
    compiler.hooks.compilation.tap('Compile', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'Compile',
          stage: ''
        },
        (files) => {
          Object.keys(files).forEach((fileName) => {
            const isMatchRemoveFileName = !fileName.includes('assets') && fileName.includes('.js')
            if (isMatchRemoveFileName) {
              compilation.deleteAsset(fileName)
            }
          })
        }
      )
    })
  }
]

glob.sync(SRC_SCRIPT_DIR, {
  ignore: './src/scripts/**/_*.js'
}).map((file) => {
  const regExp = new RegExp(`./src/scripts/`)
  const key = file.replace(regExp, 'assets/js/').replace(/\.js/, '')
  entries[key] = [file]
})

glob.sync(SRC_STYLE_DIR, {
  ignore: './src/styles/**/_*.scss'
}).map((file) => {
  const regExp = new RegExp(`./src/styles/pages/`)
  const key = file.replace(regExp, 'assets/css/').replace(/\.scss/, '')
  entries[key] = [file]
})

glob.sync(SRC_EJS_DIR, {
  ignore: './src/templates/**/_*.ejs'
}).map((file) => {
  const regExp = new RegExp(`./src/templates/pages/`)
  const key = file.replace(regExp, '').replace(/\.ejs/, '')
  entries[key] = [file]
})

if (glob.sync(SRC_IMAGE_DIR).length > 0) {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: SRC_IMAGE_DIR,
          context: path.resolve(__dirname, 'src', 'images'),
          to: path.resolve(__dirname, `assets/images`)
        }
      ]
    })
  )
}

module.exports = {
  entry: entries,
  mode: modeValue,
  output: {
    path: path.resolve(__dirname, OUTPUT_DIR),
    clean: true
  },
  devtool: !isProd ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, OUTPUT_DIR),
    },
    watchFiles: {
      paths: ['./src/**/*']
    },
    port: PORT,
    hot: true
  },
  watchOptions: {
    ignored: '**/node_modules',
  },
  module: {
    rules: [
      {
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
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ejs$/i,
        use: [
          {
            loader: path.resolve(__dirname, 'webpack-extensions/ejs-loader/index.js')
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          ecma: 6,
          compress: { drop_console: isProd },
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i,
            beautify: !isProd
          }
        },
        extractComments: true
      })
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
