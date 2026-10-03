import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'node:path'
import { globSync } from 'node:fs'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import {
  isProd,
  modeValue,
  OUTPUT_DIR,
  SRC_IMAGE_DIR,
  PORT,
  FAVICON_FILE_PATH
} from './webpack-extensions/constants.js'

const entries = {}
const plugins = [
  new webpack.ProvidePlugin({}),
  new RemoveEmptyScriptsPlugin({ remove: /(?<!\.rem)\.(js|ts|mjs)$/ }),
  new MiniCssExtractPlugin({}),
  (compiler) => {
    compiler.hooks.compilation.tap('Compile', (compilation) => {
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

globSync('./src/scripts/**/*.ts', {
  ignore: {
    ignored: (path) => {
      return path.name.startsWith('_')
    }
  }
}).map((file) => {
  const regExp = new RegExp(`src/scripts/`)
  const key = file.replace(regExp, 'assets/scripts/').replace(/\.ts/, '')
  entries[key] = `./${file}`
})

globSync('./src/styles/pages/**/*.css', {}).map((file) => {
  const regExp = new RegExp(`src/styles/pages/`)
  const key = file.replace(regExp, 'assets/css/').replace(/\.css/, '')
  entries[key] = `./${file}`
})

globSync('./src/templates/**/*.ejs', {
  ignore: {
    ignored: (path) => {
      return path.name.startsWith('_')
    }
  }
}).map((file) => {
  const regExp = new RegExp(`src/templates/pages/`)
  const key = file.replace(regExp, '').replace(/\.ejs/, '')
  entries[key] = `./${file}`
})

if (globSync(SRC_IMAGE_DIR).length > 0) {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: SRC_IMAGE_DIR,
          context: path.resolve(path.dirname(''), 'src', 'assets/images'),
          to: path.resolve(path.dirname(''), OUTPUT_DIR, `assets/images`)
        }
      ]
    })
  )
}

if (globSync(FAVICON_FILE_PATH)) {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: FAVICON_FILE_PATH,
          context: path.resolve(path.dirname(''), 'src', 'assets'),
          to: path.resolve(path.dirname(''), OUTPUT_DIR)
        }
      ]
    })
  )
}

export default {
  entry: entries,
  mode: modeValue,
  output: {
    path: path.resolve(path.dirname(''), OUTPUT_DIR),
    clean: true
  },
  devtool: !isProd ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: path.join(path.dirname(''), OUTPUT_DIR)
    },
    watchFiles: {
      paths: ['./src/**/*']
    },
    port: PORT,
    hot: true,
    open: true
  },
  watchOptions: {
    ignored: '**/node_modules'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'esbuild-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ejs$/i,
        use: [
          {
            loader: path.resolve(path.dirname(''), 'webpack-extensions/ejs-loader/cjs.js')
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
      }),
      new CssMinimizerPlugin({
        test: /\.css$/i
      })
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(path.dirname(''), 'src')
    }
  }
}
