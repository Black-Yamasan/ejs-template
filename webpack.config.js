const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const CopyPlugin = require('copy-webpack-plugin')
const minimist = require('minimist')

const entries = {}
const config = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
}
const options = minimist(process.argv.slice(2), config)
const isProd = options.env === 'prod'
const modeValue = isProd ? 'production' : 'development'
const srcImageDir = path.resolve(__dirname, `./src/images/**/*`)

const plugins = [
  new webpack.ProvidePlugin({}),
  new RemoveEmptyScriptsPlugin({ remove: /(?<!\.rem)\.(js|mjs)$/ }),
  new MiniCssExtractPlugin({})
]

glob.sync('./src/scripts/**/*.js', {
  ignore: './src/scripts/**/_*.js'
}).map((file) => {
  const regExp = new RegExp(`./src/scripts/`)
  const key = file.replace(regExp, 'assets/js/').replace(/\.js/, '')
  entries[key] = [file]
})

glob.sync('./src/styles/**/*.scss', {
  ignore: './src/styles/**/_*.scss'
}).map((file) => {
  const regExp = new RegExp(`./src/styles/pages/`)
  const key = file.replace(regExp, 'assets/css/').replace(/\.scss/, '')
  entries[key] = [file]
})

if (glob.sync(srcImageDir).length > 0) {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: srcImageDir,
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
    path: path.resolve(__dirname, '')
  },
  devtool: !isProd ? 'inline-source-map' : false,
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
      '@': path.resolve(__dirname, 'src'),
    }
  }
}
