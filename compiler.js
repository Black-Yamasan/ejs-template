const webpack = require('webpack')
const configuration = require('./webpack.config')

let compiler = webpack(configuration)

new webpack.ProgressPlugin().apply(compiler)

compiler.run((err, result) => {
  console.error('result----', result.compilation.errors)
})